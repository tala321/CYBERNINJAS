from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_

from app.database import get_db

from app.models.user import User
from app.models.challenge import Challenge
from app.models.challenge_option import ChallengeOption
from app.models.challenge_attempt import ChallengeAttempt
from app.models.xp_transaction import XPTransaction

from app.services.progress_service import update_full_progress

from app.schemas.challenge import ChallengeResponse
from app.schemas.challenge_attempt import (
    ChallengeSubmitRequest,
    ChallengeSubmitResponse
)


router = APIRouter(
    prefix="/challenges",
    tags=["Challenges"]
)


# =====================================================
# GET ALL CHALLENGES
# =====================================================

@router.get(
    "/",
    response_model=list[ChallengeResponse]
)
def get_challenges(
    db: Session = Depends(get_db)
):

    return (
        db.query(Challenge)
        .options(
            joinedload(
                Challenge.options
            )
        )
        .order_by(
            Challenge.lesson_id,
            Challenge.challenge_number
        )
        .all()
    )


# =====================================================
# GET LESSON CHALLENGES
# =====================================================

@router.get(
    "/lesson/{lesson_id}",
    response_model=list[ChallengeResponse]
)
def get_lesson_challenges(
    lesson_id: int,
    db: Session = Depends(get_db)
):

    challenges = (
        db.query(Challenge)
        .options(
            joinedload(
                Challenge.options
            )
        )
        .filter(
            Challenge.lesson_id == lesson_id
        )
        .order_by(
            Challenge.challenge_number
        )
        .all()
    )


    if not challenges:

        raise HTTPException(
            status_code=404,
            detail="No challenges found"
        )


    return challenges



# =====================================================
# GET SINGLE CHALLENGE
# =====================================================

@router.get(
    "/id/{challenge_id}",
    response_model=ChallengeResponse
)
def get_challenge(
    challenge_id: int,
    db: Session = Depends(get_db)
):

    challenge = (
        db.query(Challenge)
        .options(
            joinedload(
                Challenge.options
            )
        )
        .filter(
            Challenge.id == challenge_id
        )
        .first()
    )


    if challenge is None:

        raise HTTPException(
            status_code=404,
            detail="Challenge not found"
        )


    return challenge



# =====================================================
# HELPERS
# =====================================================

def normalize(value):

    if value is None:

        return ""

    return (
        str(value)
        .strip()
        .lower()
        .replace("_", " ")
        .replace("-", " ")
    )



def get_item_id(item):

    if not isinstance(
        item,
        dict
    ):

        return None


    return (
        item.get("id")
        or item.get("item_id")
        or item.get("value")
        or item.get("key")
    )



def get_item_text(item):

    if not isinstance(
        item,
        dict
    ):

        return str(item)


    return (
        item.get("text_en")
        or item.get("text_ar")
        or item.get("text")
        or item.get("label_en")
        or item.get("label_ar")
        or item.get("label")
        or item.get("name_en")
        or item.get("name_ar")
        or item.get("name")
        or ""
    )



def get_item_correct_category(item):

    if not isinstance(
        item,
        dict
    ):

        return None


    return (
        item.get("correct_category")
        or item.get("correct_category_id")
        or item.get("category")
        or item.get("category_id")
        or item.get("correct")
    )



def get_category_id(category):

    if not isinstance(
        category,
        dict
    ):

        return None


    return (
        category.get("id")
        or category.get("category_id")
        or category.get("value")
        or category.get("key")
    )
# =====================================================
# RESOLVE CATEGORY
# =====================================================

def resolve_category(
    value,
    categories
):

    if value is None:

        return ""


    raw = normalize(value)


    for category in categories:

        category_id = get_category_id(
            category
        )


        category_texts = [

            category.get("text_en"),

            category.get("text_ar"),

            category.get("label_en"),

            category.get("label_ar"),

            category.get("name_en"),

            category.get("name_ar")

        ] if isinstance(category, dict) else []


        if (
            category_id is not None
            and normalize(category_id) == raw
        ):

            return normalize(
                category_id
            )


        for text in category_texts:

            if (
                text
                and normalize(text) == raw
            ):

                return normalize(
                    category_id
                    if category_id is not None
                    else text
                )


    return raw




# =====================================================
# RESOLVE ITEM
# =====================================================

