from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.schemas.boss import BossResponse
from app.database import get_db

from app.models.boss_challenge import BossChallenge
from app.models.boss_attempt import BossAttempt
from app.models.user import User
from app.models.level import Level
from app.models.unit import Unit
from app.models.lesson import Lesson
from app.models.challenge import Challenge
from app.models.challenge_option import ChallengeOption
from app.models.xp_transaction import XPTransaction

from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/boss",
    tags=["Boss"]
)


# ============================================================
# GET BOSS QUESTIONS
# ============================================================

def get_boss_questions(
    level_id: int,
    db: Session
):
    """
    Get exactly 5 boss questions from the level.

    Selection strategy:
    - One challenge from each of the first 4 units.
    - Then additional unique challenges until we have 5.
    """

    units = (
        db.query(Unit)
        .filter(Unit.level_id == level_id)
        .order_by(Unit.unit_number)
        .all()
    )

    if not units:
        raise HTTPException(
            status_code=404,
            detail="No units found for this level"
        )

    selected_challenges = []

    # --------------------------------------------------------
    # First: one challenge from each unit
    # --------------------------------------------------------

    for unit in units[:4]:

        lesson = (
            db.query(Lesson)
            .filter(Lesson.unit_id == unit.id)
            .order_by(Lesson.lesson_number)
            .first()
        )

        if not lesson:
            continue

        challenge = (
            db.query(Challenge)
            .options(joinedload(Challenge.options))
            .filter(
                Challenge.lesson_id == lesson.id
            )
            .order_by(
                Challenge.challenge_number
            )
            .first()
        )

        if challenge:
            selected_challenges.append(challenge)

    # --------------------------------------------------------
    # Second: add more challenges until we have 5
    # --------------------------------------------------------

    if len(selected_challenges) < 5:

        selected_ids = {
            challenge.id
            for challenge in selected_challenges
        }

        for unit in units:

            lessons = (
                db.query(Lesson)
                .filter(
                    Lesson.unit_id == unit.id
                )
                .order_by(
                    Lesson.lesson_number
                )
                .all()
            )

            for lesson in lessons:

                challenges = (
                    db.query(Challenge)
                    .options(
                        joinedload(
                            Challenge.options
                        )
                    )
                    .filter(
                        Challenge.lesson_id == lesson.id
                    )
                    .order_by(
                        Challenge.challenge_number
                    )
                    .all()
                )

                for challenge in challenges:

                    if challenge.id in selected_ids:
                        continue

                    selected_challenges.append(
                        challenge
                    )

                    selected_ids.add(
                        challenge.id
                    )

                    if len(selected_challenges) == 5:
                        break

                if len(selected_challenges) == 5:
                    break

            if len(selected_challenges) == 5:
                break

    # --------------------------------------------------------
    # Validate
    # --------------------------------------------------------

    if len(selected_challenges) < 5:

        raise HTTPException(
            status_code=400,
            detail="Not enough challenges for this boss"
        )

    return selected_challenges[:5]


# ============================================================
# SAFE CHALLENGE SERIALIZER
# ============================================================

def serialize_challenge(
    challenge: Challenge
):
    """
    Convert a Challenge into a safe Boss question.

    IMPORTANT:
    Correct answers must never be sent to the frontend.
    """

    options = []

    for option in challenge.options:

        options.append({
            "id": option.id,
            "option_text_ar": option.option_text_ar,
            "option_text_en": option.option_text_en,
            "sort_order": option.sort_order
        })

    return {
        "id": challenge.id,
        "challenge_number": challenge.challenge_number,
        "challenge_type": challenge.challenge_type,
        "title_ar": challenge.title_ar,
        "title_en": challenge.title_en,
        "question_ar": challenge.question_ar,
        "question_en": challenge.question_en,
        "xp_reward": challenge.xp_reward,
        "options": options
    }


# ============================================================
# GET BOSS
# ============================================================

