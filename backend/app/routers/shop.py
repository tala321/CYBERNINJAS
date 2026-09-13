from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db

from app.models.shop_item import ShopItem
from app.models.user_inventory import UserInventory
from app.models.user_purchase import UserPurchase
from app.models.user import User

from app.schemas.shop import (
    ShopItemResponse,
    PurchaseRequest
)


router = APIRouter(
    prefix="/shop",
    tags=["Shop"]
)


# =====================================================
# GET SHOP ITEMS
# =====================================================

@router.get(
    "/",
    response_model=list[ShopItemResponse]
)
def get_shop_items(
    db: Session = Depends(get_db)
):

    items = (
        db.query(ShopItem)
        .options(
            joinedload(
                ShopItem.item
            )
        )
        .filter(
            ShopItem.is_available == True
        )
        .all()
    )

    return items


# =====================================================
# PURCHASE ITEM
# =====================================================

@router.post(
    "/purchase"
)
def purchase_item(
    data: PurchaseRequest,
    db: Session = Depends(get_db)
):

    # -------------------------------------------------
    # CHECK USER
    # -------------------------------------------------

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


    # -------------------------------------------------
    # CHECK SHOP ITEM
    # -------------------------------------------------

    shop_item = (
        db.query(ShopItem)
        .options(
            joinedload(
                ShopItem.item
            )
        )
        .filter(
            ShopItem.id == data.shop_item_id
        )
        .first()
    )

    if not shop_item:
        raise HTTPException(
            status_code=404,
            detail="Shop item not found"
        )


    # -------------------------------------------------
    # CHECK AVAILABILITY
    # -------------------------------------------------

    if not shop_item.is_available:
        raise HTTPException(
            status_code=400,
            detail="Shop item is not available"
        )


    # -------------------------------------------------
    # CHECK ITEM
    # -------------------------------------------------

    if not shop_item.item:
        raise HTTPException(
            status_code=404,
            detail="Avatar item not found"
        )


    item = shop_item.item


    # -------------------------------------------------
    # CHECK ITEM ACTIVE
    # -------------------------------------------------

    if not item.is_active:
        raise HTTPException(
            status_code=400,
            detail="Avatar item is not active"
        )


    # -------------------------------------------------
    # CHECK LEVEL
    # -------------------------------------------------

    if item.unlock_level > user.current_level:
        raise HTTPException(
            status_code=400,
            detail="Item is locked for your level"
        )


    # -------------------------------------------------
    # CHECK IF ALREADY OWNED
    # -------------------------------------------------

    existing_inventory = (
        db.query(UserInventory)
        .filter(
            UserInventory.user_id == user.id,
            UserInventory.item_id == item.id
        )
        .first()
    )

    if existing_inventory:

        raise HTTPException(
            status_code=400,
            detail="Item already owned"
        )


    # -------------------------------------------------
    # CHECK XP
    # -------------------------------------------------

    if user.xp < shop_item.price:

        raise HTTPException(
            status_code=400,
            detail="Not enough XP"
        )


    # -------------------------------------------------
    # SAVE ORIGINAL PRICE
    # -------------------------------------------------

    price_paid = shop_item.price


    # -------------------------------------------------
    # REMOVE XP
    # -------------------------------------------------

    user.xp -= price_paid


    # -------------------------------------------------
    # ADD TO INVENTORY
    # -------------------------------------------------

    inventory = UserInventory(
        user_id=user.id,
        item_id=item.id
    )

    db.add(inventory)


    # -------------------------------------------------
    # ADD PURCHASE RECORD
    # -------------------------------------------------

    purchase = UserPurchase(
        user_id=user.id,
        shop_item_id=shop_item.id,
        price_paid=price_paid
    )

    db.add(purchase)


    # -------------------------------------------------
    # COMMIT
    # -------------------------------------------------

    try:

        db.commit()

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Purchase failed"
        )


    # -------------------------------------------------
    # REFRESH USER
    # -------------------------------------------------

    db.refresh(user)


    # -------------------------------------------------
    # RESPONSE
    # -------------------------------------------------

    return {
        "message": "Item purchased successfully",
        "user_id": user.id,
        "shop_item_id": shop_item.id,
        "item_id": item.id,
        "price_paid": price_paid,
        "remaining_xp": user.xp
    }