# app/models/user.py

from datetime import datetime

from sqlalchemy import (
    Integer,
    String,
    DateTime,
    ForeignKey,
    Boolean,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database import Base



class User(Base):

    __tablename__ = "users"


    # =====================================================
    # PRIMARY KEY
    # =====================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )


    # =====================================================
    # USERNAME
    # =====================================================

    username: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False
    )


    # =====================================================
    # EMAIL
    # =====================================================

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False
    )


    # =====================================================
    # PASSWORD
    # =====================================================

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )


    # =====================================================
    # DISPLAY NAME
    # =====================================================

    display_name: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )


    # =====================================================
    # AVATAR
    # =====================================================

    avatar_id: Mapped[int | None] = mapped_column(
        ForeignKey(
            "avatars.id",
            ondelete="SET NULL"
        ),
        nullable=True
    )


    # =====================================================
    # XP
    # =====================================================

    xp: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )


    # =====================================================
    # CURRENT LEVEL
    # =====================================================

    current_level: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False
    )


    # =====================================================
    # STREAK
    # =====================================================

    streak_days: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )


    # =====================================================
    # LANGUAGE
    # =====================================================

    language: Mapped[str] = mapped_column(
        String(10),
        default="ar",
        nullable=False
    )


    # =====================================================
    # ACTIVE STATUS
    # =====================================================

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )


    # =====================================================
    # ROLE
    # =====================================================

    role: Mapped[str] = mapped_column(
        String(20),
        default="child",
        nullable=False
    )


    # =====================================================
    # DATES
    # =====================================================

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )


    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )



    # =====================================================
    # RELATIONSHIPS
    # =====================================================


    # =========================
    # AVATAR
    # =========================

    avatar = relationship(
    "Avatar",
    back_populates="users",
    foreign_keys=[avatar_id]
)


    # =========================
    # USER PROGRESS
    # =========================

    progress = relationship(
        "UserProgress",
        back_populates="user",
        cascade="all, delete-orphan"
    )


    # =========================
    # CHALLENGE ATTEMPTS
    # =========================

    challenge_attempts = relationship(
        "ChallengeAttempt",
        back_populates="user",
        cascade="all, delete-orphan"
    )


    # =========================
    # XP TRANSACTIONS
    # =========================

    xp_transactions = relationship(
        "XPTransaction",
        back_populates="user",
        cascade="all, delete-orphan"
    )


    # =========================
    # EQUIPPED ITEMS
    # =========================

    equipped_items = relationship(
        "UserEquippedItem",
        back_populates="user",
        cascade="all, delete-orphan"
    )


    # =========================
    # INVENTORY
    # =========================

    inventory = relationship(
        "UserInventory",
        back_populates="user",
        cascade="all, delete-orphan"
    )


    # =========================
    # PURCHASES
    # =========================

    purchases = relationship(
        "UserPurchase",
        back_populates="user",
        cascade="all, delete-orphan"
    )


    # =========================
    # BADGES
    # =========================

    badges = relationship(
        "UserBadge",
        back_populates="user",
        cascade="all, delete-orphan"
    )
