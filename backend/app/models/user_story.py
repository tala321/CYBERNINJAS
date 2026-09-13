from sqlalchemy import Column, Integer, ForeignKey, Boolean
from app.database import Base


class UserStoryProgress(Base):

    __tablename__ = "user_story_progress"


    id = Column(
        Integer,
        primary_key=True
    )


    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )


    story_id = Column(
        Integer,
        ForeignKey("story_content.id")
    )


    is_completed = Column(
        Boolean,
        default=False
    )