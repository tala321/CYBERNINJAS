from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class UserProgressBase(BaseModel):

    user_id: int
    level_id: int
    unit_id: Optional[int] = None
    lesson_id: Optional[int] = None
    progress_percent: float = 0
    is_started: bool = False
    is_completed: bool = False


class UserProgressCreate(UserProgressBase):
    pass


class UserProgressResponse(UserProgressBase):

    id: int
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


    class Config:
        from_attributes = True