from datetime import datetime

from sqlalchemy import Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Unit(Base):
    __tablename__ = "units"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    level_id: Mapped[int] = mapped_column(
        ForeignKey("levels.id"),
        nullable=False
    )

    unit_number: Mapped[int] = mapped_column(
        Integer,
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

    created_at: Mapped[datetime | None] = mapped_column(
        DateTime
    )


    # العلاقة مع Level
    level = relationship(
        "Level",
        back_populates="units"
    )


    # العلاقة مع Lessons
    lessons = relationship(
    "Lesson",
    back_populates="unit",
    cascade="all, delete-orphan",
    order_by="Lesson.lesson_number"
)
