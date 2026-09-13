from typing import Optional, List

from pydantic import BaseModel, ConfigDict


class BossOptionResponse(BaseModel):

    id: int

    option_text_ar: str

    option_text_en: str

    sort_order: int


class BossQuestionResponse(BaseModel):

    id: int

    challenge_number: int

    challenge_type: str

    title_ar: str

    title_en: str

    question_ar: Optional[str] = None

    question_en: Optional[str] = None

    xp_reward: int

    options: List[BossOptionResponse] = []


class BossResponse(BaseModel):

    id: int

    level_id: int

    title_ar: str

    title_en: str

    description_ar: Optional[str] = None
    description_en: Optional[str] = None

    xp_reward: int

    time_limit_seconds: int

    questions_count: int

    questions: List[BossQuestionResponse] = []

    model_config = ConfigDict(
        from_attributes=True
    )