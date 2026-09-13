from pydantic import BaseModel, ConfigDict


class LessonSummary(BaseModel):

    id: int

    title_ar: str

    title_en: str

    challenges_count: int


class UnitSummary(BaseModel):

    id: int

    title_ar: str

    title_en: str

    lessons: list[LessonSummary]



class LevelDetailsResponse(BaseModel):

    id: int

    level_number: int

    title_ar: str

    title_en: str

    description_ar: str | None = None

    description_en: str | None = None

    units: list[UnitSummary]


    model_config = ConfigDict(
        from_attributes=True
    )