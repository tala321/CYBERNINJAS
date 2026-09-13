from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db

from app.models.unit import Unit
from app.models.lesson import Lesson
from app.models.user_progress import UserProgress
from app.models.challenge_attempt import ChallengeAttempt
from app.models.user import User

from app.schemas.unit import (
    UnitResponse,
    UnitLessonResponse,
    UnitChallengeResponse,
    LessonProgressResponse
)

from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/units",
    tags=["Units"]
)


# ============================================================
# GET ONE UNIT
# ============================================================

@router.get(
    "/{unit_id}/{user_id}",
    response_model=UnitResponse
)
def get_unit(
    unit_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # ========================================================
    # SECURITY
    # ========================================================

    if user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    # ========================================================
    # GET UNIT
    # ========================================================

    unit = (
        db.query(Unit)
        .options(
            joinedload(Unit.lessons)
            .joinedload(Lesson.challenges)
        )
        .filter(
            Unit.id == unit_id
        )
        .first()
    )

    if unit is None:
        raise HTTPException(
            status_code=404,
            detail="Unit not found"
        )

    lessons_response = []

    lessons = sorted(
        unit.lessons,
        key=lambda x: x.lesson_number
    )

    # ========================================================
    # LESSONS
    # ========================================================

    for lesson in lessons:

        # ====================================================
        # LESSON PROGRESS
        # ====================================================

        progress = (
            db.query(UserProgress)
            .filter(
                UserProgress.user_id == current_user.id,
                UserProgress.lesson_id == lesson.id
            )
            .first()
        )

        lesson_completed = False
        lesson_percent = 0

        if progress:
            lesson_completed = bool(
                progress.is_completed
            )

            lesson_percent = float(
                progress.progress_percent or 0
            )

        # ====================================================
        # CHALLENGES
        # ====================================================

        challenges = sorted(
            lesson.challenges,
            key=lambda x: x.challenge_number
        )

        challenges_response = []

        previous_completed = True

        for challenge in challenges:

            # ==================================================
            # CHECK CHALLENGE COMPLETION
            # ==================================================

            completed = (
                db.query(ChallengeAttempt)
                .filter(
                    ChallengeAttempt.user_id == current_user.id,
                    ChallengeAttempt.challenge_id == challenge.id,
                    ChallengeAttempt.is_correct.is_(True)
                )
                .first()
                is not None
            )

            # ==================================================
            # CHALLENGE LOCK
            # ==================================================

            locked = False

            if challenge.challenge_number > 1:
                locked = not previous_completed

            # ==================================================
            # CHALLENGE RESPONSE
            # ==================================================

            challenges_response.append(
                UnitChallengeResponse(
                    id=challenge.id,

                    challenge_number=challenge.challenge_number,

                    challenge_type=challenge.challenge_type,

                    title_ar=challenge.title_ar,

                    title_en=challenge.title_en,

                    question_ar=challenge.question_ar,

                    question_en=challenge.question_en,

                    xp_reward=challenge.xp_reward,

                    is_locked=locked,

                    is_completed=completed
                )
            )

            # The current challenge must be completed
            # before the next challenge becomes available.
            previous_completed = completed

        # ====================================================
        # LESSON RESPONSE
        # ====================================================

        lessons_response.append(
            UnitLessonResponse(
                id=lesson.id,

                unit_id=lesson.unit_id,

                lesson_number=lesson.lesson_number,

                title_ar=lesson.title_ar,

                title_en=lesson.title_en,

                description_ar=lesson.description_ar,

                description_en=lesson.description_en,

                xp_reward=lesson.xp_reward,

                challenges_count=len(challenges_response),

                progress=LessonProgressResponse(
                    is_completed=lesson_completed,

                    progress_percent=lesson_percent
                ),

                challenges=challenges_response
            )
        )

    # ============================================================
    # RETURN UNIT
    # ============================================================

    return UnitResponse(
        id=unit.id,

        level_id=unit.level_id,

        unit_number=unit.unit_number,

        title_ar=unit.title_ar,

        title_en=unit.title_en,

        description_ar=unit.description_ar,

        description_en=unit.description_en,

        lessons=lessons_response
    )