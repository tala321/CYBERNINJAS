from pydantic import BaseModel



class DashboardResponse(BaseModel):

    user_id: int

    username: str

    display_name: str | None

    avatar_id: int | None

    xp: int

    current_level: int

    streak_days: int


    progress_percent: float


    completed_lessons: int

    completed_units: int

    completed_levels: int


    badges_count: int

    inventory_count: int


    equipped_items_count: int