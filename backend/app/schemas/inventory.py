from pydantic import BaseModel, ConfigDict

from app.schemas.profile import AvatarItemResponse



class ShopItemResponse(BaseModel):

    id: int

    item_id: int

    price: int

    currency: str

    is_featured: bool

    is_available: bool

    item: AvatarItemResponse


    model_config = ConfigDict(
        from_attributes=True
    )



class PurchaseRequest(BaseModel):

    user_id: int

    shop_item_id: int