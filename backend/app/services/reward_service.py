from sqlalchemy.orm import Session

from app.models.reward import Reward



def get_available_rewards(
    db: Session,
    level: int
):

    rewards = (

        db.query(Reward)

        .filter(
            Reward.unlock_level <= level
        )

        .all()

    )


    return rewards