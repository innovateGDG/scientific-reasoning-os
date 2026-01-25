from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import json

from app.db.database import get_db
from app.db.models import Hypothesis, IngestChunk
from app.services.gemini_client import reason

router = APIRouter()

# =========================
# PROMPT
# =========================
HYPOTHESIS_PROMPT = """
You are a scientific reasoning assistant.

Given the following research context, generate ONE clear,
testable scientific hypothesis.

Return JSON only in this format:
{
  "hypothesis": "...",
  "rationale": "...",
  "falsification": "..."
}
"""


# =========================
# REQUEST SCHEMAS
# =========================
class ManualHypothesisRequest(BaseModel):
    context: str


class IngestHypothesisRequest(BaseModel):
    ingest_id: int


# =========================
# 1️⃣ MANUAL CONTEXT → HYPOTHESIS
# =========================
@router.post("/generate")
def generate_hypothesis_manual(
    request: ManualHypothesisRequest,
    db: Session = Depends(get_db)
):
    result = reason(HYPOTHESIS_PROMPT, request.context)

    try:
        parsed = json.loads(result)
        hypothesis_text = parsed["hypothesis"]
        rationale = parsed["rationale"]
        falsification = parsed["falsification"]
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to generate hypothesis"
        )

    hypothesis = Hypothesis(
        context=request.context,
        hypothesis=hypothesis_text,
        rationale=rationale,
        falsification=falsification
    )

    db.add(hypothesis)
    db.commit()
    db.refresh(hypothesis)

    return hypothesis


# =========================
# 2️⃣ INGEST → HYPOTHESIS
# =========================
@router.post("/from-ingest")
def generate_hypothesis_from_ingest(
    request: IngestHypothesisRequest,
    db: Session = Depends(get_db)
):
    chunks = (
        db.query(IngestChunk)
        .filter(IngestChunk.ingest_id == request.ingest_id)
        .order_by(IngestChunk.chunk_index)
        .all()
    )

    if not chunks:
        raise HTTPException(
            status_code=404,
            detail="No chunks found for this ingest_id"
        )

    context_text = "\n".join(chunk.content for chunk in chunks)
    context_text = context_text[:8000]  # safety limit

    result = reason(HYPOTHESIS_PROMPT, context_text)

    try:
        parsed = json.loads(result)
        hypothesis_text = parsed["hypothesis"]
        rationale = parsed["rationale"]
        falsification = parsed["falsification"]
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to generate hypothesis from ingest"
        )

    hypothesis = Hypothesis(
        context=f"Ingest #{request.ingest_id}",
        hypothesis=hypothesis_text,
        rationale=rationale,
        falsification=falsification
    )

    db.add(hypothesis)
    db.commit()
    db.refresh(hypothesis)

    return hypothesis


# =========================
# 3️⃣ RETRIEVAL ENDPOINTS
# =========================
@router.get("/history")
def get_hypothesis_history(db: Session = Depends(get_db)):
    return (
        db.query(Hypothesis)
        .order_by(Hypothesis.created_at.desc())
        .all()
    )


@router.get("/{hypothesis_id}")
def get_hypothesis_by_id(
    hypothesis_id: int,
    db: Session = Depends(get_db)
):
    hypothesis = (
        db.query(Hypothesis)
        .filter(Hypothesis.id == hypothesis_id)
        .first()
    )

    if not hypothesis:
        raise HTTPException(
            status_code=404,
            detail="Hypothesis not found"
        )

    return hypothesis
