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


class UserBadge(Base):

    __tablename__ = "user_badges"

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
    # BADGE
    # =====================================================

    badge_id: Mapped[int] = mapped_column(
        ForeignKey(
            "badges.id",
            ondelete="CASCADE",
            onupdate="CASCADE"
        ),
        nullable=False
    )

    # =====================================================
    # EARNED AT
    # =====================================================

    earned_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    # =====================================================
    # RELATIONSHIPS
    # =====================================================

    user = relationship(
        "User",
        back_populates="badges"
    )

    badge = relationship(
        "Badge",
        back_populates="user_badges"
    )

    # =====================================================
    # PREVENT DUPLICATE BADGES
    # =====================================================

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "badge_id",
            name="unique_user_badge"
        ),
    )
