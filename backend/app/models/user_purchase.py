from datetime import datetime

from sqlalchemy import (
    Integer,
    DateTime,
    ForeignKey,
    func,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database import Base


class UserPurchase(Base):

    __tablename__ = "user_purchases"

    # =====================================================
    # PRIMARY KEY
    # =====================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    # =====================================================
    # USER
    # =====================================================

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
            onupdate="CASCADE"
        ),
        nullable=False
    )

    # =====================================================
    # SHOP ITEM
    # =====================================================

    shop_item_id: Mapped[int] = mapped_column(
        ForeignKey(
            "shop_items.id",
            ondelete="CASCADE",
            onupdate="CASCADE"
        ),
        nullable=False
    )

    # =====================================================
    # PRICE PAID
    # =====================================================

    price_paid: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    # =====================================================
    # PURCHASE DATE
    # =====================================================

    purchased_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    # =====================================================
    # RELATIONSHIPS
    # =====================================================

    user = relationship(
        "User",
        back_populates="purchases"
    )

    shop_item = relationship(
        "ShopItem",
        back_populates="purchases"
    )

