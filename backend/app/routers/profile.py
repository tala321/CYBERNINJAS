from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db


# =====================================================
# MODELS
# =====================================================

from app.models.user import User
from app.models.avatar import Avatar
from app.models.avatar_item import AvatarItem
from app.models.user_inventory import UserInventory
from app.models.user_equipped_item import UserEquippedItem
from app.models.user_progress import UserProgress
from app.models.user_badge import UserBadge

from app.models.user_mission import UserMission
from app.models.mission import Mission


# =====================================================
# SCHEMAS
# =====================================================

from app.schemas.user import (
    UserResponse,
    ProfileUpdate
)

from app.schemas.profile import (
    AvatarItemResponse,
    EquippedItemResponse,
    EquipItemRequest
)


# =====================================================
# AUTH
# =====================================================

from app.core.dependencies import get_current_user



router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)



# =====================================================
# MY PROFILE
# =====================================================

@router.get(
    "/me",
    response_model=UserResponse
)
def get_my_profile(
    current_user: User = Depends(get_current_user)
):

    return current_user





# =====================================================
# UPDATE PROFILE
# =====================================================

@router.put(
    "/me",
    response_model=UserResponse
)
def update_profile(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):


    if data.display_name is not None:
        current_user.display_name = data.display_name



    if data.avatar_id is not None:


        avatar = (
            db.query(Avatar)
            .filter(
                Avatar.id == data.avatar_id,
                Avatar.is_active == True
            )
            .first()
        )


        if not avatar:
            raise HTTPException(
                status_code=404,
                detail="Avatar not found"
            )


        if avatar.unlock_level > current_user.current_level:

            raise HTTPException(
                status_code=403,
                detail="Avatar locked"
            )


        current_user.avatar_id = avatar.id




    if data.language is not None:


        if data.language not in ["ar","en"]:

            raise HTTPException(
                status_code=400,
                detail="Invalid language"
            )


        current_user.language = data.language



    db.commit()
    db.refresh(current_user)


    return current_user







# =====================================================
# AVATAR ITEMS
# =====================================================

@router.get(
    "/avatar-items",
    response_model=list[AvatarItemResponse]
)
def avatar_items(
    db:Session = Depends(get_db),
    current_user:User = Depends(get_current_user)
):


    return (
        db.query(AvatarItem)
        .filter(
            AvatarItem.is_active == True,
            AvatarItem.unlock_level <= current_user.current_level
        )
        .order_by(AvatarItem.id)
        .all()
    )







# =====================================================
# INVENTORY
# =====================================================

@router.get(
    "/inventory"
)
def inventory(
    db:Session = Depends(get_db),
    current_user:User = Depends(get_current_user)
):


    return (

        db.query(UserInventory)

        .options(
            joinedload(UserInventory.item)
        )

        .filter(
            UserInventory.user_id == current_user.id
        )

        .all()

    )







# =====================================================
# EQUIPPED
# =====================================================

@router.get(
    "/equipped",
    response_model=list[EquippedItemResponse]
)
def equipped(
    db:Session = Depends(get_db),
    current_user:User = Depends(get_current_user)
):


    return (

        db.query(UserEquippedItem)

        .options(
            joinedload(UserEquippedItem.item)
        )

        .filter(
            UserEquippedItem.user_id == current_user.id
        )

        .all()

    )








# =====================================================
# EQUIP ITEM
# =====================================================

@router.post(
    "/equip",
    response_model=EquippedItemResponse
)
def equip(
    data:EquipItemRequest,
    db:Session = Depends(get_db),
    current_user:User = Depends(get_current_user)
):


    item = (

        db.query(AvatarItem)

        .filter(
            AvatarItem.id == data.item_id,
            AvatarItem.is_active == True
        )

        .first()

    )


    if not item:

        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )



    owned = (

        db.query(UserInventory)

        .filter(
            UserInventory.user_id == current_user.id,
            UserInventory.item_id == item.id
        )

        .first()

    )


    if not owned:

        raise HTTPException(
            status_code=403,
            detail="Item not owned"
        )



    exists = (

        db.query(UserEquippedItem)

        .filter(
            UserEquippedItem.user_id == current_user.id,
            UserEquippedItem.item_id == item.id
        )

        .first()

    )


    if exists:

        raise HTTPException(
            status_code=400,
            detail="Already equipped"
        )



    equipped = UserEquippedItem(
        user_id=current_user.id,
        item_id=item.id
    )


    db.add(equipped)
    db.commit()
    db.refresh(equipped)


    return equipped








# =====================================================
# PROGRESS
# =====================================================

@router.get(
    "/progress"
)
def progress(
    db:Session = Depends(get_db),
    current_user:User = Depends(get_current_user)
):


    return (

        db.query(UserProgress)

        .filter(
            UserProgress.user_id == current_user.id
        )

        .all()

    )







# =====================================================
# BADGES
# =====================================================

@router.get(
    "/badges"
)
def badges(
    db:Session = Depends(get_db),
    current_user:User = Depends(get_current_user)
):


    return (

        db.query(UserBadge)

        .options(
            joinedload(UserBadge.badge)
        )

        .filter(
            UserBadge.user_id == current_user.id
        )

        .all()

    )








# =====================================================
# MISSIONS
# =====================================================

@router.get(
    "/missions"
)
def missions(

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):


    data = (

        db.query(UserMission)

        .options(
            joinedload(UserMission.mission)
        )

        .filter(
            UserMission.user_id == current_user.id
        )

        .all()

    )


    return data