from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db

from app.models.xp_transaction import XPTransaction
from app.models.user import User

from app.schemas.xp import (
    UserXPResponse,
    XPCreate,
    XPTransactionResponse
)

from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/xp",
    tags=["XP"]
)


# =====================================================
# GET USER XP
# =====================================================

@router.get(
    "/user/{user_id}",
    response_model=UserXPResponse
)
def get_user_xp(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if user_id != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    transactions = (
        db.query(XPTransaction)
        .filter(
            XPTransaction.user_id == current_user.id
        )
        .order_by(
            XPTransaction.created_at.desc()
        )
        .all()
    )

    total_xp = (
        db.query(
            func.coalesce(
                func.sum(XPTransaction.amount),
                0
            )
        )
        .filter(
            XPTransaction.user_id == current_user.id
        )
        .scalar()
    )

    return {

        "user_id": current_user.id,

        "total_xp": total_xp,

        "transactions": transactions

    }


# =====================================================
# ADD XP
# =====================================================

@router.post(
    "/add",
    response_model=XPTransactionResponse
)
def add_xp(

    data: XPCreate,

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    # =============================================
    # SECURITY
    # =============================================

    if data.user_id != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    # =============================================
    # CREATE XP TRANSACTION
    # =============================================

    transaction = XPTransaction(

        user_id=current_user.id,

        amount=data.amount,

        source_type=data.source_type,

        source_id=data.source_id,

        description_ar=data.description_ar,

        description_en=data.description_en

    )

    db.add(transaction)

    # =============================================
    # UPDATE USER XP
    # =============================================

    current_user.xp += data.amount

    # =============================================
    # COMMIT
    # =============================================

    db.commit()

    db.refresh(transaction)

    return transaction