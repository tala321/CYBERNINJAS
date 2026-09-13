from datetime import datetime

from sqlalchemy.orm import Session

from app.models.challenge import Challenge
from app.models.challenge_attempt import ChallengeAttempt
from app.models.user_progress import UserProgress
from app.models.lesson import Lesson
from app.models.unit import Unit


# =====================================================
# CALCULATE PERCENTAGE
# =====================================================

def calculate_percentage(completed: int, total: int) -> float:

    if total <= 0:
        return 0.0

    percentage = (completed / total) * 100

    return round(
        min(percentage, 100.0),
        2
    )


# =====================================================
# LESSON PROGRESS
# =====================================================

def update_lesson_progress(
    db: Session,
    user_id: int,
    lesson_id: int
):

    lesson = (
        db.query(Lesson)
        .filter(
            Lesson.id == lesson_id
        )
        .first()
    )

    if lesson is None:
        return None

    total_challenges = (
        db.query(Challenge)
        .filter(
            Challenge.lesson_id == lesson_id
        )
        .count()
    )

    completed_challenges = (
        db.query(ChallengeAttempt.challenge_id)
        .join(
            Challenge,
            Challenge.id == ChallengeAttempt.challenge_id
        )
        .filter(
            ChallengeAttempt.user_id == user_id,
            Challenge.lesson_id == lesson_id,
            ChallengeAttempt.is_correct.is_(True)
        )
        .distinct()
        .count()
    )

    percentage = calculate_percentage(
        completed_challenges,
        total_challenges
    )

    progress = (
        db.query(UserProgress)
        .filter(
            UserProgress.user_id == user_id,
            UserProgress.lesson_id == lesson_id
        )
        .first()
    )

    if progress is None:

        progress = UserProgress(
            user_id=user_id,
            level_id=lesson.unit.level_id,
            unit_id=lesson.unit_id,
            lesson_id=lesson.id,
            progress_percent=0,
            is_started=True,
            is_completed=False,
            started_at=datetime.utcnow()
        )

        db.add(progress)

    progress.progress_percent = percentage
    progress.is_started = True

    if percentage >= 100:

        progress.progress_percent = 100
        progress.is_completed = True

        if not progress.completed_at:
            progress.completed_at = datetime.utcnow()

    db.flush()

    return progress


# =====================================================
# UNIT PROGRESS
# =====================================================

def update_unit_progress(
    db: Session,
    user_id: int,
    unit_id: int
):

    unit = (
        db.query(Unit)
        .filter(
            Unit.id == unit_id
        )
        .first()
    )

    if unit is None:
        return None

    total_lessons = (
        db.query(Lesson)
        .filter(
            Lesson.unit_id == unit_id
        )
        .count()
    )

    completed_lessons = (
        db.query(UserProgress)
        .filter(
            UserProgress.user_id == user_id,
            UserProgress.unit_id == unit_id,
            UserProgress.lesson_id.isnot(None),
            UserProgress.is_completed.is_(True)
        )
        .count()
    )

    percentage = calculate_percentage(
        completed_lessons,
        total_lessons
    )

    progress = (
        db.query(UserProgress)
        .filter(
            UserProgress.user_id == user_id,
            UserProgress.unit_id == unit_id,
            UserProgress.lesson_id.is_(None)
        )
        .first()
    )

    if progress is None:

        progress = UserProgress(
            user_id=user_id,
            level_id=unit.level_id,
            unit_id=unit_id,
            lesson_id=None,
            progress_percent=0,
            is_started=True,
            is_completed=False,
            started_at=datetime.utcnow()
        )

        db.add(progress)

    progress.progress_percent = percentage
    progress.is_started = True

    if percentage >= 100:

        progress.progress_percent = 100
        progress.is_completed = True

        if not progress.completed_at:
            progress.completed_at = datetime.utcnow()

    db.flush()

    return progress


# =====================================================
# LEVEL PROGRESS
# =====================================================

def update_level_progress(
    db: Session,
    user_id: int,
    level_id: int
):

    total_units = (
        db.query(Unit)
        .filter(
            Unit.level_id == level_id
        )
        .count()
    )

    completed_units = (
        db.query(UserProgress)
        .filter(
            UserProgress.user_id == user_id,
            UserProgress.level_id == level_id,
            UserProgress.unit_id.isnot(None),
            UserProgress.lesson_id.is_(None),
            UserProgress.is_completed.is_(True)
        )
        .count()
    )

    percentage = calculate_percentage(
        completed_units,
        total_units
    )

    progress = (
        db.query(UserProgress)
        .filter(
            UserProgress.user_id == user_id,
            UserProgress.level_id == level_id,
            UserProgress.unit_id.is_(None),
            UserProgress.lesson_id.is_(None)
        )
        .first()
    )

    if progress is None:

        progress = UserProgress(
            user_id=user_id,
            level_id=level_id,
            unit_id=None,
            lesson_id=None,
            progress_percent=0,
            is_started=True,
            is_completed=False,
            started_at=datetime.utcnow()
        )

        db.add(progress)

    progress.progress_percent = percentage
    progress.is_started = True

    if percentage >= 100:

        progress.progress_percent = 100
        progress.is_completed = True

        if not progress.completed_at:
            progress.completed_at = datetime.utcnow()

    db.flush()

    return progress


# =====================================================
# FULL PROGRESS UPDATE
# =====================================================

def update_full_progress(
    db: Session,
    user_id: int,
    lesson_id: int
):

    lesson_progress = update_lesson_progress(
        db=db,
        user_id=user_id,
        lesson_id=lesson_id
    )

    if lesson_progress is None:
        return None

    unit_progress = update_unit_progress(
        db=db,
        user_id=user_id,
        unit_id=lesson_progress.unit_id
    )

    level_progress = update_level_progress(
        db=db,
        user_id=user_id,
        level_id=lesson_progress.level_id
    )

    return {
        "lesson_progress": float(
            lesson_progress.progress_percent
        ),

        "lesson_completed": bool(
            lesson_progress.is_completed
        ),

        "unit_progress": float(
            unit_progress.progress_percent
        ) if unit_progress else 0.0,

        "unit_completed": bool(
            unit_progress.is_completed
        ) if unit_progress else False,

        "level_progress": float(
            level_progress.progress_percent
        ) if level_progress else 0.0,

        "level_completed": bool(
            level_progress.is_completed
        ) if level_progress else False
    }