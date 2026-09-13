from sqlalchemy import Column, Integer, String, Text, Boolean, Enum
from sqlalchemy.orm import relationship
from app.database import Base


class Mission(Base):

    __tablename__ = "missions"


    id = Column(
        Integer,
        primary_key=True
    )


    title_ar = Column(
        String(200),
        nullable=False
    )


    title_en = Column(
        String(200),
        nullable=False
    )


    description_ar = Column(
        Text
    )


    description_en = Column(
        Text
    )


    mission_type = Column(
        Enum(
            "complete_challenges",
            "earn_xp",
            "complete_lessons",
            "complete_levels",
            "other"
        ),
        nullable=False
    )


    target_value = Column(
        Integer,
        nullable=False
    )


    xp_reward = Column(
        Integer,
        default=0
    )


    is_daily = Column(
        Boolean,
        default=True
    )


    is_active = Column(
        Boolean,
        default=True
    )


    users = relationship(
    "UserMission",
    back_populates="mission",
    overlaps="mission"
)