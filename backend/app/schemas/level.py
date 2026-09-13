from pydantic import BaseModel, ConfigDict



class LessonDetailResponse(BaseModel):

    id: int

    title_ar: str

    title_en: str

    challenges_count: int



class UnitDetailResponse(BaseModel):

    id: int

    title_ar: str

    title_en: str

    lessons: list[LessonDetailResponse]



class LevelResponse(BaseModel):

    id: int

    level_number: int

    title_ar: str

    title_en: str

    description_ar: str | None = None

    description_en: str | None = None

    is_locked: bool = False


    model_config = ConfigDict(
        from_attributes=True
    )



class LevelDetailResponse(BaseModel):

    id: int

    level_number: int

    title_ar: str

    title_en: str

    description_ar: str | None = None

    description_en: str | None = None

    units: list[UnitDetailResponse]

