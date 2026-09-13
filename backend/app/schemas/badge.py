from datetime import datetime
from pydantic import BaseModel, ConfigDict


class BadgeResponse(BaseModel):

    id: int

    name_ar: str

    name_en: str

    description_ar: str | None = None

    description_en: str | None = None

    image_url: str | None = None

    xp_reward: int

    unlock_level: int


    model_config = ConfigDict(
        from_attributes=True
    )



class UserBadgeResponse(BaseModel):

    id: int

    badge_id: int

    earned_at: datetime | None = None

    badge: BadgeResponse


    model_config = ConfigDict(
        from_attributes=True
    )