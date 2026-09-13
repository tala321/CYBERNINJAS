from datetime import datetime

from sqlalchemy import (
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
    Numeric,
    func
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.database import Base



class UserProgress(Base):

    __tablename__ = "user_progress"


    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )


    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )


    level_id: Mapped[int] = mapped_column(
        ForeignKey("levels.id"),
        nullable=False
    )


    unit_id: Mapped[int | None] = mapped_column(
        ForeignKey("units.id"),
        nullable=True
    )


    lesson_id: Mapped[int | None] = mapped_column(
        ForeignKey("lessons.id"),
        nullable=True
    )


    progress_percent: Mapped[float] = mapped_column(
        Numeric(5,2),
        default=0
    )


    is_started: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )


    is_completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )


    started_at: Mapped[datetime | None] = mapped_column(
        DateTime
    )


    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime
    )


    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )


    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now()
    )


 # =========================
# RELATIONSHIPS
# =========================
    user = relationship(
        "User",
        back_populates="progress"
    )


    level = relationship(
        "Level",
        back_populates="progress"
    )


    level = relationship(
    "Level",
    back_populates="progress"
)


    lesson = relationship(
        "Lesson",
        back_populates="progress"
    )