from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import json
from typing import List

from app.db.database import get_db
from app.db.models import Hypothesis, FailureMode
from app.services.gemini_client import reason

router = APIRouter()


# =========================
# Prompt
# =========================
PROMPT = """
You are a scientific reasoning assistant.

Given a hypothesis, list 3–5 possible failure modes or reasons
why the hypothesis may not hold true.

Return JSON only in this format:
{
  "failure_modes": [
    "failure mode 1",
    "failure mode 2",
    "failure mode 3"
  ]
}
"""


# =========================
# Request Schema
# =========================
class FailureRequest(BaseModel):
    hypothesis_id: int


# =========================
# Generate Failure Modes
# =========================
@router.post("/generate")
def generate_failure_modes(
    request: FailureRequest,
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
        failure_list: List[str] = (
            parsed.get("failure_modes")
            or parsed.get("failures")
            or []
        )
    except Exception:
        failure_list = [
            line.strip("-•0123456789. ").strip()
            for line in result.splitlines()
            if line.strip()
        ]

    if not failure_list:
        raise HTTPException(status_code=500, detail="Failed to generate failure modes")

    saved = []

    for text in failure_list:
        f = FailureMode(
            hypothesis_id=hypothesis.id,
            failure=text
        )
        db.add(f)
        saved.append(f)

    db.commit()

    for f in saved:
        db.refresh(f)

    return {
        "hypothesis_id": hypothesis.id,
        "failure_modes": [
            {
                "id": f.id,
                "failure": f.failure,
                "created_at": f.created_at
            }
            for f in saved
        ]
    }


# =========================
# Get Failure Modes by Hypothesis
# =========================
@router.get("/by-hypothesis/{hypothesis_id}")
def get_failure_modes_by_hypothesis(
    hypothesis_id: int,
    db: Session = Depends(get_db)
):
    failures = db.query(FailureMode).filter(
        FailureMode.hypothesis_id == hypothesis_id
    ).all()

    return {
        "hypothesis_id": hypothesis_id,
        "failure_modes": [
            {
                "id": f.id,
                "failure": f.failure,
                "created_at": f.created_at
            }
            for f in failures
        ]
    }
