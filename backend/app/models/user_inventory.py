from datetime import datetime

from sqlalchemy import (
    Integer,
    DateTime,
    ForeignKey,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database import Base


class UserInventory(Base):

    __tablename__ = "user_inventory"

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
    # ACQUIRED AT
    # =====================================================

    acquired_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    # =====================================================
    # RELATIONSHIPS
    # =====================================================

    user = relationship(
        "User",
        back_populates="inventory"
    )

    item = relationship(
        "AvatarItem",
        back_populates="inventory"
    )

    # =====================================================
    # PREVENT DUPLICATE ITEMS
    # =====================================================

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "item_id",
            name="unique_user_item"
        ),
    )
