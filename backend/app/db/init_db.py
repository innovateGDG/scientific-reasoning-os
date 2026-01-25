from app.db.database import engine, Base
from app.db import models  # noqa: F401  (IMPORTANT: registers all models)


def init_db():
    print("Creating database tables...")
    print("Using database engine:", engine.url)
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")


if __name__ == "__main__":
    init_db()
