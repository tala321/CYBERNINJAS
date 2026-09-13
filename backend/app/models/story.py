from sqlalchemy import Column, Integer, Text, String, Boolean
from app.database import Base


class StoryContent(Base):

    __tablename__ = "story_content"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    level_id = Column(
        Integer,
        nullable=False
    )


    scene_number = Column(
        Integer,
        nullable=False
    )


    title_ar = Column(
        String(200),
        nullable=False
    )


    title_en = Column(
        String(200),
        nullable=False
    )


    content_ar = Column(
        Text,
        nullable=False
    )


    content_en = Column(
        Text,
        nullable=False
    )


    image_url = Column(
        String(500),
        nullable=True
    )


    is_active = Column(
        Boolean,
        default=True
    )