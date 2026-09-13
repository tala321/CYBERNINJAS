from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

import os


from app.core.rate_limit import limiter


from app.routers import (

    levels,
    units,
    lessons,
    challenges,
    journey,
    progress,

    auth,
    xp,
    challenge_attempts,
    profile,

    shop,
    rewards,
    badges,
    dashboard,

    story,
    missions,
    boss,

)



# =====================================================
# APP
# =====================================================


app = FastAPI(

    title="CYBERNINJAS API",

    version="1.0.0",

    description=
    "Cybersecurity Learning Platform API"

)



# =====================================================
# RATE LIMITING
# =====================================================


app.state.limiter = limiter


app.add_exception_handler(

    RateLimitExceeded,

    _rate_limit_exceeded_handler

)



# =====================================================
# CORS
# =====================================================


frontend_url = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)


allowed_origins = [

    "http://localhost:5173",

    "http://127.0.0.1:5173",

    "http://localhost:3000",

    "http://127.0.0.1:3000",

    frontend_url

]



app.add_middleware(

    CORSMiddleware,

    allow_origins=list(
        set(allowed_origins)
    ),

    allow_credentials=True,

    allow_methods=[

        "GET",

        "POST",

        "PUT",

        "PATCH",

        "DELETE",

        "OPTIONS"

    ],

    allow_headers=[

        "*"

    ],

)



# =====================================================
# ROUTERS
# =====================================================


app.include_router(
    levels.router
)


app.include_router(
    units.router
)


app.include_router(
    lessons.router
)


app.include_router(
    challenges.router
)


app.include_router(
    journey.router
)


app.include_router(
    progress.router
)



# AUTH

app.include_router(
    auth.router
)


app.include_router(
    xp.router
)


app.include_router(
    challenge_attempts.router
)


app.include_router(
    profile.router
)



# GAMIFICATION

app.include_router(
    badges.router
)


app.include_router(
    rewards.router
)


app.include_router(
    shop.router
)


app.include_router(
    dashboard.router
)



# STORY SYSTEM

app.include_router(
    story.router
)


app.include_router(
    missions.router
)


app.include_router(
    boss.router
)



# =====================================================
# HEALTH CHECK
# =====================================================


@app.get(
    "/health"
)
def health():

    return {

        "status": "ok",

        "service":
        "CYBERNINJAS API"

    }



# =====================================================
# ROOT
# =====================================================


@app.get(
    "/"
)
def root():

    return {

        "status":
        "CYBERNINJAS API RUNNING",

        "version":
        "1.0.0",

        "environment":
        os.getenv(
            "ENVIRONMENT",
            "development"
        ),

        "encoding":
        "UTF-8"

    }