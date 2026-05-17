import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy.engine import URL
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

Base = declarative_base()

# Load environment variables from repo root .env if present
repo_root = Path(__file__).resolve().parents[2]
env_path = repo_root / ".env"
if env_path.exists():
    load_dotenv(env_path)
else:
    load_dotenv()


def _get_env_value(primary_key: str, fallback_key: str) -> str:
    value = os.environ.get(primary_key) or os.environ.get(fallback_key)
    if value is None:
        raise ValueError(f"Missing required environment variable: {primary_key}")
    return value.strip()


db_username = _get_env_value("DB_USERNAME", "POSTGRES_USER")
db_password = _get_env_value("DB_PASSWORD", "POSTGRES_PASSWORD")
db_host = _get_env_value("DB_HOST", "POSTGRES_HOST")
db_port = _get_env_value("DB_PORT", "POSTGRES_PORT")
db_name = _get_env_value("DB_NAME", "POSTGRES_DB")

db_url = URL.create(
    drivername="postgresql+psycopg2",
    username=db_username,
    password=db_password,
    host=db_host,
    port=db_port,
    database=db_name,
)
# Create the SQLAlchemy engine
engine = create_engine(db_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
