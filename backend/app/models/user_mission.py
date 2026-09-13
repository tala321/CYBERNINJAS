from sqlalchemy import Column, Integer, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class UserMission(Base):

    __tablename__ = "user_missions"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    mission_id = Column(
        Integer,
        ForeignKey("missions.id"),
        nullable=False
    )

    progress_value = Column(
        Integer,
        default=0
    )

    is_completed = Column(
        Boolean,
        default=False
    )

    started_at = Column(
        DateTime
    )

    completed_at = Column(
        DateTime,
        nullable=True
    )

    mission_date = Column(
        Date,
        nullable=False
    )


    mission = relationship(
    "Mission",
    back_populates="users"
)