from datetime import datetime

from sqlalchemy import (
    Integer,
    String,
    Boolean,
    DateTime
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.database import Base


class Avatar(Base):

    __tablename__ = "avatars"


    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )


    name_ar: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )


    name_en: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )


    image_url: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )


    unlock_level: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False
    )


    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )


    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )


    # users relationship

    users = relationship(
        "User",
        back_populates="avatar"
    )
