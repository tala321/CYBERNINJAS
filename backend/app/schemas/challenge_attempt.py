from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime


# =====================================================
# CREATE ATTEMPT
# =====================================================

class ChallengeAttemptCreate(BaseModel):

    user_id: int

    challenge_id: int

    selected_option_id: Optional[int] = None

    answer_data: Optional[Any] = None


# =====================================================
# RESPONSE
# =====================================================

class ChallengeAttemptResponse(BaseModel):

    id: int

    user_id: int

    challenge_id: int

    selected_option_id: Optional[int] = None

    answer_data: Optional[Any] = None

    is_correct: bool

    xp_earned: int

    attempt_number: int

    attempted_at: datetime

    class Config:

        from_attributes = True


# =====================================================
# SUBMIT
# =====================================================

class ChallengeSubmitRequest(BaseModel):

    user_id: int

    selected_option_id: Optional[int] = None

    answer_data: Optional[Any] = None


# =====================================================
# SUBMIT RESPONSE
# =====================================================

class ChallengeSubmitResponse(BaseModel):

    challenge_id: int

    correct: bool

    xp_earned: int

    message: str

    next_challenge_id: Optional[int] = None

    progress: Optional[dict] = None