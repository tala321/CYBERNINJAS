import os
from datetime import datetime, timedelta, timezone

import bcrypt
from jose import jwt
from dotenv import load_dotenv


# =====================================================
# ENVIRONMENT
# =====================================================

load_dotenv()


# =====================================================
# SECURITY SETTINGS
# =====================================================

SECRET_KEY = os.getenv("SECRET_KEY")

ALGORITHM = os.getenv(
    "ALGORITHM",
    "HS256"
)

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        "60"
    )
)


if not SECRET_KEY:
    raise RuntimeError(
        "SECRET_KEY is not configured. "
        "Please create a .env file with SECRET_KEY."
    )


# =====================================================
# PASSWORD HASHING
# =====================================================

def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.

    bcrypt only supports passwords up to 72 bytes,
    so we explicitly truncate the UTF-8 encoded password.
    """

    password_bytes = password.encode("utf-8")[:72]

    salt = bcrypt.gensalt()

    hashed = bcrypt.hashpw(
        password_bytes,
        salt
    )

    return hashed.decode("utf-8")


# =====================================================
# VERIFY PASSWORD
# =====================================================

def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    """
    Verify a plain password against a bcrypt hash.
    """

    try:
        password_bytes = plain_password.encode("utf-8")[:72]

        hashed_bytes = hashed_password.encode("utf-8")

        return bcrypt.checkpw(
            password_bytes,
            hashed_bytes
        )

    except (ValueError, TypeError):
        return False


# =====================================================
# CREATE ACCESS TOKEN
# =====================================================

def create_access_token(data: dict) -> str:

    to_encode = data.copy()

    expire = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    to_encode.update(
        {
            "exp": expire
        }
    )

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )