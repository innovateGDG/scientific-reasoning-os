from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Project

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post("/")
def create_project(
    name: str,
    description: str = "",
    owner_id: int = None,
    db: Session = Depends(get_db)
):
    if owner_id is None:
        raise HTTPException(status_code=400, detail="owner_id is required")

    project = Project(
        name=name,
        description=description,
        owner_id=owner_id
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    return project


@router.get("/")
def list_projects(owner_id: int, db: Session = Depends(get_db)):
    return db.query(Project).filter(Project.owner_id == owner_id).all()
