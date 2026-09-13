from typing import List, Optional

from pydantic import BaseModel, ConfigDict


# ============================================================
# CHALLENGE ITEM
# ============================================================

class ChallengeItem(BaseModel):

    id: int

    challenge_number: int

    challenge_type: str

    title_ar: str

    title_en: str

    question_ar: Optional[str] = None

    question_en: Optional[str] = None

    xp_reward: int

    # NEW
    is_started: bool = False

    # NEW
    is_completed: bool = False

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# LESSON ITEM
# Used inside UnitResponse
# ============================================================

class LessonItem(BaseModel):

    id: int

    lesson_number: int

    title_ar: str

    title_en: str

    unit_id: int

    description_ar: Optional[str] = None

    description_en: Optional[str] = None

    xp_reward: int

    challenges_count: int

    challenges: List[ChallengeItem] = []

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# LESSON RESPONSE
# Used by GET /lessons/{lesson_id}/{user_id}
# ============================================================

class LessonResponse(BaseModel):

    id: int

    lesson_number: int

    title_ar: str

    title_en: str

    unit_id: int

    level_id: int

    challenges_count: int

    is_started: bool

    is_completed: bool

    progress_percent: float

    challenges: List[ChallengeItem]

    model_config = ConfigDict(
        from_attributes=True
    )