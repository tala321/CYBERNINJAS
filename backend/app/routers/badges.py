from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session, joinedload

from app.database import get_db

from app.models.user_badge import UserBadge

from app.schemas.badge import UserBadgeResponse


router = APIRouter(
    prefix="/badges",
    tags=["Badges"]
)



@router.get(
    "/user/{user_id}",
    response_model=list[UserBadgeResponse]
)
def get_user_badges(
    user_id:int,
    db:Session = Depends(get_db)
):

    badges = (

        db.query(UserBadge)

        .options(
            joinedload(
                UserBadge.badge
            )
        )

        .filter(
            UserBadge.user_id == user_id
        )

        .all()

    )


    return badges