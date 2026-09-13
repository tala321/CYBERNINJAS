from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session, joinedload

from app.database import get_db


from app.models.level import Level
from app.models.unit import Unit
from app.models.lesson import Lesson
from app.models.user_progress import UserProgress


from app.schemas.journey import JourneyResponse



router = APIRouter(
    prefix="/journey",
    tags=["Journey"]
)



@router.get(
    "/{user_id}/{level_id}",
    response_model=JourneyResponse
)
def get_journey(

    user_id:int,

    level_id:int,

    db:Session = Depends(get_db)

):


    level = (

        db.query(Level)

        .options(

            joinedload(Level.units)

            .joinedload(Unit.lessons)

            .joinedload(Lesson.challenges)

        )

        .filter(
            Level.id == level_id
        )

        .first()

    )


    if not level:

        raise HTTPException(

            status_code=404,

            detail="Level not found"

        )



    progress_data = (

        db.query(UserProgress)

        .filter(

            UserProgress.user_id == user_id,

            UserProgress.level_id == level_id

        )

        .all()

    )



    progress_map = {

        p.lesson_id:p

        for p in progress_data

        if p.lesson_id

    }



    return {


        "id": level.id,

        "level_number": level.level_number,

        "title_ar": level.title_ar,

        "title_en": level.title_en,


        "units":[


            {


                "id":unit.id,

                "unit_number":unit.unit_number,

                "title_ar":unit.title_ar,

                "title_en":unit.title_en,


                "lessons":[



                    {


                        "id":lesson.id,


                        "lesson_number":lesson.lesson_number,


                        "title_ar":lesson.title_ar,


                        "title_en":lesson.title_en,


                        "challenges_count":len(
                            lesson.challenges
                        ),


                        "is_completed":

                        progress_map.get(
                            lesson.id
                        ).is_completed

                        if lesson.id in progress_map

                        else False,



                        "is_started":

                        progress_map.get(
                            lesson.id
                        ).is_started

                        if lesson.id in progress_map

                        else False,



                        "progress_percent":

                        float(

                            progress_map.get(
                                lesson.id
                            ).progress_percent

                        )

                        if lesson.id in progress_map

                        else 0


                    }


                    for lesson in unit.lessons

                ]

            }


            for unit in level.units

        ]

    }