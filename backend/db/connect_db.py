import os
from dotenv import load_dotenv
from sqlalchemy.engine import URL
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

Base = declarative_base()

# Load environment variables from .env file
load_dotenv()

db_username = os.environ.get("DB_USERNAME")
if not db_username:
    raise ValueError("Missing required environment variable: DB_USERNAME")

db_password = os.environ.get("DB_PASSWORD")
if not db_password:
    raise ValueError("Missing required environment variable: DB_PASSWORD")

db_host = os.environ.get("DB_HOST")
if not db_host:
    raise ValueError("Missing required environment variable: DB_HOST")

db_port = os.environ.get("DB_PORT")
if not db_port:
    raise ValueError("Missing required environment variable: DB_PORT")

db_name = os.environ.get("DB_NAME")
if not db_name:
    raise ValueError("Missing required environment variable: DB_NAME")

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
