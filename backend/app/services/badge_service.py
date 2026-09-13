from sqlalchemy.orm import Session

from app.models.badge import Badge
from app.models.user_badge import UserBadge



def give_badge(
    db: Session,
    user_id: int,
    badge_id: int
):

    existing = (
        db.query(UserBadge)
        .filter(
            UserBadge.user_id == user_id,
            UserBadge.badge_id == badge_id
        )
        .first()
    )


    if existing:
        return existing



    badge = (
        db.query(Badge)
        .filter(
            Badge.id == badge_id
        )
        .first()
    )


    if not badge:
        return None



    user_badge = UserBadge(

        user_id=user_id,

        badge_id=badge_id

    )


    db.add(user_badge)

    db.flush()


    return user_badge