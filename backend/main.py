import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware

import api_payments
import auth
import db
import telegram_link

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
SESSION_SECRET = os.environ["SESSION_SECRET"]
# Allow overriding https_only for local development via env var SESSION_HTTPS_ONLY
SESSION_HTTPS_ONLY = os.getenv("SESSION_HTTPS_ONLY", "false").lower() == "true"
# Comma-separated list of allowed CORS origins (for dev; leave empty in prod)
_cors_raw = os.getenv("CORS_ALLOW_ORIGINS", "")
CORS_ORIGINS = [o.strip() for o in _cors_raw.split(",") if o.strip()]


@asynccontextmanager
async def lifespan(_app: FastAPI):
    db.init_db()
    yield


app = FastAPI(title="ClickVPN Web", lifespan=lifespan)

if CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.add_middleware(
    SessionMiddleware,
    secret_key=SESSION_SECRET,
    https_only=SESSION_HTTPS_ONLY,
    same_site="lax",
    max_age=60 * 60 * 24 * 90,
)
app.include_router(auth.router)
app.include_router(api_payments.router)
app.include_router(telegram_link.router)
app.mount("/assets", StaticFiles(directory=STATIC_DIR), name="assets")


@app.get("/healthz")
def healthz():
    return {"ok": True}


@app.get("/{path:path}")
def spa(path: str):
    return FileResponse(STATIC_DIR / "index.html")