@router.get(
    "/level/{level_id}",
    response_model=BossResponse
)
def get_boss(
    level_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

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

    boss = (
        db.query(BossChallenge)
        .filter(
            BossChallenge.level_id == level_id,
            BossChallenge.is_active == True
        )
        .first()
    )

    if not boss:

        raise HTTPException(
            status_code=404,
            detail="Boss challenge not found"
        )

    questions = get_boss_questions(
        level_id=level_id,
        db=db
    )

    return {
        "id": boss.id,
        "level_id": boss.level_id,
        "title_ar": boss.title_ar,
        "title_en": boss.title_en,
        "description_ar": boss.description_ar,
        "description_en": boss.description_en,
        "xp_reward": boss.xp_reward,
        "time_limit_seconds": boss.time_limit_seconds,
        "questions_count": len(questions),
        "questions": [
            serialize_challenge(question)
            for question in questions
        ]
    }


# ============================================================
# START BOSS
# ============================================================

@router.post(
    "/{boss_id}/start"
)
def start_boss(
    boss_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    boss = (
        db.query(BossChallenge)
        .filter(
            BossChallenge.id == boss_id,
            BossChallenge.is_active == True
        )
        .first()
    )

    if not boss:

        raise HTTPException(
            status_code=404,
            detail="Boss not found"
        )

    questions = get_boss_questions(
        level_id=boss.level_id,
        db=db
    )

    return {
        "message": "Boss challenge started",
        "boss_id": boss.id,
        "level_id": boss.level_id,
        "title": boss.title_en,
        "xp_reward": boss.xp_reward,
        "time_limit_seconds": boss.time_limit_seconds,
        "questions_count": len(questions),
        "questions": [
            serialize_challenge(question)
            for question in questions
        ]
    }


# ============================================================
# SUBMIT BOSS
# ============================================================

@router.post(
    "/{boss_id}/submit"
)
def submit_boss(
    boss_id: int,
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    boss = (
        db.query(BossChallenge)
        .filter(
            BossChallenge.id == boss_id,
            BossChallenge.is_active == True
        )
        .first()
    )

    if not boss:

        raise HTTPException(
            status_code=404,
            detail="Boss not found"
        )

    answers = data.get(
        "answers",
        []
    )

    if not isinstance(answers, list):

        raise HTTPException(
            status_code=400,
            detail="Answers must be a list"
        )

    questions = get_boss_questions(
        level_id=boss.level_id,
        db=db
    )

    question_map = {
        question.id: question
        for question in questions
    }

    score = 0

    # --------------------------------------------------------
    # Check answers
    # --------------------------------------------------------

    for answer in answers:

        if not isinstance(answer, dict):
            continue

        challenge_id = answer.get(
            "challenge_id"
        )

        selected_option_id = answer.get(
            "selected_option_id"
        )

        challenge = question_map.get(
            challenge_id
        )

        if not challenge:
            continue

        if selected_option_id is None:
            continue

        option = (
            db.query(ChallengeOption)
            .filter(
                ChallengeOption.id ==
                selected_option_id,

                ChallengeOption.challenge_id ==
                challenge.id
            )
            .first()
        )

        if option and option.is_correct:

            score += 1

    # --------------------------------------------------------
    # Calculate result
    # --------------------------------------------------------

    total_questions = len(
        questions
    )

    percentage = (
        round(
            (score / total_questions) * 100
        )
        if total_questions > 0
        else 0
    )

    # Boss passes at 60%
    passed = percentage >= 60

    # --------------------------------------------------------
    # Prevent repeated XP
    # --------------------------------------------------------

    previous_pass = (
        db.query(BossAttempt)
        .filter(
            BossAttempt.user_id ==
            current_user.id,

            BossAttempt.boss_id ==
            boss.id,

            BossAttempt.passed ==
            True
        )
        .order_by(
            BossAttempt.id.desc()
        )
        .first()
    )

    if passed and previous_pass:

        xp_earned = 0

    elif passed:

        xp_earned = boss.xp_reward

    else:

        xp_earned = 0

    # --------------------------------------------------------
    # Save Boss Attempt
    # --------------------------------------------------------

    attempt = BossAttempt(
        user_id=current_user.id,
        boss_id=boss.id,
        score=score,
        passed=passed,
        xp_earned=xp_earned
    )

    db.add(attempt)

    # --------------------------------------------------------
    # Award XP
    # --------------------------------------------------------

    if xp_earned > 0:

        current_user.xp += xp_earned

        transaction = XPTransaction(
            user_id=current_user.id,
            amount=xp_earned,
            source_type="boss",
            source_id=boss.id,
            description_ar="إكمال تحدي الزعيم",
            description_en="Boss challenge completed"
        )

        db.add(transaction)

    db.commit()

    db.refresh(attempt)
    db.refresh(current_user)

    # --------------------------------------------------------
    # Response
    # --------------------------------------------------------

    return {
        "boss_id": boss.id,
        "level_id": boss.level_id,

        "passed": passed,

        "score": score,

        "total_questions": total_questions,

        "percentage": percentage,

        "xp_earned": xp_earned,

        "title": (
            "Boss Defeated!"
            if passed
            else "Keep Training!"
        ),

        "message": (
            "Amazing work, Ninja!"
            if passed
            else "You need 60% to defeat the boss."
        )
    }


# ============================================================
# GET LAST BOSS RESULT
# ============================================================

@router.get(
    "/{boss_id}/result"
)
def get_boss_result(
    boss_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    boss = (
        db.query(BossChallenge)
        .filter(
            BossChallenge.id == boss_id
        )
        .first()
    )

    if not boss:

        raise HTTPException(
            status_code=404,
            detail="Boss not found"
        )

    attempt = (
        db.query(BossAttempt)
        .filter(
            BossAttempt.user_id ==
            current_user.id,

            BossAttempt.boss_id ==
            boss.id
        )
        .order_by(
            BossAttempt.id.desc()
        )
        .first()
    )

    if not attempt:

        raise HTTPException(
            status_code=404,
            detail="No boss result found"
        )

    return {
        "id": attempt.id,

        "boss_id": boss.id,

        "level_id": boss.level_id,

        "passed": attempt.passed,

        "score": attempt.score,

        "total_questions": 5,

        "percentage": (
            round(
                (
                    attempt.score / 5
                ) * 100
            )
            if 5 > 0
            else 0
        ),

        "xp_earned": attempt.xp_earned,

        "title": (
            "Boss Defeated!"
            if attempt.passed
            else "Keep Training!"
        ),

        "message": (
            "Amazing work, Ninja!"
            if attempt.passed
            else "You need 60% to defeat the boss."
        ),

        "created_at": attempt.created_at
    }