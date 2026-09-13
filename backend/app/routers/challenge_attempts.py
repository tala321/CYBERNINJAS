from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.challenge_attempt import ChallengeAttempt
from app.models.challenge import Challenge
from app.models.challenge_option import ChallengeOption
from app.models.user import User
from app.models.xp_transaction import XPTransaction

from app.services.progress_service import update_full_progress

from app.schemas.challenge_attempt import (
    ChallengeAttemptCreate,
    ChallengeAttemptResponse
)

from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/challenge-attempts",
    tags=["Challenge Attempts"]
)


# =====================================================
# CREATE CHALLENGE ATTEMPT
# =====================================================

@router.post(
    "/",
    response_model=ChallengeAttemptResponse
)
def create_attempt(
    attempt: ChallengeAttemptCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        # =============================================
        # USER
        # =============================================

        user = current_user

        # =============================================
        # CHALLENGE
        # =============================================

        challenge = (
            db.query(Challenge)
            .filter(
                Challenge.id == attempt.challenge_id
            )
            .first()
        )

        if not challenge:

            raise HTTPException(
                status_code=404,
                detail="Challenge not found"
            )

        # =============================================
        # CHECK SELECTED OPTION
        # =============================================

        option = None

        if attempt.selected_option_id is not None:

            option = (
                db.query(ChallengeOption)
                .filter(
                    ChallengeOption.id
                    ==
                    attempt.selected_option_id
                )
                .first()
            )

            if not option:

                raise HTTPException(
                    status_code=404,
                    detail="Option not found"
                )

            if option.challenge_id != challenge.id:

                raise HTTPException(
                    status_code=400,
                    detail="Selected option does not belong to this challenge"
                )

        # =============================================
        # CHECK ANSWER
        # =============================================

        is_correct = False

        if option is not None:

            is_correct = bool(
                option.is_correct
            )

        elif attempt.answer_data is not None:

            content = (
                challenge.content_json
                or {}
            )

            if isinstance(
                content,
                dict
            ):

                correct_answer = (
                    content.get(
                        "correct_answer"
                    )
                )

                if correct_answer is not None:

                    submitted = (
                        attempt.answer_data
                    )

                    if (
                        isinstance(
                            submitted,
                            list
                        )
                        and
                        isinstance(
                            correct_answer,
                            list
                        )
                    ):

                        is_correct = (
                            submitted
                            ==
                            correct_answer
                        )

                    else:

                        is_correct = (
                            submitted
                            ==
                            correct_answer
                        )

        # =============================================
        # ATTEMPT NUMBER
        # =============================================

        previous_attempts = (
            db.query(
                ChallengeAttempt
            )
            .filter(
                ChallengeAttempt.user_id
                ==
                user.id,

                ChallengeAttempt.challenge_id
                ==
                challenge.id
            )
            .count()
        )

        attempt_number = (
            previous_attempts + 1
        )

        # =============================================
        # CHECK IF XP WAS ALREADY REWARDED
        # =============================================

        already_rewarded = (
            db.query(
                ChallengeAttempt
            )
            .filter(
                ChallengeAttempt.user_id
                ==
                user.id,

                ChallengeAttempt.challenge_id
                ==
                challenge.id,

                ChallengeAttempt.is_correct
                .is_(True),

                ChallengeAttempt.xp_earned
                >
                0
            )
            .first()
        )

        # =============================================
        # XP
        # =============================================

        xp_earned = 0

        if (
            is_correct
            and
            not already_rewarded
        ):

            xp_earned = (
                challenge.xp_reward
            )

            user.xp += xp_earned

        # =============================================
        # SAVE ATTEMPT
        # =============================================

        new_attempt = ChallengeAttempt(

            user_id=user.id,

            challenge_id=challenge.id,

            selected_option_id=
            attempt.selected_option_id,

            is_correct=is_correct,

            xp_earned=xp_earned,

            attempt_number=attempt_number

        )

        if hasattr(
            new_attempt,
            "answer_data"
        ):

            new_attempt.answer_data = (
                attempt.answer_data
            )

        db.add(
            new_attempt
        )

        # =============================================
        # XP TRANSACTION
        # =============================================

        if xp_earned > 0:

            xp_transaction = XPTransaction(

                user_id=user.id,

                amount=xp_earned,

                source_type="challenge",

                source_id=challenge.id,

                description_ar=
                "مكافأة إكمال التحدي",

                description_en=
                "Challenge completion reward"

            )

            db.add(
                xp_transaction
            )

        # =============================================
        # UPDATE PROGRESS
        # =============================================

        if is_correct:

            update_full_progress(
                db=db,
                user_id=user.id,
                lesson_id=challenge.lesson_id
            )

        # =============================================
        # COMMIT
        # =============================================

        db.commit()

        db.refresh(
            new_attempt
        )

        return new_attempt

    except HTTPException:

        db.rollback()

        raise

    except Exception as e:

        db.rollback()

        print(
            "CHALLENGE ATTEMPT ERROR:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to save challenge attempt"
        )

