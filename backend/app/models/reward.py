from datetime import datetime

from sqlalchemy import (
    Integer,
    String,
    DateTime,
    Text,
    Enum,
    Boolean,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)

from app.database import Base


class Reward(Base):

    __tablename__ = "rewards"

    # =====================================================
    # PRIMARY KEY
    # =====================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    # =====================================================
    # REWARD NAME
    # =====================================================

    name_ar: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    name_en: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    # =====================================================
    # DESCRIPTION
    # =====================================================

    description_ar: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    description_en: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    # =====================================================
    # REWARD TYPE
    # =====================================================

    reward_type: Mapped[str] = mapped_column(
        Enum(
            "xp",
            "badge",
            "avatar",
            "item",
            name="reward_type"
        ),
        nullable=False
    )

    # =====================================================
    # REWARD VALUE
    # =====================================================

    reward_value: Mapped[int | None] = mapped_column(
        Integer,
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
