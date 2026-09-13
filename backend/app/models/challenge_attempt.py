from datetime import datetime

from sqlalchemy import (
    Integer,
    Boolean,
    ForeignKey,
    DateTime,
    JSON,
    func
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.database import Base


class ChallengeAttempt(Base):

    __tablename__ = "challenge_attempts"

    # =====================
    # BASIC
    # =====================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id: Mapped[int] = mapped_column(

    ForeignKey(
        "users.id",
        ondelete="CASCADE"
    ),

    nullable=False

)

    challenge_id: Mapped[int] = mapped_column(

    ForeignKey(
        "challenges.id",
        ondelete="CASCADE"
    ),

    nullable=False

)

    selected_option_id: Mapped[int | None] = mapped_column(
        ForeignKey(
            "challenge_options.id",
            ondelete="SET NULL",
            onupdate="CASCADE"
        ),
        nullable=True
    )

    # =====================
    # ANSWER DATA
    # =====================

    answer_data: Mapped[object | None] = mapped_column(
        JSON,
        nullable=True
    )

    # =====================
    # RESULT
    # =====================

    is_correct: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )

    xp_earned: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )

    attempt_number: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False
    )

    attempted_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

    # =====================
    # RELATIONSHIPS
    # =====================

    user = relationship(
        "User",
        back_populates="challenge_attempts"
    )

    challenge = relationship(
        "Challenge",
        back_populates="attempts"
    )

    selected_option = relationship(
        "ChallengeOption"
    )