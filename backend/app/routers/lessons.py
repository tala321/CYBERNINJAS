from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db

from app.models.lesson import Lesson
from app.models.challenge import Challenge
from app.models.challenge_attempt import ChallengeAttempt
from app.models.user_progress import UserProgress

from app.schemas.lesson import (
    LessonResponse,
    ChallengeItem
)


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/lessons",
    tags=["Lessons"]
)


# ============================================================
# GET LESSON
# ============================================================

@router.get(
    "/{lesson_id}/{user_id}",
    response_model=LessonResponse
)
def get_lesson(
    lesson_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):

    # --------------------------------------------------------
    # GET LESSON + UNIT
    # --------------------------------------------------------

    lesson = (
        db.query(Lesson)
        .options(
            joinedload(Lesson.unit)
        )
        .filter(
            Lesson.id == lesson_id
        )
        .first()
    )

    if lesson is None:

        raise HTTPException(
            status_code=404,
            detail="Lesson not found"
        )


    # --------------------------------------------------------
    # MAKE SURE UNIT EXISTS
    # --------------------------------------------------------

    if lesson.unit is None:

        raise HTTPException(
            status_code=500,
            detail="Lesson is not connected to a unit"
        )


    # --------------------------------------------------------
    # GET CHALLENGES
    # --------------------------------------------------------

    challenges = (
        db.query(Challenge)
        .filter(
            Challenge.lesson_id == lesson_id
        )
        .order_by(
            Challenge.challenge_number.asc()
        )
        .all()
    )


    # --------------------------------------------------------
    # GET USER PROGRESS
    # --------------------------------------------------------

    progress = (
        db.query(UserProgress)
        .filter(
            UserProgress.user_id == user_id,
            UserProgress.lesson_id == lesson_id
        )
        .first()
    )


    # --------------------------------------------------------
    # DEFAULT PROGRESS
    # --------------------------------------------------------

    is_started = False

    is_completed = False

    progress_percent = 0.0


    # --------------------------------------------------------
    # USER PROGRESS EXISTS
    # --------------------------------------------------------

    if progress is not None:

        is_started = bool(
            progress.is_started
        )

        is_completed = bool(
            progress.is_completed
        )

        if progress.progress_percent is not None:

            progress_percent = float(
                progress.progress_percent
            )


    # --------------------------------------------------------
    # BUILD CHALLENGE RESPONSE
    # --------------------------------------------------------

    challenge_items = []


    for challenge in challenges:


    # هل المستخدم أنهى هذا التحدي؟
     completed_attempt = (
        db.query(ChallengeAttempt)
        .filter(
            ChallengeAttempt.user_id == user_id,
            ChallengeAttempt.challenge_id == challenge.id,
            ChallengeAttempt.is_correct.is_(True)
        )
        .first()
    )


    # هل بدأ التحدي؟
    started_attempt = (
        db.query(ChallengeAttempt)
        .filter(
            ChallengeAttempt.user_id == user_id,
            ChallengeAttempt.challenge_id == challenge.id
        )
        .first()
    )


    challenge_items.append(

        ChallengeItem(

            id=challenge.id,

            challenge_number=challenge.challenge_number,

            challenge_type=challenge.challenge_type,

            title_ar=challenge.title_ar,

            title_en=challenge.title_en,

            question_ar=challenge.question_ar,

            question_en=challenge.question_en,

            xp_reward=challenge.xp_reward,

            is_started=(
                True
                if started_attempt
                else False
            ),

            is_completed=(
                True
                if completed_attempt
                else False
            )

        )

    )
    # --------------------------------------------------------
    # RETURN LESSON
    # --------------------------------------------------------

    return LessonResponse(

        id=lesson.id,

        lesson_number=lesson.lesson_number,

        title_ar=lesson.title_ar,

        title_en=lesson.title_en,

        unit_id=lesson.unit_id,

        level_id=lesson.unit.level_id,

        challenges_count=len(challenge_items),

        is_started=is_started,

        is_completed=is_completed,

        progress_percent=progress_percent,

        challenges=challenge_items

    )