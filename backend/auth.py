from __future__ import annotations

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr, Field

import db
import email_service
from email_service import DevEmailSent
import remnawave

TRIAL_DAYS = 1
LOGIN_TOKEN_TTL_SECONDS = 30 * 60

router = APIRouter(prefix="/api")


def require_user(request: Request):
    user_id = request.session.get("uid")
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    row = db.get_user_by_id(user_id)
    if row is None:
        request.session.clear()
        raise HTTPException(status_code=401, detail="Not authenticated")
    return row


class LoginRequestIn(BaseModel):
    email: EmailStr


class LoginConfirmIn(BaseModel):
    token: str = Field(..., min_length=10, max_length=128)


@router.post("/login/request")
async def login_request(payload: LoginRequestIn) -> dict:
    user = db.get_user_by_email(payload.email)
    user_id = user["id"] if user is not None else db.create_user(payload.email)
    token = db.create_token(user_id, "login", LOGIN_TOKEN_TTL_SECONDS)
    try:
        await email_service.send_login_link_email(payload.email, token)
    except DevEmailSent as e:
        return {"ok": True, "dev_link": f"http://localhost:8080/auth?token={token}"}
    except email_service.EmailError as e:
        raise HTTPException(status_code=502, detail=f"Не удалось отправить письмо: {e}")
    return {"ok": True}


@router.post("/login/confirm")
async def login_confirm(payload: LoginConfirmIn, request: Request) -> dict:
    user_id = db.consume_token(payload.token, "login")
    if user_id is None:
        raise HTTPException(status_code=400, detail="Ссылка недействительна или истекла")
    user = db.get_user_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=400, detail="Аккаунт не найден")

    if not user["email_verified"]:
        db.mark_email_verified(user_id)

    account_number = db.ensure_account_number(user_id)

    if not user["trial_used"]:
        try:
            await remnawave.create_user(
                username=account_number,
                days=TRIAL_DAYS,
                email=user["email"],
            )
            db.mark_trial_used(user_id)
        except remnawave.RemnawaveError:
            pass

    request.session["uid"] = user_id
    return {"ok": True, "email": user["email"]}


@router.post("/logout")
async def logout(request: Request) -> dict:
    request.session.clear()
    return {"ok": True}


async def _user_subscriptions(user) -> list[dict]:
    subs = await remnawave.get_users_by_email(user["email"])
    if not subs and user["remnawave_uuid"]:
        try:
            await remnawave.update_user_email(user["remnawave_uuid"], user["email"])
            subs = await remnawave.get_users_by_email(user["email"])
        except remnawave.RemnawaveError:
            pass
    return subs


def _pick_primary(subs: list[dict]) -> dict | None:
    if not subs:
        return None
    active = [s for s in subs if (s.get("status") or "").upper() == "ACTIVE"]
    pool = active if active else subs
    return max(pool, key=lambda s: s.get("expireAt") or "")


@router.get("/me")
async def me(request: Request) -> dict:
    user = require_user(request)
    account_number = user["account_number"] or db.ensure_account_number(user["id"])
    base = {
        "id": user["id"],
        "username": account_number,
        "email": user["email"],
        "email_verified": bool(user["email_verified"]),
        "telegram_linked": bool(user["telegram_id"]),
        "subscription_url": None,
        "expire_at": None,
        "traffic_used_bytes": 0,
        "traffic_limit_bytes": 0,
        "device_limit": None,
        "status": None,
    }
    if not user["email_verified"]:
        return base

    try:
        subs = await _user_subscriptions(user)
    except remnawave.RemnawaveError:
        return base

    primary = _pick_primary(subs)
    if primary is None:
        return base

    user_traffic = primary.get("userTraffic") or {}
    base.update({
        "subscription_url": primary.get("subscriptionUrl"),
        "expire_at": primary.get("expireAt"),
        "traffic_used_bytes": user_traffic.get("usedTrafficBytes", 0),
        "traffic_limit_bytes": primary.get("trafficLimitBytes", 0),
        "device_limit": primary.get("hwidDeviceLimit"),
        "status": primary.get("status"),
    })
    return base


@router.get("/subscriptions")
async def subscriptions(request: Request) -> dict:
    user = require_user(request)
    if not user["email_verified"]:
        return {"subscriptions": []}
    try:
        subs = await _user_subscriptions(user)
    except remnawave.RemnawaveError:
        return {"subscriptions": []}
    return {
        "subscriptions": [
            {
                "uuid": s.get("uuid"),
                "username": s.get("username"),
                "subscription_url": s.get("subscriptionUrl"),
                "expire_at": s.get("expireAt"),
                "status": s.get("status"),
                "traffic_used_bytes": (s.get("userTraffic") or {}).get("usedTrafficBytes", 0),
                "traffic_limit_bytes": s.get("trafficLimitBytes", 0),
                "device_limit": s.get("hwidDeviceLimit"),
            }
            for s in subs
        ]
    }


async def _resolve_subscription_uuid(user, uuid: str | None) -> str | None:
    subs = await _user_subscriptions(user)
    if uuid:
        for s in subs:
            if s.get("uuid") == uuid:
                return uuid
        return None
    primary = _pick_primary(subs)
    return primary.get("uuid") if primary else None


@router.get("/devices")
async def devices(request: Request, uuid: str | None = None) -> dict:
    user = require_user(request)
    if not user["email_verified"]:
        return {"devices": []}
    try:
        sub_uuid = await _resolve_subscription_uuid(user, uuid)
        if sub_uuid is None:
            return {"devices": []}
        items = await remnawave.list_user_devices(sub_uuid)
    except remnawave.RemnawaveError:
        return {"devices": []}
    return {"devices": items}


class DeleteDeviceIn(BaseModel):
    hwid: str = Field(..., min_length=1, max_length=512)
    uuid: str | None = None


@router.post("/devices/delete")
async def delete_device(payload: DeleteDeviceIn, request: Request) -> dict:
    user = require_user(request)
    if not user["email_verified"]:
        raise HTTPException(status_code=400, detail="Подтвердите email")
    sub_uuid = await _resolve_subscription_uuid(user, payload.uuid)
    if sub_uuid is None:
        raise HTTPException(status_code=400, detail="Подписка не найдена")
    await remnawave.delete_user_device(sub_uuid, payload.hwid)
    return {"ok": True}
