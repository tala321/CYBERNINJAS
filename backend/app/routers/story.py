from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.story import StoryContent
from app.core.dependencies import get_current_user
from app.models.user import User


router = APIRouter(
    prefix="/story",
    tags=["Story"]
)



@router.get("/level/{level_id}")
def get_story(
    level_id:int,
    db:Session=Depends(get_db),
    current_user:User=Depends(get_current_user)
):

    stories = (
        db.query(StoryContent)
        .filter(
            StoryContent.level_id == level_id,
            StoryContent.is_active == True
        )
        .order_by(
            StoryContent.scene_number
        )
        .all()
    )


    return stories