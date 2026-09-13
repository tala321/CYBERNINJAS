from datetime import datetime

from sqlalchemy import (
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
    Enum,
    UniqueConstraint,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database import Base


class ShopItem(Base):

    __tablename__ = "shop_items"

    # =====================================================
    # PRIMARY KEY
    # =====================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    # =====================================================
    # AVATAR ITEM
    # =====================================================

    item_id: Mapped[int] = mapped_column(
        ForeignKey(
            "avatar_items.id",
            ondelete="CASCADE",
            onupdate="CASCADE"
        ),
        nullable=False
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
    # CURRENCY
    # =====================================================

    currency: Mapped[str] = mapped_column(
        Enum(
            "xp",
            name="shop_currency"
        ),
        default="xp",
        nullable=False
    )

    # =====================================================
    # FEATURED
    # =====================================================

    is_featured: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )

    # =====================================================
    # AVAILABLE
    # =====================================================

    is_available: Mapped[bool] = mapped_column(
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
    # RELATIONSHIPS
    # =====================================================

    item = relationship(
        "AvatarItem",
        back_populates="shop_item"
    )

    purchases = relationship(
        "UserPurchase",
        back_populates="shop_item",
        cascade="all, delete-orphan"
    )

    # =====================================================
    # PREVENT DUPLICATE SHOP ITEM
    # =====================================================

    __table_args__ = (
        UniqueConstraint(
            "item_id",
            name="unique_shop_item"
        ),
    )
