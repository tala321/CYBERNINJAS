from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.level import Level
from app.models.unit import Unit
from app.models.lesson import Lesson
from app.models.challenge import Challenge

from app.schemas.level import (
    LevelResponse,
    LevelDetailResponse
)


router = APIRouter(
    prefix="/levels",
    tags=["Levels"]
)


# =====================================================
# GET ALL ACTIVE LEVELS
# =====================================================

@router.get(
    "/",
    response_model=list[LevelResponse]
)
def get_levels(
    db: Session = Depends(get_db)
):
    try:
        levels = db.query(Level).all()
        return levels
    except Exception as e:
        print("DATABASE ERROR:", e)
        raise e


# =====================================================
# GET LEVEL DETAILS
# =====================================================

@router.get(
    "/{level_id}",
    response_model=LevelDetailResponse
)
def get_level_details(
    level_id: int,
    db: Session = Depends(get_db)
):

    # -------------------------------------------------
    # GET LEVEL
    # -------------------------------------------------

    level = (
        db.query(Level)
        .filter(
            Level.id == level_id,
            Level.is_active == 1
        )
        .first()
    )

    if not level:
        raise HTTPException(
            status_code=404,
            detail="Level not found"
        )

    # -------------------------------------------------
    # UNITS
    # -------------------------------------------------

    units = (
        db.query(Unit)
        .filter(
            Unit.level_id == level.id
        )
        .order_by(
            Unit.id.asc()
        )
        .all()
    )

    units_response = []

    # -------------------------------------------------
    # LOOP UNITS
    # -------------------------------------------------

    for unit in units:

        lessons = (
            db.query(Lesson)
            .filter(
                Lesson.unit_id == unit.id
            )
            .order_by(
                Lesson.id.asc()
            )
            .all()
        )

        lessons_response = []

        # -------------------------------------------------
        # LOOP LESSONS
        # -------------------------------------------------

        for lesson in lessons:

            challenges_count = (
                db.query(Challenge)
                .filter(
                    Challenge.lesson_id == lesson.id
                )
                .count()
            )

            lessons_response.append(
                {
                    "id": lesson.id,
                    "title_ar": lesson.title_ar,
                    "title_en": lesson.title_en,
                    "challenges_count": challenges_count
                }
            )

        units_response.append(
            {
                "id": unit.id,
                "title_ar": unit.title_ar,
                "title_en": unit.title_en,
                "lessons": lessons_response
            }
        )

    # -------------------------------------------------
    # RESPONSE
    # -------------------------------------------------

    return {
        "id": level.id,
        "level_number": level.level_number,
        "title_ar": level.title_ar,
        "title_en": level.title_en,
        "description_ar": level.description_ar,
        "description_en": level.description_en,
        "units": units_response
    }