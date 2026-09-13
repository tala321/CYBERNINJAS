from datetime import datetime

from sqlalchemy import (
    Integer,
    Boolean,
    ForeignKey,
    DateTime,
    func
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.database import Base


class BossAttempt(Base):

    __tablename__ = "boss_attempts"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id")
    )

    boss_id: Mapped[int] = mapped_column(
        ForeignKey("boss_challenges.id")
    )

    score: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    passed: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )

    xp_earned: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )