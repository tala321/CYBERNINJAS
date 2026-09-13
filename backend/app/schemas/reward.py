from pydantic import BaseModel, ConfigDict


class RewardResponse(BaseModel):

    id: int

    name_ar: str

    name_en: str

    description_ar: str | None = None

    description_en: str | None = None

    reward_type: str

    reward_value: int | None = None

    image_url: str | None = None

    is_active: bool

    created_at: object | None = None

    model_config = ConfigDict(
        from_attributes=True
    )

