from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import json
from typing import List

from app.db.database import get_db
from app.db.models import Hypothesis, Assumption
from app.services.gemini_client import reason

router = APIRouter()


# =========================
# Prompt
# =========================
PROMPT = """
You are a scientific reasoning assistant.

Given a hypothesis, list 3–5 key assumptions that must be true
for the hypothesis to hold.

Return JSON only in this format:
{
  "assumptions": [
    "assumption 1",
    "assumption 2",
    "assumption 3"
  ]
}
"""


# =========================
# Request Schema
# =========================
class AssumptionRequest(BaseModel):
    hypothesis_id: int


# =========================
# Generate Assumptions
# =========================
@router.post("/generate")
def generate_assumptions(
    request: AssumptionRequest,
    db: Session = Depends(get_db)
):
    hypothesis = db.query(Hypothesis).filter(
        Hypothesis.id == request.hypothesis_id
    ).first()

    if not hypothesis:
        raise HTTPException(status_code=404, detail="Hypothesis not found")

    result = reason(PROMPT, hypothesis.hypothesis)

    try:
        parsed = json.loads(result)
        assumptions_list: List[str] = parsed.get("assumptions", [])
    except Exception:
        assumptions_list = []

    if not assumptions_list:
        raise HTTPException(status_code=500, detail="Failed to generate assumptions")

    saved = []

    for text in assumptions_list:
        a = Assumption(
            hypothesis_id=hypothesis.id,
            assumption=text
        )
        db.add(a)
        saved.append(a)

    db.commit()

    for a in saved:
        db.refresh(a)

    return {
        "hypothesis_id": hypothesis.id,
        "assumptions": [
            {
                "id": a.id,
                "assumption": a.assumption,
                "created_at": a.created_at
            }
            for a in saved
        ]
    }


# =========================
# Get Assumptions by Hypothesis
# =========================
@router.get("/by-hypothesis/{hypothesis_id}")
def get_assumptions_by_hypothesis(
    hypothesis_id: int,
    db: Session = Depends(get_db)
):
    assumptions = db.query(Assumption).filter(
        Assumption.hypothesis_id == hypothesis_id
    ).all()

    return {
        "hypothesis_id": hypothesis_id,
        "assumptions": [
            {
                "id": a.id,
                "assumption": a.assumption,
                "created_at": a.created_at
            }
            for a in assumptions
        ]
    }
