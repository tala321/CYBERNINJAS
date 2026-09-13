from datetime import datetime

from sqlalchemy import (
    Integer,
    String,
    Enum,
    Boolean,
    DateTime,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database import Base


class AvatarItem(Base):

    __tablename__ = "avatar_items"

    # =====================================================
    # PRIMARY KEY
    # =====================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    # =====================================================
    # NAME ARABIC
    # =====================================================

    name_ar: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    # =====================================================
    # NAME ENGLISH
    # =====================================================

    name_en: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    # =====================================================
    # ITEM TYPE
    # =====================================================

    item_type: Mapped[str] = mapped_column(
        Enum(
            "outfit",
            "headband",
            "mask",
            "accessory",
            "effect",
            name="avatar_item_type"
        ),
        nullable=False
    )

    # =====================================================
    # IMAGE
    # =====================================================

    image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    # =====================================================
    # PRICE
    # =====================================================

    price: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )

    # =====================================================
    # UNLOCK LEVEL
    # =====================================================

    unlock_level: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False
    )

    # =====================================================
    # ACTIVE
    # =====================================================

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    # =====================================================
    # CREATED AT
    # =====================================================

    created_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )

    # =====================================================
    # EQUIPPED ITEMS
    # =====================================================

    equipped_items = relationship(
        "UserEquippedItem",
        back_populates="item",
        cascade="all, delete-orphan"
    )

    # =====================================================
    # SHOP ITEM
    # =====================================================

    shop_item = relationship(
        "ShopItem",
        back_populates="item",
        uselist=False,
        cascade="all, delete-orphan"
    )

    # =====================================================
    # INVENTORY
    # =====================================================

    inventory = relationship(
        "UserInventory",
        back_populates="item",
        cascade="all, delete-orphan"
    )
