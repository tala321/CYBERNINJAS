from sqlalchemy.orm import Session

from app.models.user import User
from app.models.xp_transaction import XPTransaction



def add_xp(
    db: Session,
    user_id: int,
    amount: int,
    source_type: str,
    source_id: int | None = None,
    description_ar: str | None = None,
    description_en: str | None = None
):

    user = (
        db.query(User)
        .filter(
            User.id == user_id
        )
        .first()
    )

    if not user:
        return None


    user.xp += amount


    transaction = XPTransaction(

        user_id=user_id,

        amount=amount,

        source_type=source_type,

        source_id=source_id,

        description_ar=description_ar,

        description_en=description_en
    )


    db.add(transaction)

    db.flush()


    return user