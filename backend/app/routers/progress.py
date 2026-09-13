from datetime import datetime

from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.user import User
from app.models.user_progress import UserProgress

from app.schemas.progress import (
    ProgressResponse,
    ProgressCreate,
    ProgressUpdate
)

from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/progress",
    tags=["Progress"]
)


# =====================================================
# CREATE PROGRESS
# =====================================================

@router.post(
    "/",
    response_model=ProgressResponse
)
def create_progress(
    data: ProgressCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    existing = (
        db.query(UserProgress)
        .filter(
            UserProgress.user_id == current_user.id,
            UserProgress.lesson_id == data.lesson_id
        )
        .first()
    )

    if existing:
        return existing

    progress = UserProgress(

        user_id=current_user.id,

        level_id=data.level_id,

        unit_id=data.unit_id,

        lesson_id=data.lesson_id,

        progress_percent=0,

        is_started=True,

        started_at=datetime.utcnow()

    )

    db.add(progress)

    db.commit()

    db.refresh(progress)

    return progress


# =====================================================
# GET USER PROGRESS
# =====================================================

@router.get(
    "/user/{user_id}",
    response_model=list[ProgressResponse]
)
def get_user_progress(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if user_id != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    progress = (
        db.query(UserProgress)
        .filter(
            UserProgress.user_id == current_user.id
        )
        .all()
    )

    return progress


# =====================================================
# GET LESSON PROGRESS
# =====================================================

@router.get(
    "/lesson/{user_id}/{lesson_id}",
    response_model=ProgressResponse
)
def get_lesson_progress(
    user_id: int,
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if user_id != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    progress = (
        db.query(UserProgress)
        .filter(
            UserProgress.user_id == current_user.id,
            UserProgress.lesson_id == lesson_id
        )
        .first()
    )

    if not progress:

        raise HTTPException(
            status_code=404,
            detail="Progress not found"
        )

    return progress


# =====================================================
# UPDATE PROGRESS
# =====================================================

@router.put(
    "/{progress_id}",
    response_model=ProgressResponse
)
def update_progress(
    progress_id: int,
    data: ProgressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    progress = (
        db.query(UserProgress)
        .filter(
            UserProgress.id == progress_id
        )
        .first()
    )

    if not progress:

        raise HTTPException(
            status_code=404,
            detail="Progress not found"
        )

    if progress.user_id != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    if data.progress_percent is not None:

        progress.progress_percent = (
            data.progress_percent
        )

    if data.is_completed is not None:

        progress.is_completed = (
            data.is_completed
        )

        if data.is_completed:

            progress.completed_at = (
                datetime.utcnow()
            )

    db.commit()

    db.refresh(progress)

    return progress


# =====================================================
# COMPLETE LESSON
# =====================================================

@router.post(
    "/complete/{user_id}/{lesson_id}",
    response_model=ProgressResponse
)
def complete_lesson(
    user_id: int,
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if user_id != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    progress = (
        db.query(UserProgress)
        .filter(
            UserProgress.user_id == current_user.id,
            UserProgress.lesson_id == lesson_id
        )
        .first()
    )

    if not progress:

        raise HTTPException(
            status_code=404,
            detail="Progress not found"
        )

    progress.progress_percent = 100

    progress.is_completed = True

    progress.completed_at = datetime.utcnow()

    db.commit()

    db.refresh(progress)

    return progress