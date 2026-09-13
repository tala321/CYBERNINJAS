from pydantic import BaseModel, EmailStr, ConfigDict


# =====================================================
# USER CREATE
# =====================================================

class UserCreate(BaseModel):

    username: str

    email: EmailStr

    password: str

    display_name: str | None = None

    avatar_id: int | None = None

    language: str = "ar"



# =====================================================
# LOGIN
# =====================================================

class UserLogin(BaseModel):

    email: EmailStr

    password: str



# =====================================================
# USER RESPONSE
# =====================================================

class UserResponse(BaseModel):

    id: int

    username: str

    email: str

    display_name: str | None

    avatar_id: int | None

    xp: int

    current_level: int

    streak_days: int

    language: str

    role: str

    model_config = ConfigDict(
        from_attributes=True
    )



# =====================================================
# PROFILE UPDATE
# =====================================================

class ProfileUpdate(BaseModel):

    display_name: str | None = None

    avatar_id: int | None = None

    language: str | None = None



# =====================================================
# TOKEN RESPONSE
# =====================================================

class TokenResponse(BaseModel):

    access_token: str

    token_type: str

    user: UserResponse



# =====================================================
# CURRENT USER
# =====================================================

class CurrentUserResponse(UserResponse):

    pass