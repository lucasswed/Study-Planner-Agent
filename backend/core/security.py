import os
from datetime import datetime, timedelta, timezone
from typing import Any, Dict

import bcrypt
import jwt


def _get_jwt_secret() -> str:
    secret = os.environ.get("JWT_SECRET") or os.environ.get("SECRET_KEY")
    if not secret:
        raise ValueError("Missing required environment variable: JWT_SECRET")
    return secret.strip()


def _get_jwt_algorithm() -> str:
    return os.environ.get("JWT_ALGORITHM", "HS256").strip()


def _get_jwt_exp_minutes() -> int:
    value = (
        os.environ.get("JWT_EXPIRES_MINUTES")
        or os.environ.get("JWT_EXPIRATION_MINUTES")
        or "60"
    )
    value = value.strip()
    return int(value)


def hash_password(password: str) -> str:
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    return hashed.decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def create_access_token(claims: Dict[str, Any]) -> str:
    expires_at = datetime.now(tz=timezone.utc) + timedelta(
        minutes=_get_jwt_exp_minutes()
    )
    to_encode = {**claims, "exp": expires_at}
    return jwt.encode(to_encode, _get_jwt_secret(), algorithm=_get_jwt_algorithm())
