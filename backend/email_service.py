from __future__ import annotations

import os

import httpx

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
EMAIL_FROM = os.getenv("EMAIL_FROM", "ClickVPN <noreply@clickvpn.top>")
PUBLIC_URL = os.getenv("PUBLIC_URL", "https://clickvpn.org").rstrip("/")

RESEND_API = "https://api.resend.com/emails"


class EmailError(RuntimeError):
    pass


class DevEmailSent(Exception):
    """Raised in dev mode so callers can expose the link."""
    def __init__(self, text: str):
        self.text = text


async def _send(to: str, subject: str, html: str, text: str) -> None:
    if not RESEND_API_KEY:
        print(f"\n[DEV] Email to {to!r}:\n{text}\n", flush=True)
        raise DevEmailSent(text)
    payload = {
        "from": EMAIL_FROM,
        "to": [to],
        "subject": subject,
        "html": html,
        "text": text,
    }
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(
            RESEND_API,
            headers={"Authorization": f"Bearer {RESEND_API_KEY}", "Content-Type": "application/json"},
            json=payload,
        )
    if resp.status_code >= 400:
        raise EmailError(f"Resend {resp.status_code}: {resp.text[:300]}")


def _wrap(title: str, body_html: str, button_label: str, button_url: str, footer_note: str) -> str:
    return f"""\
<!doctype html>
<html><body style="margin:0;padding:0;background:#0c0c0c;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#ededec;">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px;">
    <div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:18px;letter-spacing:-0.02em;margin-bottom:32px;">
      <span style="display:inline-block;width:28px;height:28px;background:#3d4555;border-radius:8px;vertical-align:middle;margin-right:8px;"></span>
      Click<span style="color:#a1a1a0;font-weight:400;">VPN</span>
    </div>
    <h1 style="font-size:24px;font-weight:700;margin:0 0 16px;letter-spacing:-0.02em;">{title}</h1>
    <div style="font-size:15px;color:#a1a1a0;line-height:1.5;margin-bottom:28px;">{body_html}</div>
    <a href="{button_url}" style="display:inline-block;padding:14px 28px;background:#3d4555;color:#e8eaf0;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;">
      {button_label}
    </a>
    <div style="font-size:13px;color:#6b6b69;margin-top:32px;line-height:1.5;">{footer_note}</div>
    <div style="font-size:12px;color:#6b6b69;margin-top:32px;border-top:1px solid #1d1d1d;padding-top:16px;">
      Если кнопка не работает, скопируйте ссылку:<br>
      <span style="color:#8a8579;word-break:break-all;">{button_url}</span>
    </div>
  </div>
</body></html>"""


async def send_login_link_email(to: str, token: str) -> None:
    link = f"{PUBLIC_URL}/auth?token={token}"
    html = _wrap(
        title="Вход в ClickVPN",
        body_html="Нажмите кнопку ниже, чтобы войти в свой аккаунт. Ссылка действует 30 минут.",
        button_label="Войти",
        button_url=link,
        footer_note="Если вы не запрашивали вход — просто проигнорируйте это письмо.",
    )
    text = (
        "Вход в ClickVPN\n\n"
        "Нажмите ссылку ниже, чтобы войти. Ссылка действует 30 минут.\n\n"
        f"{link}\n\n"
        "Если вы не запрашивали вход — проигнорируйте это письмо."
    )
    await _send(to, "Вход — ClickVPN", html, text)
