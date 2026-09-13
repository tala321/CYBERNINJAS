from datetime import datetime

from sqlalchemy import Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Lesson(Base):

    __tablename__ = "lessons"


    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )


    unit_id: Mapped[int] = mapped_column(
        ForeignKey("units.id"),
        nullable=False
    )



    lesson_number: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )


    title_ar: Mapped[str] = mapped_column(
        String(200),
        nullable=False
    )


    title_en: Mapped[str] = mapped_column(
        String(200),
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


    xp_reward: Mapped[int] = mapped_column(
        Integer,
        default=0
    )


    created_at: Mapped[datetime | None] = mapped_column(
        DateTime
    )


    # العلاقة مع Unit
    unit = relationship(
        "Unit",
        back_populates="lessons"
    )


    # العلاقة مع Challenges
    challenges = relationship(
        "Challenge",
        back_populates="lesson",
        cascade="all, delete-orphan"
    )


    progress = relationship(
    "UserProgress",
    back_populates="lesson"
)



    