def resolve_item(
    value,
    items
):

    if isinstance(
        value,
        dict
    ):

        value_id = (
            value.get("id")
            or value.get("item_id")
            or value.get("value")
            or value.get("key")
        )


        value_text = get_item_text(
            value
        )


        if value_id is not None:

            for item in items:

                item_id = get_item_id(
                    item
                )

                if (
                    item_id is not None
                    and str(item_id)
                    ==
                    str(value_id)
                ):

                    return item



        if value_text:

            for item in items:

                if (
                    normalize(
                        get_item_text(item)
                    )
                    ==
                    normalize(value_text)
                ):

                    return item


        return None



    raw = str(value)


    for item in items:

        item_id = get_item_id(
            item
        )

        if (
            item_id is not None
            and str(item_id)
            ==
            raw
        ):

            return item



    for item in items:

        if (
            normalize(
                get_item_text(item)
            )
            ==
            normalize(raw)
        ):

            return item


    return None




def check_pick_answer(
    challenge,
    submitted_answer
):

    if not isinstance(submitted_answer, list):

        submitted_answer = [
            submitted_answer
        ]


    submitted_ids = set()


    for item in submitted_answer:

        if isinstance(item, dict):

            value = (
                item.get("id")
                or item.get("option_id")
                or item.get("value")
                or item.get("key")
            )

            if value is not None:
                submitted_ids.add(str(value))


        else:

            submitted_ids.add(
                str(item)
            )


    correct_ids = {

        str(option.id)

        for option in challenge.options

        if option.is_correct is True

    }


    if correct_ids:

        return (
            submitted_ids
            ==
            correct_ids
        )


    content = challenge.content_json or {}


    options = (
        content.get("options", [])
        if isinstance(content, dict)
        else []
    )


    json_correct = set()


    for option in options:

        if (
            isinstance(option, dict)
            and option.get("is_correct") is True
        ):

            option_id = (
                option.get("id")
                or option.get("value")
                or option.get("option_id")
            )


            if option_id is not None:

                json_correct.add(
                    str(option_id)
                )


    return (
        submitted_ids
        ==
        json_correct
    )
# =====================================================
# CHECK DRAG DROP
# =====================================================

def check_drag_drop_answer(
    challenge,
    submitted
):

    if not isinstance(
        submitted,
        dict
    ):

        return False



    content = (
        challenge.content_json
        or {}
    )


    if not isinstance(
        content,
        dict
    ):

        return False



    items = content.get(
        "items",
        []
    )


    categories = content.get(
        "categories",
        []
    )



    expected = {}



    for item in items:

        item_id = get_item_id(
            item
        )


        correct_category = (
            get_item_correct_category(item)
        )


        if correct_category is None:

            continue



        key = (
            str(item_id)
            if item_id is not None
            else normalize(
                get_item_text(item)
            )
        )


        expected[key] = resolve_category(
            correct_category,
            categories
        )



    if not expected:

        return False



    received = {}



    for category, values in submitted.items():

        category_key = resolve_category(
            category,
            categories
        )


        if not isinstance(
            values,
            list
        ):

            values = [
                values
            ]



        for value in values:

            item = resolve_item(
                value,
                items
            )


            if item is None:

                return False



            item_id = get_item_id(
                item
            )


            key = (
                str(item_id)
                if item_id is not None
                else normalize(
                    get_item_text(item)
                )
            )


            received[key] = category_key



    if (
        set(expected.keys())
        !=
        set(received.keys())
    ):

        return False



    for key, category in expected.items():

        if (
            normalize(
                received[key]
            )
            !=
            normalize(category)
        ):

            return False



    return True

# =====================================================
# SUBMIT CHALLENGE
# =====================================================

