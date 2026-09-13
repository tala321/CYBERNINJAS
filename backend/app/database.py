from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


DATABASE_URL = (
    "mysql+pymysql://root:TalaSaied@localhost/cyberninja_db"
    "?charset=utf8mb4"
)


engine = create_engine(

    DATABASE_URL,

    pool_pre_ping=True,

    echo=False,

    connect_args={

        "charset": "utf8mb4",

        "use_unicode": True

    }

)



SessionLocal = sessionmaker(

    autocommit=False,

    autoflush=False,

    bind=engine

)



Base = declarative_base()



def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()