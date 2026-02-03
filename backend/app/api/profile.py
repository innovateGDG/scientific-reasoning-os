from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import UserProfile

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.post("/")
def upsert_profile(
    user_id: int,
    research_domain: str = None,
    experience_level: str = None,
    research_purpose: str = None,
    preferred_methods: str = None,
    confidentiality_level: str = None,
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

    if not profile:
        profile = UserProfile(user_id=user_id)
        db.add(profile)

    profile.research_domain = research_domain
    profile.experience_level = experience_level
    profile.research_purpose = research_purpose
    profile.preferred_methods = preferred_methods
    profile.confidentiality_level = confidentiality_level

    db.commit()
    return {"message": "Profile saved successfully"}
