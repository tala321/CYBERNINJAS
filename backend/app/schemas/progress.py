from pydantic import BaseModel
from typing import Optional


# =====================================================
# CREATE PROGRESS
# =====================================================

class ProgressCreate(BaseModel):

    user_id: int

    level_id: int

    unit_id: int

    lesson_id: int


# =====================================================
# UPDATE PROGRESS
# =====================================================

class ProgressUpdate(BaseModel):

    progress_percent: Optional[float] = None

    is_completed: Optional[bool] = None


# =====================================================
# RESPONSE
# =====================================================

class ProgressResponse(BaseModel):

    id: int

    user_id: int

    level_id: int

    unit_id: Optional[int] = None

    lesson_id: Optional[int] = None

    progress_percent: float

    is_started: bool

    is_completed: bool

    class Config:

        from_attributes = True