from typing import Optional

from sqlalchemy.orm import Session

from auth.models import User


def create_user(db: Session, username: str, password_hash: str) -> User:
    user = User(username=username, password_hash=password_hash)
    db.add(user)
    return user


def get_user(
    db: Session, *, username: Optional[str] = None, user_id: Optional[int] = None
) -> Optional[User]:
    if username is None and user_id is None:
        raise ValueError("Either username or user_id must be provided")

    query = db.query(User)
    if user_id is not None:
        return query.filter(User.id == user_id).first()
    return query.filter(User.username == username).first()
