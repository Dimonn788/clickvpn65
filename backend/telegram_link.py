from __future__ import annotations

import os
from datetime import datetime, timezone

from fastapi import APIRouter, Header, HTTPException, Request
from pydantic import BaseModel, Field

import auth as auth_mod
import db
import remnawave

INTERNAL_API_TOKEN = os.getenv("INTERNAL_API_TOKEN", "")
INTERNAL_API_ALLOWED_IPS = {
    ip.strip()
    for ip in os.getenv("INTERNAL_API_ALLOWED_IPS", "").split(",")
    if ip.strip()
}
TELEGRAM_BOT_USERNAME = os.getenv("TELEGRAM_BOT_USERNAME", "").lstrip("@")
LINK_TOKEN_TTL_SECONDS = 10 * 60

router = APIRouter(prefix="/api")


def _client_ip(request: Request) -> str:
    real = request.headers.get("x-real-ip", "")
    if real:
        return real.strip()
    fwd = request.headers.get("x-forwarded-for", "")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else ""


def _check_internal_auth(request: Request, x_internal_token: str | None) -> None:
    if not INTERNAL_API_TOKEN:
        raise HTTPException(status_code=503, detail="Internal API not configured")
    if x_internal_token != INTERNAL_API_TOKEN:
        raise HTTPException(status_code=401, detail="bad token")
    if INTERNAL_API_ALLOWED_IPS:
        ip = _client_ip(request)
        if ip not in INTERNAL_API_ALLOWED_IPS:
            raise HTTPException(status_code=403, detail="ip not allowed")


@router.post("/telegram/link/start")
async def link_start(request: Request) -> dict:
    user = auth_mod.require_user(request)
    if not TELEGRAM_BOT_USERNAME:
        raise HTTPException(status_code=503, detail="Бот ещё не настроен")
    if user["telegram_id"]:
        raise HTTPException(status_code=409, detail="Telegram уже привязан")
    token = db.create_telegram_link_token(user["id"], LINK_TOKEN_TTL_SECONDS)
    deeplink = f"https://t.me/{TELEGRAM_BOT_USERNAME}?start=link_{token}"
    return {"deeplink_url": deeplink, "expires_in": LINK_TOKEN_TTL_SECONDS}


@router.post("/telegram/unlink")
async def unlink(request: Request) -> dict:
    user = auth_mod.require_user(request)
    if user["telegram_id"]:
        db.unset_user_telegram_id(user["id"])
    return {"ok": True}


async def _migrate_telegram_subscriptions(user_email: str, telegram_id: int) -> int:
    tg_subs = await remnawave.get_users_by_telegram_id(telegram_id)
    active_tg = [s for s in tg_subs if (s.get("status") or "").upper() == "ACTIVE"]
    if not active_tg:
        return 0

    winner = max(active_tg, key=lambda s: s.get("expireAt") or "")
    winner_uuid = winner.get("uuid")
    if not winner_uuid:
        return 0

    try:
        await remnawave.update_user_email(winner_uuid, user_email)
    except remnawave.RemnawaveError:
        return 0

    web_subs = await remnawave.get_users_by_email(user_email)
    now = datetime.now(timezone.utc)
    carry_over_days = 0
    to_disable: list[str] = []

    for sub in web_subs:
        sub_uuid = sub.get("uuid")
        if not sub_uuid or sub_uuid == winner_uuid:
            continue
        if (sub.get("status") or "").upper() != "ACTIVE":
            continue
        expire_at_str = sub.get("expireAt")
        if expire_at_str:
            try:
                expire_at = datetime.fromisoformat(expire_at_str.replace("Z", "+00:00"))
                days_left = max(0, (expire_at - now).days)
                if days_left > 0:
                    carry_over_days += days_left
            except (TypeError, ValueError):
                pass
        to_disable.append(sub_uuid)

    if carry_over_days > 0:
        try:
            await remnawave.extend_user(winner_uuid, carry_over_days)
        except remnawave.RemnawaveError:
            pass

    for uuid in to_disable:
        try:
            await remnawave.disable_user(uuid)
        except remnawave.RemnawaveError:
            pass

    return carry_over_days


class ConfirmIn(BaseModel):
    token: str = Field(..., min_length=10, max_length=128)
    telegram_id: int = Field(..., ge=1)


@router.post("/internal/telegram/link/confirm")
async def link_confirm(
    payload: ConfirmIn,
    request: Request,
    x_internal_token: str | None = Header(None, alias="X-Internal-Token"),
) -> dict:
    _check_internal_auth(request, x_internal_token)

    raw_token = payload.token
    if raw_token.startswith("link_"):
        raw_token = raw_token[5:]

    existing_link = db.get_user_by_telegram_id(payload.telegram_id)
    user_id = db.consume_telegram_link_token(raw_token)
    if user_id is None:
        raise HTTPException(status_code=410, detail="link expired or invalid")

    user = db.get_user_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=410, detail="account not found")

    if existing_link is not None and existing_link["id"] == user_id:
        return {"ok": True, "email": user["email"], "transferred_days": 0}

    if existing_link is not None and existing_link["id"] != user_id:
        raise HTTPException(
            status_code=409,
            detail="this telegram is already linked to another account",
        )

    if user["telegram_id"] and user["telegram_id"] != payload.telegram_id:
        raise HTTPException(
            status_code=409,
            detail="this account is already linked to a different telegram",
        )

    db.set_user_telegram_id(user_id, payload.telegram_id)

    try:
        transferred_days = await _migrate_telegram_subscriptions(user["email"], payload.telegram_id)
    except remnawave.RemnawaveError:
        transferred_days = 0

    return {"ok": True, "email": user["email"], "transferred_days": transferred_days}
