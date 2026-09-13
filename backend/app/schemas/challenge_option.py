from pydantic import BaseModel


class ChallengeOptionBase(BaseModel):
    challenge_id: int
    option_text_ar: str
    option_text_en: str
    is_correct: bool = False
    sort_order: int = 0


class ChallengeOptionResponse(ChallengeOptionBase):
    id: int

    class Config:
        from_attributes = True