@router.post(
    "/{challenge_id}/submit",
    response_model=ChallengeSubmitResponse
)
def submit_challenge(
    challenge_id: int,
    data: ChallengeSubmitRequest,
    db: Session = Depends(get_db)
):

    try:

        # =============================================
        # USER
        # =============================================

        user = (
            db.query(User)
            .filter(
                User.id == data.user_id
            )
            .first()
        )

        if not user:

            raise HTTPException(
                status_code=404,
                detail="User not found"
            )


        # =============================================
        # CHALLENGE
        # =============================================

        challenge = (
            db.query(Challenge)
            .options(
                joinedload(
                    Challenge.options
                )
            )
            .filter(
                Challenge.id == challenge_id
            )
            .first()
        )


        if not challenge:

            raise HTTPException(
                status_code=404,
                detail="Challenge not found"
            )


        # =============================================
        # CHECK ANSWER
        # =============================================

        challenge_type = normalize(
            challenge.challenge_type
        )

        correct = False


        if challenge_type in [
            "drag drop",
            "drag_drop",
            "dragdrop",
            "sorting"
        ]:

            correct = check_drag_drop_answer(
                challenge,
                data.answer_data
            )


        elif challenge_type in [

            "pick",
            "select",
            "multiple choice",
            "multiple_choice",
            "mcq"

        ]:

            if data.answer_data is not None:

                correct = check_pick_answer(
                    challenge,
                    data.answer_data
                )


            elif data.selected_option_id:

                option = (
                    db.query(
                        ChallengeOption
                    )
                    .filter(
                        ChallengeOption.id
                        ==
                        data.selected_option_id
                    )
                    .first()
                )


                if not option:

                    raise HTTPException(
                        404,
                        "Option not found"
                    )


                if option.challenge_id != challenge.id:

                    raise HTTPException(
                        400,
                        "Invalid option"
                    )


                correct = bool(
                    option.is_correct
                )


        elif data.selected_option_id:


            option = (
                db.query(
                    ChallengeOption
                )
                .filter(
                    ChallengeOption.id
                    ==
                    data.selected_option_id
                )
                .first()
            )


            if not option:

                raise HTTPException(
                    404,
                    "Option not found"
                )


            if option.challenge_id != challenge.id:

                raise HTTPException(
                    400,
                    "Invalid option"
                )


            correct = bool(
                option.is_correct
            )


        elif data.answer_data is not None:


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

                    correct = (
                        normalize(
                            data.answer_data
                        )
                        ==
                        normalize(
                            correct_answer
                        )
                    )


        # =============================================
        # PREVIOUS SUCCESS CHECK
        # =============================================

        already_completed = (
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
                .is_(True)
            )
            .first()
        )


        earned_xp = 0


        if correct and not already_completed:

            earned_xp = (
                challenge.xp_reward
            )

            user.xp += earned_xp



        # =============================================
        # SAVE ATTEMPT
        # =============================================

        attempts_count = (
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


        attempt = ChallengeAttempt(

            user_id=user.id,

            challenge_id=challenge.id,

            selected_option_id=
            data.selected_option_id,

            is_correct=correct,

            xp_earned=earned_xp,

            attempt_number=
            attempts_count + 1

        )


        if hasattr(
            attempt,
            "answer_data"
        ):

            attempt.answer_data = (
                data.answer_data
            )


        db.add(
            attempt
        )


        # =============================================
        # XP TRANSACTION
        # =============================================

        if earned_xp > 0:


            transaction = XPTransaction(

                user_id=user.id,

                amount=earned_xp,

                source_type="challenge",

                source_id=challenge.id,

                description_ar=
                "إكمال التحدي",

                description_en=
                "Challenge completed"

            )


            db.add(
                transaction
            )



        # =============================================
        # UPDATE PROGRESS
        # =============================================

        progress_data = None


        if correct:

            progress_data = (
                update_full_progress(
                    db=db,
                    user_id=user.id,
                    lesson_id=challenge.lesson_id
                )
            )


        db.commit()



        # =============================================
        # NEXT CHALLENGE
        # =============================================

        next_challenge = (
            db.query(
                Challenge
            )
            .filter(
                Challenge.lesson_id
                ==
                challenge.lesson_id,

                Challenge.challenge_number
                >
                challenge.challenge_number
            )
            .order_by(
                Challenge.challenge_number
            )
            .first()
        )


        return ChallengeSubmitResponse(

            challenge_id=challenge.id,

            correct=correct,

            xp_earned=earned_xp,

            message=(
                "Challenge completed!"
                if correct
                else
                "Wrong answer"
            ),

            next_challenge_id=(
                next_challenge.id
                if next_challenge
                else None
            ),

            progress=progress_data

        )


    except HTTPException:

        db.rollback()

        raise


    except Exception as e:

        db.rollback()

        print(
            "SUBMIT ERROR:",
            e
        )

        raise HTTPException(

            status_code=500,

            detail="Internal server error"

        )