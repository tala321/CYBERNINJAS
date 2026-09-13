from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


# ============================================================
# LESSON PROGRESS RESPONSE
# ============================================================

class LessonProgressResponse(BaseModel):

    is_completed: bool = False

    progress_percent: float = 0


    model_config = ConfigDict(
        from_attributes=True
    )



# ============================================================
# CHALLENGE RESPONSE
# ============================================================

class UnitChallengeResponse(BaseModel):

    id: int

    challenge_number: int

    challenge_type: str

    title_ar: str

    title_en: str

    question_ar: Optional[str] = None

    question_en: Optional[str] = None

    xp_reward: int


    # ==========================
    # CHALLENGE STATUS
    # ==========================

    is_locked: bool = False

    is_completed: bool = False


    model_config = ConfigDict(
        from_attributes=True
    )



# ============================================================
# LESSON RESPONSE
# ============================================================

class UnitLessonResponse(BaseModel):

    id: int

    unit_id: int

    lesson_number: int

    title_ar: str

    title_en: str

    description_ar: Optional[str] = None

    description_en: Optional[str] = None

    xp_reward: int

    challenges_count: int = 0


    progress: Optional[LessonProgressResponse] = None


    challenges: List[UnitChallengeResponse] = Field(
        default_factory=list
    )


    model_config = ConfigDict(
        from_attributes=True
    )



# ============================================================
# UNIT RESPONSE
# ============================================================

class UnitResponse(BaseModel):

    id: int

    level_id: int

    unit_number: int

    title_ar: str

    title_en: str

    description_ar: Optional[str] = None

    description_en: Optional[str] = None


    lessons: List[UnitLessonResponse] = Field(
        default_factory=list
    )


    model_config = ConfigDict(
        from_attributes=True
    )