import pytest
from sqlalchemy import create_engine
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import sessionmaker
from db.connect_db import Base


@pytest.fixture
def db():
    engine = create_engine("sqlite:///:memory:")
    from auth import models  # noqa: F401

    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session  # aqui corre o teste
    session.close()
    Base.metadata.drop_all(engine)


def test_create_user_returns_user(db):
    from auth.repository import create_user

    user = create_user(db, username="testuser", password_hash="hashedpassword")
    db.commit()
    db.refresh(user)
    assert user.id is not None
    assert user.username == "testuser"
    assert user.password_hash == "hashedpassword"


def test_get_user_returns_user_when_exists(db):
    from auth.repository import create_user, get_user

    user = create_user(db, username="testuser", password_hash="hashedpassword")
    db.commit()
    db.refresh(user)

    found = get_user(db, username="testuser")

    assert found is not None
    assert found.id == user.id
    assert found.username == user.username


def test_get_user_returns_none_when_not_exists(db):
    from auth.repository import get_user

    found = get_user(db, username="missinguser")

    assert found is None


def test_create_user_duplicate_username_raises_error(db):
    from auth.repository import create_user

    create_user(db, username="testuser", password_hash="hashedpassword")
    db.commit()

    create_user(db, username="testuser", password_hash="hashedpassword")
    with pytest.raises(IntegrityError):
        db.commit()
    db.rollback()
