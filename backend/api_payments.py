from __future__ import annotations

import json

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

import auth as auth_mod
import db
import payments as pay
import remnawave

router = APIRouter(prefix="/api")

DAYS_PER_MONTH = 30


async def _create_provider_invoice(provider: str, order_id: str, amount_rub: int, description: str):
    if provider == "heleket":
        usdt = pay.rub_to_usdt(amount_rub)
        result = await pay.heleket_create_invoice(order_id, usdt)
        return result["url"], result.get("uuid"), "USD", usdt
    method = pay.PLATEGA_METHOD_CARD if provider == "platega_card" else pay.PLATEGA_METHOD_SBP
    result = await pay.platega_create_invoice(order_id, amount_rub, method, description)
    return result["redirect"], result.get("transaction_id"), "RUB", str(amount_rub)


async def _apply_paid_payment(payment) -> None:
    if payment["purpose"] != "subscription":
        return
    user = db.get_user_by_id(payment["user_id"])
    if user is None:
        return
    days = (payment["plan_months"] or 0) * DAYS_PER_MONTH
    if days <= 0:
        return
    existing = await remnawave.get_users_by_email(user["email"])
    if existing:
        primary = max(existing, key=lambda s: s.get("expireAt") or "")
        await remnawave.extend_user(primary["uuid"], days)
    else:
        await remnawave.create_user(
            username=db.random_remnawave_username(),
            days=days,
            email=user["email"],
        )


@router.get("/plans")
async def list_plans() -> dict:
    return {"plans": [{"months": m, "price_rub": p["price_rub"]} for m, p in pay.PLANS.items()]}


class BuyIn(BaseModel):
    months: int = Field(..., ge=1, le=12)
    provider: str = Field(..., pattern=r"^(heleket|platega_card|platega_sbp)$")


@router.post("/subscription/buy")
async def subscription_buy(payload: BuyIn, request: Request) -> dict:
    user = auth_mod.require_user(request)
    plan = pay.PLANS.get(payload.months)
    if plan is None:
        raise HTTPException(status_code=400, detail="Unknown plan")
    if not user["email_verified"]:
        raise HTTPException(status_code=400, detail="Подтвердите email перед покупкой")
    price_rub = plan["price_rub"]

    order_id = pay.new_order_id()
    description = f"ClickVPN — подписка на {payload.months} мес"
    try:
        pay_url, external_id, currency_sent, amount_sent = await _create_provider_invoice(
            payload.provider, order_id, price_rub, description
        )
    except pay.PaymentError as e:
        raise HTTPException(status_code=502, detail=str(e))

    db.create_payment(
        order_id=order_id,
        user_id=user["id"],
        provider=payload.provider,
        purpose="subscription",
        amount_kopecks=price_rub * 100,
        currency_sent=currency_sent,
        amount_sent=amount_sent,
        plan_months=payload.months,
        external_id=external_id,
    )
    return {"pay_url": pay_url, "order_id": order_id}


@router.get("/payments")
async def payments_history(request: Request) -> dict:
    user = auth_mod.require_user(request)
    rows = db.list_payments(user["id"], limit=20)
    return {
        "payments": [
            {
                "order_id": r["order_id"],
                "provider": r["provider"],
                "purpose": r["purpose"],
                "amount_rub": r["amount_kopecks"] / 100,
                "plan_months": r["plan_months"],
                "status": r["status"],
                "created_at": r["created_at"],
                "paid_at": r["paid_at"],
            }
            for r in rows
        ]
    }


@router.post("/payment/webhook/heleket")
async def heleket_webhook(request: Request):
    raw = await request.body()
    sign = request.headers.get("sign", "")
    if not pay.heleket_verify_signature(raw, sign):
        raise HTTPException(status_code=401, detail="bad signature")

    try:
        body = json.loads(raw)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="bad json")

    order_id = body.get("order_id") or ""
    status = (body.get("status") or "").lower()

    payment = db.get_payment(order_id)
    if payment is None:
        return JSONResponse({"ignored": True})

    if status in ("paid", "paid_over"):
        if db.mark_paid(order_id):
            await _apply_paid_payment(payment)
    elif status in ("fail", "cancel", "wrong_amount", "system_fail"):
        db.mark_failed(order_id)

    return JSONResponse({"ok": True})


@router.post("/payment/webhook/platega")
async def platega_webhook(request: Request):
    if not pay.platega_verify_headers(
        request.headers.get("X-MerchantId", ""),
        request.headers.get("X-Secret", ""),
    ):
        raise HTTPException(status_code=401, detail="bad credentials")

    body = await request.json()
    order_id = body.get("payload") or ""
    status = (body.get("status") or "").upper()

    payment = db.get_payment(order_id)
    if payment is None:
        return JSONResponse({"ignored": True})

    if status == "CONFIRMED":
        if db.mark_paid(order_id):
            await _apply_paid_payment(payment)
    elif status in ("CANCELED", "REJECTED", "FAILED", "EXPIRED"):
        db.mark_failed(order_id)

    return JSONResponse({"ok": True})
