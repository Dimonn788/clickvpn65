from __future__ import annotations

import os
import secrets
import sqlite3
import time
from contextlib import contextmanager
from pathlib import Path

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

DB_PATH = Path(os.getenv("DB_PATH", Path(__file__).parent / "clickvpn.db"))

_hasher = PasswordHasher()


@contextmanager
def _conn():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA foreign_keys = ON")
    try:
        yield con
        con.commit()
    finally:
        con.close()


def init_db() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with _conn() as c:
        c.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id               INTEGER PRIMARY KEY AUTOINCREMENT,
                email            TEXT UNIQUE NOT NULL COLLATE NOCASE,
                password_hash    TEXT NOT NULL,
                email_verified   INTEGER NOT NULL DEFAULT 0,
                remnawave_uuid   TEXT,
                remnawave_username TEXT UNIQUE,
                subscription_url TEXT,
                balance_kopecks  INTEGER NOT NULL DEFAULT 0,
                trial_used       INTEGER NOT NULL DEFAULT 0,
                created_at       INTEGER NOT NULL DEFAULT (strftime('%s','now'))
            )
            """
        )
        ucols = {row[1] for row in c.execute("PRAGMA table_info(users)").fetchall()}
        if "trial_used" not in ucols:
            c.execute("ALTER TABLE users ADD COLUMN trial_used INTEGER NOT NULL DEFAULT 0")
        if "telegram_id" not in ucols:
            c.execute("ALTER TABLE users ADD COLUMN telegram_id INTEGER")
        if "telegram_linked_at" not in ucols:
            c.execute("ALTER TABLE users ADD COLUMN telegram_linked_at INTEGER")
        if "account_number" not in ucols:
            c.execute("ALTER TABLE users ADD COLUMN account_number TEXT")
        c.execute(
            "CREATE UNIQUE INDEX IF NOT EXISTS users_account_number "
            "ON users(account_number) WHERE account_number IS NOT NULL"
        )
        c.execute(
            "CREATE UNIQUE INDEX IF NOT EXISTS users_tg_id "
            "ON users(telegram_id) WHERE telegram_id IS NOT NULL"
        )

        c.execute(
            """
            CREATE TABLE IF NOT EXISTS telegram_link_tokens (
                token       TEXT PRIMARY KEY,
                user_id     INTEGER NOT NULL,
                expires_at  INTEGER NOT NULL,
                used        INTEGER NOT NULL DEFAULT 0,
                created_at  INTEGER NOT NULL DEFAULT (strftime('%s','now')),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
            """
        )
        c.execute(
            """
            CREATE TABLE IF NOT EXISTS email_tokens (
                token       TEXT PRIMARY KEY,
                user_id     INTEGER NOT NULL,
                purpose     TEXT NOT NULL,
                expires_at  INTEGER NOT NULL,
                created_at  INTEGER NOT NULL DEFAULT (strftime('%s','now')),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
            """
        )
        c.execute("CREATE INDEX IF NOT EXISTS idx_tokens_user ON email_tokens(user_id, purpose)")

        c.execute(
            """
            CREATE TABLE IF NOT EXISTS payments (
                order_id       TEXT PRIMARY KEY,
                user_id        INTEGER NOT NULL,
                provider       TEXT NOT NULL,
                purpose        TEXT NOT NULL,
                amount_kopecks INTEGER NOT NULL,
                currency_sent  TEXT NOT NULL,
                amount_sent    TEXT NOT NULL,
                plan_months    INTEGER,
                target_uuid    TEXT,
                status         TEXT NOT NULL,
                external_id    TEXT,
                created_at     INTEGER NOT NULL DEFAULT (strftime('%s','now')),
                paid_at        INTEGER,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
            """
        )
        c.execute("CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id)")
        c.execute("CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status)")
        cols = {row[1] for row in c.execute("PRAGMA table_info(payments)").fetchall()}
        if "target_uuid" not in cols:
            c.execute("ALTER TABLE payments ADD COLUMN target_uuid TEXT")


def hash_password(password: str) -> str:
    return _hasher.hash(password)


def verify_password(password_hash: str, password: str) -> bool:
    try:
        _hasher.verify(password_hash, password)
        return True
    except VerifyMismatchError:
        return False


def random_remnawave_username() -> str:
    first = secrets.choice("123456789")
    rest = "".join(secrets.choice("0123456789") for _ in range(15))
    return first + rest


def create_user(email: str, password_hash: str = "") -> int:
    account_number = random_remnawave_username()
    with _conn() as c:
        cur = c.execute(
            "INSERT INTO users (email, password_hash, account_number) VALUES (?,?,?)",
            (email.strip().lower(), password_hash, account_number),
        )
        return cur.lastrowid


def ensure_account_number(user_id: int) -> str:
    with _conn() as c:
        row = c.execute(
            "SELECT account_number, remnawave_username FROM users WHERE id = ?",
            (user_id,),
        ).fetchone()
        if row and row["account_number"]:
            return row["account_number"]
        number = (row["remnawave_username"] if row and row["remnawave_username"] else random_remnawave_username())
        c.execute("UPDATE users SET account_number = ? WHERE id = ?", (number, user_id))
        return number


def get_user_by_email(email: str) -> sqlite3.Row | None:
    with _conn() as c:
        return c.execute(
            "SELECT * FROM users WHERE email = ?",
            (email.strip().lower(),),
        ).fetchone()


def get_user_by_id(user_id: int) -> sqlite3.Row | None:
    with _conn() as c:
        return c.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()


def mark_email_verified(user_id: int) -> None:
    with _conn() as c:
        c.execute("UPDATE users SET email_verified = 1 WHERE id = ?", (user_id,))


def update_password(user_id: int, password_hash: str) -> None:
    with _conn() as c:
        c.execute("UPDATE users SET password_hash = ? WHERE id = ?", (password_hash, user_id))


def mark_trial_used(user_id: int) -> None:
    with _conn() as c:
        c.execute("UPDATE users SET trial_used = 1 WHERE id = ?", (user_id,))


def get_user_by_telegram_id(telegram_id: int) -> sqlite3.Row | None:
    with _conn() as c:
        return c.execute(
            "SELECT * FROM users WHERE telegram_id = ?",
            (telegram_id,),
        ).fetchone()


def set_user_telegram_id(user_id: int, telegram_id: int) -> None:
    now = int(time.time())
    with _conn() as c:
        c.execute(
            "UPDATE users SET telegram_id = ?, telegram_linked_at = ? WHERE id = ?",
            (telegram_id, now, user_id),
        )


def unset_user_telegram_id(user_id: int) -> None:
    with _conn() as c:
        c.execute(
            "UPDATE users SET telegram_id = NULL, telegram_linked_at = NULL WHERE id = ?",
            (user_id,),
        )


def create_telegram_link_token(user_id: int, ttl_seconds: int) -> str:
    token = secrets.token_urlsafe(32)
    expires_at = int(time.time()) + ttl_seconds
    with _conn() as c:
        c.execute("DELETE FROM telegram_link_tokens WHERE user_id = ?", (user_id,))
        c.execute(
            "INSERT INTO telegram_link_tokens (token, user_id, expires_at) VALUES (?,?,?)",
            (token, user_id, expires_at),
        )
    return token


def consume_telegram_link_token(token: str) -> int | None:
    now = int(time.time())
    with _conn() as c:
        cur = c.execute(
            "UPDATE telegram_link_tokens SET used = 1 WHERE token = ? AND used = 0",
            (token,),
        )
        if cur.rowcount != 1:
            return None
        row = c.execute(
            "SELECT user_id, expires_at FROM telegram_link_tokens WHERE token = ?",
            (token,),
        ).fetchone()
        if row is None or row["expires_at"] < now:
            return None
        return row["user_id"]


VERIFY_TTL_SECONDS = 24 * 60 * 60
RESET_TTL_SECONDS = 60 * 60


def create_token(user_id: int, purpose: str, ttl_seconds: int) -> str:
    token = secrets.token_urlsafe(32)
    expires_at = int(time.time()) + ttl_seconds
    with _conn() as c:
        c.execute("DELETE FROM email_tokens WHERE user_id = ? AND purpose = ?", (user_id, purpose))
        c.execute(
            "INSERT INTO email_tokens (token, user_id, purpose, expires_at) VALUES (?,?,?,?)",
            (token, user_id, purpose, expires_at),
        )
    return token


def consume_token(token: str, purpose: str) -> int | None:
    now = int(time.time())
    with _conn() as c:
        row = c.execute(
            "SELECT user_id, expires_at FROM email_tokens WHERE token = ? AND purpose = ?",
            (token, purpose),
        ).fetchone()
        if row is None:
            return None
        c.execute("DELETE FROM email_tokens WHERE token = ?", (token,))
        if row["expires_at"] < now:
            return None
        return row["user_id"]


def create_payment(
    *,
    order_id: str,
    user_id: int,
    provider: str,
    purpose: str,
    amount_kopecks: int,
    currency_sent: str,
    amount_sent: str,
    plan_months: int | None,
    external_id: str | None,
    target_uuid: str | None = None,
) -> None:
    with _conn() as c:
        c.execute(
            """
            INSERT INTO payments (order_id, user_id, provider, purpose, amount_kopecks,
                                  currency_sent, amount_sent, plan_months, target_uuid,
                                  status, external_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
            """,
            (order_id, user_id, provider, purpose, amount_kopecks,
             currency_sent, amount_sent, plan_months, target_uuid, external_id),
        )


def get_payment(order_id: str) -> sqlite3.Row | None:
    with _conn() as c:
        return c.execute("SELECT * FROM payments WHERE order_id = ?", (order_id,)).fetchone()


def mark_paid(order_id: str) -> bool:
    with _conn() as c:
        cur = c.execute(
            "UPDATE payments SET status = 'paid', paid_at = ? WHERE order_id = ? AND status = 'pending'",
            (int(time.time()), order_id),
        )
        return cur.rowcount == 1


def mark_failed(order_id: str) -> None:
    with _conn() as c:
        c.execute(
            "UPDATE payments SET status = 'failed' WHERE order_id = ? AND status = 'pending'",
            (order_id,),
        )


def list_payments(user_id: int, limit: int = 20) -> list[sqlite3.Row]:
    with _conn() as c:
        return c.execute(
            "SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
            (user_id, limit),
        ).fetchall()
