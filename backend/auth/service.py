from sqlalchemy.orm import Session

from auth import repository
from auth.schemas import LoginRequest, RegisterRequest, TokenResponse
from core.security import create_access_token, hash_password, verify_password


def register_user(db: Session, payload: RegisterRequest) -> TokenResponse:
    existing = repository.get_user(db, username=payload.username)
    if existing:
        raise ValueError("username already exists")

    user = repository.create_user(
        db, username=payload.username, password_hash=hash_password(payload.password)
    )
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": user.username, "user_id": user.id})
    return TokenResponse(token=token)


def login_user(db: Session, payload: LoginRequest) -> TokenResponse:
    user = repository.get_user(db, username=payload.username)
    if not user or not verify_password(payload.password, user.password_hash):
        raise ValueError("invalid username or password")

    token = create_access_token({"sub": user.username, "user_id": user.id})
    return TokenResponse(token=token)
