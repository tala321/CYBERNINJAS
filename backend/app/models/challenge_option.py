from datetime import datetime

from sqlalchemy import (
    Integer,
    Text,
    Boolean,
    DateTime,
    ForeignKey,
    func
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.database import Base


class ChallengeOption(Base):

    __tablename__ = "challenge_options"


    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )


    challenge_id: Mapped[int] = mapped_column(
        ForeignKey(
            "challenges.id",
            ondelete="CASCADE",
            onupdate="CASCADE"
        ),
        nullable=False
    )


    option_text_ar: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )


    option_text_en: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )


    is_correct: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False
    )


    sort_order: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0
    )


    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )


    challenge = relationship(
        "Challenge",
        back_populates="options"
    )
