from datetime import datetime

from sqlalchemy import (
    Integer,
    String,
    DateTime,
    Enum,
    ForeignKey,
    func
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.database import Base


class XPTransaction(Base):

    __tablename__ = "xp_transactions"


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


    amount: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )


    source_type: Mapped[str] = mapped_column(
        Enum(
            "challenge",
            "lesson",
            "level",
            "boss",
            "mission",
            "badge",
            "reward",
            "other",
            name="xp_source_type"
        ),
        nullable=False
    )


    source_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )


    description_ar: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )


    description_en: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )


    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )


    # Relation
    user = relationship(
        "User",
        back_populates="xp_transactions"
    )
