from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db

from app.models.user import User
from app.models.user_progress import UserProgress
from app.models.user_badge import UserBadge
from app.models.user_inventory import UserInventory
from app.models.user_equipped_item import UserEquippedItem

from app.models.lesson import Lesson
from app.models.unit import Unit

from app.schemas.dashboard import DashboardResponse

from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


# =====================================================
# GET USER DASHBOARD
# =====================================================

@router.get(
    "/{user_id}",
    response_model=DashboardResponse
)
def get_dashboard(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # =================================================
    # SECURITY
    # =================================================

    if user_id != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    # =================================================
    # USER
    # =================================================

    user = current_user

    # =================================================
    # USER PROGRESS
    # =================================================

    progress = (
        db.query(UserProgress)
        .filter(
            UserProgress.user_id == user.id
        )
        .all()
    )

    # =================================================
    # COMPLETED LESSONS
    # =================================================

    completed_lessons = sum(
        1
        for p in progress
        if p.lesson_id is not None
        and p.is_completed
    )

    # =================================================
    # COMPLETED UNITS
    # =================================================

    unit_lesson_counts = dict(
        db.query(
            Lesson.unit_id,
            func.count(Lesson.id)
        )
        .group_by(
            Lesson.unit_id
        )
        .all()
    )

    completed_lessons_per_unit = {}

    for p in progress:

        if (
            p.unit_id is not None
            and p.lesson_id is not None
            and p.is_completed
        ):

            completed_lessons_per_unit[p.unit_id] = (
                completed_lessons_per_unit.get(
                    p.unit_id,
                    0
                ) + 1
            )

    completed_units = sum(
        1
        for unit_id, lessons_count
        in unit_lesson_counts.items()
        if (
            lessons_count > 0
            and completed_lessons_per_unit.get(
                unit_id,
                0
            ) == lessons_count
        )
    )

    # =================================================
    # COMPLETED LEVELS
    # =================================================

    level_lesson_counts = dict(
        db.query(
            Unit.level_id,
            func.count(Lesson.id)
        )
        .join(
            Lesson,
            Lesson.unit_id == Unit.id
        )
        .group_by(
            Unit.level_id
        )
        .all()
    )

    completed_lessons_per_level = {}

    for p in progress:

        if (
            p.level_id is not None
            and p.lesson_id is not None
            and p.is_completed
        ):

            completed_lessons_per_level[p.level_id] = (
                completed_lessons_per_level.get(
                    p.level_id,
                    0
                ) + 1
            )

    completed_levels = sum(
        1
        for level_id, lessons_count
        in level_lesson_counts.items()
        if (
            lessons_count > 0
            and completed_lessons_per_level.get(
                level_id,
                0
            ) == lessons_count
        )
    )

    # =================================================
    # USER PROGRESS PERCENT
    # =================================================

    valid_progress = [
        p
        for p in progress
        if p.lesson_id is not None
    ]

    progress_percent = 0.0

    if valid_progress:

        progress_percent = (
            sum(
                float(
                    p.progress_percent
                )
                for p in valid_progress
            )
            /
            len(valid_progress)
        )

    # =================================================
    # BADGES
    # =================================================

    badges_count = (
        db.query(
            func.count(UserBadge.id)
        )
        .filter(
            UserBadge.user_id == user.id
        )
        .scalar()
    ) or 0

    # =================================================
    # INVENTORY
    # =================================================

    inventory_count = (
        db.query(
            func.count(UserInventory.id)
        )
        .filter(
            UserInventory.user_id == user.id
        )
        .scalar()
    ) or 0

    # =================================================
    # EQUIPPED ITEMS
    # =================================================

    equipped_items_count = (
        db.query(
            func.count(UserEquippedItem.id)
        )
        .filter(
            UserEquippedItem.user_id == user.id
        )
        .scalar()
    ) or 0

    # =================================================
    # RESPONSE
    # =================================================

    return DashboardResponse(

        user_id=user.id,

        username=user.username,

        display_name=user.display_name,

        avatar_id=user.avatar_id,

        xp=user.xp,

        current_level=user.current_level,

        streak_days=user.streak_days,

        progress_percent=round(
            progress_percent,
            2
        ),

        completed_lessons=completed_lessons,

        completed_units=completed_units,

        completed_levels=completed_levels,

        badges_count=badges_count,

        inventory_count=inventory_count,

        equipped_items_count=equipped_items_count

    )