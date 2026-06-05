from __future__ import annotations

import base64
import hashlib
import json
import os
import secrets

import httpx

PLANS: dict[int, dict] = {
    1:  {"price_rub": 109,  "price_usdt": "1.36"},
    3:  {"price_rub": 299,  "price_usdt": "3.74"},
    6:  {"price_rub": 589,  "price_usdt": "7.36"},
    12: {"price_rub": 1099, "price_usdt": "13.74"},
}

USDT_PER_RUB = 0.0125


HELEKET_MERCHANT_ID = os.getenv("HELEKET_MERCHANT_ID", "")
HELEKET_API_KEY = os.getenv("HELEKET_API_KEY", "")
PLATEGA_MERCHANT_ID = os.getenv("PLATEGA_MERCHANT_ID", "")
PLATEGA_SECRET = os.getenv("PLATEGA_SECRET", "")

PLATEGA_URL = "https://app.platega.io"
HELEKET_URL = "https://api.heleket.com/v1"

PLATEGA_METHOD_SBP = 2
PLATEGA_METHOD_CARD = 11

RETURN_URL = os.getenv("PAYMENT_RETURN_URL", "https://clickvpn.org/cabinet")
FAILED_URL = os.getenv("PAYMENT_FAILED_URL", "https://clickvpn.org/cabinet")


class PaymentError(RuntimeError):
    pass


def new_order_id() -> str:
    return "ord_" + secrets.token_hex(16)


def rub_to_usdt(amount_rub: int) -> str:
    return f"{amount_rub * USDT_PER_RUB:.2f}"


def _heleket_sign(raw_json: str) -> str:
    b64 = base64.b64encode(raw_json.encode()).decode()
    return hashlib.md5((b64 + HELEKET_API_KEY).encode()).hexdigest()


def heleket_verify_signature(raw_body: bytes, sign_header: str) -> bool:
    if not HELEKET_API_KEY or not sign_header:
        return False
    expected = _heleket_sign(raw_body.decode())
    return secrets.compare_digest(expected, sign_header)


async def heleket_create_invoice(order_id: str, amount_usdt: str) -> dict:
    if not HELEKET_MERCHANT_ID or not HELEKET_API_KEY:
        raise PaymentError("HELEKET credentials not set")
    callback_url = os.getenv("PUBLIC_URL", "https://clickvpn.org").rstrip("/") + "/api/payment/webhook/heleket"
    data = {
        "amount": amount_usdt,
        "currency": "USD",
        "order_id": order_id,
        "lifetime": "3600",
        "url_callback": callback_url,
        "url_return": RETURN_URL,
        "url_success": RETURN_URL,
    }
    raw = json.dumps(data, separators=(",", ":"))
    headers = {
        "merchant": HELEKET_MERCHANT_ID,
        "sign": _heleket_sign(raw),
        "Content-Type": "application/json",
    }
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(f"{HELEKET_URL}/payment", headers=headers, content=raw)
    if resp.status_code != 200:
        raise PaymentError(f"Heleket: {resp.status_code} {resp.text[:200]}")
    result = resp.json().get("result")
    if not result or not result.get("url"):
        raise PaymentError(f"Heleket: malformed response {resp.text[:200]}")
    return result


def _platega_headers() -> dict[str, str]:
    if not PLATEGA_MERCHANT_ID or not PLATEGA_SECRET:
        raise PaymentError("PLATEGA credentials not set")
    return {
        "X-MerchantId": PLATEGA_MERCHANT_ID,
        "X-Secret": PLATEGA_SECRET,
        "Content-Type": "application/json",
    }


def platega_verify_headers(merchant_header: str, secret_header: str) -> bool:
    if not PLATEGA_MERCHANT_ID or not PLATEGA_SECRET:
        return False
    return (
        secrets.compare_digest(merchant_header or "", PLATEGA_MERCHANT_ID)
        and secrets.compare_digest(secret_header or "", PLATEGA_SECRET)
    )


async def platega_create_invoice(order_id: str, amount_rub: int, method: int, description: str) -> dict:
    payload = {
        "paymentMethod": method,
        "paymentDetails": {"amount": amount_rub, "currency": "RUB"},
        "description": description,
        "return": RETURN_URL,
        "failedUrl": FAILED_URL,
        "payload": order_id,
    }
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(
            f"{PLATEGA_URL}/transaction/process",
            headers=_platega_headers(),
            json=payload,
        )
    if resp.status_code != 200:
        raise PaymentError(f"Platega: {resp.status_code} {resp.text[:200]}")
    data = resp.json()
    if not data.get("redirect"):
        raise PaymentError(f"Platega: malformed response {resp.text[:200]}")
    return {"transaction_id": data.get("transactionId"), "redirect": data["redirect"]}
