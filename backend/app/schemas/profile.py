from datetime import datetime

from pydantic import BaseModel, ConfigDict


# =====================================================
# AVATAR ITEM RESPONSE
# =====================================================

class AvatarItemResponse(BaseModel):

    id: int
    name_ar: str
    name_en: str
    item_type: str
    image_url: str | None = None
    price: int
    unlock_level: int
    is_active: bool

    model_config = ConfigDict(
        from_attributes=True
    )


# =====================================================
# INVENTORY ITEM RESPONSE
# =====================================================

class InventoryItemResponse(BaseModel):

    id: int
    item_id: int
    acquired_at: datetime | None = None
    item: AvatarItemResponse

    model_config = ConfigDict(
        from_attributes=True
    )


# =====================================================
# EQUIPPED ITEM RESPONSE
# =====================================================

class EquippedItemResponse(BaseModel):

    id: int
    item_id: int
    equipped_at: datetime | None = None
    item: AvatarItemResponse

    model_config = ConfigDict(
        from_attributes=True
    )


# =====================================================
# EQUIP ITEM REQUEST
# =====================================================

class EquipItemRequest(BaseModel):

    user_id: int
    item_id: int