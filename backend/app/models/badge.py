from datetime import datetime

from sqlalchemy import (
    Integer,
    String,
    DateTime,
    func,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database import Base


class Badge(Base):

    __tablename__ = "badges"

    # =====================================================
    # PRIMARY KEY
    # =====================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    # =====================================================
    # BADGE NAME
    # =====================================================

    name_ar: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    name_en: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    # =====================================================
    # DESCRIPTION
    # =====================================================

    description_ar: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    description_en: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    # =====================================================
    # IMAGE
    # =====================================================

    image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    # =====================================================
    # XP REWARD
    # =====================================================

    xp_reward: Mapped[int] = mapped_column(
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
    # CREATED AT
    # =====================================================

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    # =====================================================
    # USER BADGES
    # =====================================================

    user_badges = relationship(
        "UserBadge",
        back_populates="badge",
        cascade="all, delete-orphan"
    )
