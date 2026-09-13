from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Any



# =====================================================
# OPTION RESPONSE
# =====================================================

class ChallengeOptionResponse(BaseModel):

    id: int

    option_text_ar: str

    option_text_en: str

    is_correct: bool

    sort_order: int


    model_config = ConfigDict(
        from_attributes=True
    )



# =====================================================
# CHALLENGE RESPONSE
# =====================================================

class ChallengeResponse(BaseModel):

    id: int

    lesson_id: int

    challenge_number: int

    challenge_type: str


    title_ar: str

    title_en: str


    question_ar: Optional[str] = None

    question_en: Optional[str] = None


    explanation_ar: Optional[str] = None

    explanation_en: Optional[str] = None


    xp_reward: int


    content_json: Optional[dict[str, Any]] = None


    options: List[ChallengeOptionResponse] = Field(
        default_factory=list
    )


    model_config = ConfigDict(
        from_attributes=True
    )