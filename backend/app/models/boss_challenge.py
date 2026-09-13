from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class BossChallenge(Base):

    __tablename__ = "boss_challenges"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    level_id = Column(
        Integer,
        ForeignKey("levels.id")
    )


    title_ar = Column(
        String(255)
    )


    title_en = Column(
        String(255)
    )


    description_ar = Column(
        String
    )


    description_en = Column(
        String
    )


    xp_reward = Column(
        Integer,
        default=100
    )


    time_limit_seconds = Column(
        Integer,
        default=300
    )


    is_active = Column(
        Boolean,
        default=True
    )


    level = relationship(
        "Level"
    )