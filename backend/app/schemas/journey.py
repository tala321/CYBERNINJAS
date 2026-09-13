from pydantic import BaseModel, ConfigDict


class JourneyLessonResponse(BaseModel):

    id: int

    lesson_number: int

    title_ar: str

    title_en: str

    challenges_count: int

    is_completed: bool

    is_started: bool

    progress_percent: float


    model_config = ConfigDict(
        from_attributes=True
    )



class JourneyUnitResponse(BaseModel):

    id: int

    unit_number: int

    title_ar: str

    title_en: str

    lessons: list[JourneyLessonResponse]


    model_config = ConfigDict(
        from_attributes=True
    )



class JourneyResponse(BaseModel):

    id: int

    level_number: int

    title_ar: str

    title_en: str

    units: list[JourneyUnitResponse]


    model_config = ConfigDict(
        from_attributes=True
    )