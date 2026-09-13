from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from app.database import get_db

from app.models.user import User
from app.models.user_mission import UserMission
from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/missions",
    tags=["Missions"]
)



@router.get("/")
def get_my_missions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    missions = (
        db.query(UserMission)
        .options(
            joinedload(UserMission.mission)
        )
        .filter(
            UserMission.user_id == current_user.id
        )
        .all()
    )

    return missions