from datetime import datetime

from sqlalchemy import Integer, String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Level(Base):
    __tablename__ = "levels"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    level_number: Mapped[int] = mapped_column(
        Integer,
        unique=True,
        nullable=False
    )

    title_ar: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    title_en: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    description_ar: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    description_en: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    goal_ar: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    goal_en: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    xp_required: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    badge_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    is_active: Mapped[int] = mapped_column(
        Integer,
        default=1
    )

    created_at: Mapped[datetime | None] = mapped_column(
        DateTime
    )


    # العلاقة مع الوحدات
    units = relationship(
    "Unit",
    back_populates="level",
    cascade="all, delete-orphan"
)
    progress = relationship(
    "UserProgress",
    back_populates="level"
)