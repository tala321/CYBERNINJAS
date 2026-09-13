from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.reward import Reward

from app.schemas.reward import RewardResponse


router = APIRouter(
    prefix="/rewards",
    tags=["Rewards"]
)


# =====================================================
# GET ALL ACTIVE REWARDS
# =====================================================

@router.get(
    "/",
    response_model=list[RewardResponse]
)
def get_rewards(
    db: Session = Depends(get_db)
):

    rewards = (
        db.query(Reward)
        .filter(
            Reward.is_active == True
        )
        .order_by(
            Reward.id.asc()
        )
        .all()
    )

    return rewards

