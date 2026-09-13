from datetime import datetime

from sqlalchemy import (
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    JSON,
    func
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.database import Base



class Challenge(Base):

    __tablename__ = "challenges"


    # =========================
    # BASIC FIELDS
    # =========================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )


    lesson_id: Mapped[int] = mapped_column(
        ForeignKey(
            "lessons.id",
            ondelete="CASCADE",
            onupdate="CASCADE"
        ),
        nullable=False
    )


    challenge_number: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )


    challenge_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )


    title_ar: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )


    title_en: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )


    question_ar: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )


    question_en: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )


    explanation_ar: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )


    explanation_en: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )


    xp_reward: Mapped[int] = mapped_column(
        Integer,
        default=10,
        nullable=False
    )


    content_json: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True
    )


    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )



    # =========================
    # LESSON RELATION
    # =========================

    lesson = relationship(
        "Lesson",
        back_populates="challenges"
    )



    # =========================
    # OPTIONS RELATION
    # =========================

    options = relationship(
        "ChallengeOption",
        back_populates="challenge",
        cascade="all, delete-orphan",
        order_by="ChallengeOption.sort_order"
    )



    # =========================
    # ATTEMPTS RELATION
    # =========================

    attempts = relationship(
        "ChallengeAttempt",
        back_populates="challenge",
        cascade="all, delete-orphan"
    )
