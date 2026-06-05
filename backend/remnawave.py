from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone

import httpx

API_URL = os.getenv("REMNAWAVE_API_URL", "").rstrip("/")
API_TOKEN = os.getenv("REMNAWAVE_API_TOKEN", "")
SQUAD_UUID = os.getenv("REMNAWAVE_SQUAD_UUID", "")

DEFAULT_TRAFFIC_BYTES = 0
DEFAULT_DEVICE_LIMIT = 8


class RemnawaveError(RuntimeError):
    pass


def _headers() -> dict[str, str]:
    if not API_URL or not API_TOKEN:
        raise RemnawaveError("REMNAWAVE_API_URL or REMNAWAVE_API_TOKEN not set")
    return {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json",
    }


async def _request(method: str, path: str, **kwargs) -> dict:
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.request(method, f"{API_URL}{path}", headers=_headers(), **kwargs)
    if resp.status_code >= 400:
        raise RemnawaveError(f"{method} {path} → {resp.status_code}: {resp.text[:300]}")
    return resp.json().get("response", {})


async def get_user_by_username(username: str) -> dict | None:
    try:
        return await _request("GET", f"/api/users/by-username/{username}")
    except RemnawaveError as e:
        if "404" in str(e):
            return None
        raise


async def get_user(uuid: str) -> dict | None:
    try:
        return await _request("GET", f"/api/users/{uuid}")
    except RemnawaveError as e:
        if "404" in str(e):
            return None
        raise


def _belongs_to_squad(sub: dict, squad_uuid: str) -> bool:
    squads = sub.get("activeInternalSquads") or []
    return any((s.get("uuid") if isinstance(s, dict) else s) == squad_uuid for s in squads)


async def get_users_by_email(email: str, squad_uuid: str | None = None) -> list[dict]:
    try:
        resp = await _request("GET", f"/api/users/by-email/{email}")
    except RemnawaveError as e:
        if "404" in str(e):
            return []
        raise
    if isinstance(resp, list):
        users = resp
    elif isinstance(resp, dict):
        users = resp.get("users") or resp.get("response") or []
    else:
        users = []
    squad = squad_uuid or SQUAD_UUID
    if squad:
        users = [u for u in users if _belongs_to_squad(u, squad)]
    return users


async def create_user(username: str, days: int, email: str | None = None) -> dict:
    expire_at = (datetime.now(timezone.utc) + timedelta(days=days)).isoformat()
    payload: dict = {
        "username": username,
        "expireAt": expire_at,
        "trafficLimitBytes": DEFAULT_TRAFFIC_BYTES,
        "trafficLimitStrategy": "NO_RESET",
    }
    if email:
        payload["email"] = email
    user = await _request("POST", "/api/users", json=payload)
    if user.get("uuid"):
        patch: dict = {"uuid": user["uuid"], "hwidDeviceLimit": DEFAULT_DEVICE_LIMIT}
        if SQUAD_UUID:
            patch["activeInternalSquads"] = [SQUAD_UUID]
        user = await _request("PATCH", "/api/users", json=patch) or user
    return user


async def update_user_email(uuid: str, email: str) -> dict:
    return await _request("PATCH", "/api/users", json={"uuid": uuid, "email": email})


async def get_users_by_telegram_id(telegram_id: int, squad_uuid: str | None = None) -> list[dict]:
    try:
        resp = await _request("GET", f"/api/users/by-telegram-id/{telegram_id}")
    except RemnawaveError as e:
        if "404" in str(e):
            return []
        raise
    if isinstance(resp, list):
        users = resp
    elif isinstance(resp, dict):
        users = resp.get("users") or resp.get("response") or []
    else:
        users = []
    squad = squad_uuid or SQUAD_UUID
    if squad:
        users = [u for u in users if _belongs_to_squad(u, squad)]
    return users


async def extend_user(uuid: str, days: int) -> dict:
    payload = {"uuids": [uuid], "days": days}
    return await _request("POST", "/api/users/bulk/extend-expiration-date", json=payload)


async def enable_user(uuid: str) -> dict:
    return await _request("POST", f"/api/users/{uuid}/actions/enable")


async def disable_user(uuid: str) -> dict:
    return await _request("POST", f"/api/users/{uuid}/actions/disable")


async def list_user_devices(user_uuid: str) -> list[dict]:
    try:
        resp = await _request("GET", f"/api/hwid/devices/{user_uuid}")
    except RemnawaveError as e:
        if "404" in str(e):
            return []
        raise
    return resp.get("devices", []) if isinstance(resp, dict) else []


async def delete_user_device(user_uuid: str, hwid: str) -> dict:
    return await _request(
        "POST",
        "/api/hwid/devices/delete",
        json={"userUuid": user_uuid, "hwid": hwid},
    )
