from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.user import User
from app.models.avatar import Avatar

from app.schemas.user import (
    UserCreate,
    UserResponse,
    TokenResponse,
    CurrentUserResponse
)

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)

from app.core.dependencies import get_current_user

from app.core.rate_limit import limiter


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =====================================================
# REGISTER
# =====================================================

@router.post(
    "/register",
    response_model=UserResponse
)
@limiter.limit("3/minute")
def register(
    request: Request,
    user_data: UserCreate,
    db: Session = Depends(get_db)
):

    # ===============================
    # CHECK EMAIL
    # ===============================

    email_exists = (
        db.query(User)
        .filter(
            User.email == user_data.email
        )
        .first()
    )

    if email_exists:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # ===============================
    # CHECK USERNAME
    # ===============================

    username_exists = (
        db.query(User)
        .filter(
            User.username == user_data.username
        )
        .first()
    )

    if username_exists:
        raise HTTPException(
            status_code=400,
            detail="Username already taken"
        )

    # ===============================
    # CHECK AVATAR
    # ===============================

    avatar_id = None

    if user_data.avatar_id is not None:

        avatar = (
            db.query(Avatar)
            .filter(
                Avatar.id == user_data.avatar_id,
                Avatar.is_active == True
            )
            .first()
        )

        if not avatar:
            raise HTTPException(
                status_code=400,
                detail="Avatar not found"
            )

        avatar_id = avatar.id

    # ===============================
    # CREATE USER
    # ===============================

    user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hash_password(
            user_data.password
        ),
        display_name=user_data.display_name,
        avatar_id=avatar_id,
        xp=0,
        current_level=1,
        streak_days=0,
        language=user_data.language or "en",
        is_active=True,
        role="child"
    )

    try:

        db.add(user)
        db.commit()
        db.refresh(user)

    except Exception:

        db.rollback()

        # لا نرسل تفاصيل خطأ قاعدة البيانات
        # للمستخدم في Production
        raise HTTPException(
            status_code=500,
            detail="Failed to create account"
        )

    return user


# =====================================================
# LOGIN
# OAuth2 Swagger Compatible
# =====================================================

@router.post(
    "/login",
    response_model=TokenResponse
)
@limiter.limit("5/minute")
def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    # Swagger sends username
    # We use username field as email OR username

    user = (
        db.query(User)
        .filter(
            (User.email == form_data.username)
            |
            (User.username == form_data.username)
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        form_data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Account disabled"
        )

    token = create_access_token(
        {
            "sub": str(user.id),
            "email": user.email
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }


# =====================================================
# CURRENT USER
# =====================================================

@router.get(
    "/me",
    response_model=CurrentUserResponse
)
def me(
    current_user: User = Depends(get_current_user)
):

    return current_user