from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import json
from typing import List

from app.db.database import get_db
from app.db.models import (
    Hypothesis,
    Assumption,
    FailureMode,
    IngestChunk,
)
from app.services.gemini_client import reason

router = APIRouter()


# =========================
# PROMPTS
# =========================
HYPOTHESIS_PROMPT = """
You are a scientific reasoning assistant.

Given the following research context extracted from a paper,
generate ONE clear, testable scientific hypothesis.

Return JSON only in this format:
{
  "hypothesis": "...",
  "rationale": "...",
  "falsification": "..."
}
"""

ASSUMPTION_PROMPT = """
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

FAILURE_PROMPT = """
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
# REQUEST SCHEMA
# =========================
class PipelineRequest(BaseModel):
    ingest_id: int


# =========================
# AUTO PIPELINE ENDPOINT
# =========================
@router.post("/from-ingest")
def run_auto_pipeline(
    request: PipelineRequest,
    db: Session = Depends(get_db)
):
    # -------------------------
    # 1. Fetch ingest chunks
    # -------------------------
    chunks: List[IngestChunk] = (
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
    context_text = context_text[:8000]  # LLM safety

    # -------------------------
    # 2. Generate hypothesis
    # -------------------------
    result = reason(HYPOTHESIS_PROMPT, context_text)

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
        context=f"Ingest #{request.ingest_id}",
        hypothesis=hypothesis_text,
        rationale=rationale,
        falsification=falsification
    )
    db.add(hypothesis)
    db.commit()
    db.refresh(hypothesis)

    # -------------------------
    # 3. Generate assumptions
    # -------------------------
    result = reason(ASSUMPTION_PROMPT, hypothesis.hypothesis)

    try:
        parsed = json.loads(result)
        assumptions_list = parsed.get("assumptions", [])
    except Exception:
        assumptions_list = []

    assumptions_saved: List[Assumption] = []

    for text in assumptions_list:
        a = Assumption(
            hypothesis_id=hypothesis.id,
            assumption=text
        )
        db.add(a)
        assumptions_saved.append(a)

    db.commit()
    for a in assumptions_saved:
        db.refresh(a)

    # -------------------------
    # 4. Generate failure modes
    # -------------------------
    result = reason(FAILURE_PROMPT, hypothesis.hypothesis)

    try:
        parsed = json.loads(result)
        failure_list = (
            parsed.get("failure_modes")
            or parsed.get("failures")
            or []
        )
    except Exception:
        failure_list = []

    failures_saved: List[FailureMode] = []

    for text in failure_list:
        f = FailureMode(
            hypothesis_id=hypothesis.id,
            failure=text
        )
        db.add(f)
        failures_saved.append(f)

    db.commit()
    for f in failures_saved:
        db.refresh(f)

    # -------------------------
    # 5. Unified response
    # -------------------------
    return {
        "ingest_id": request.ingest_id,
        "hypothesis": {
            "id": hypothesis.id,
            "hypothesis": hypothesis.hypothesis,
            "rationale": hypothesis.rationale,
            "falsification": hypothesis.falsification,
            "created_at": hypothesis.created_at,
        },
        "assumptions": [
            {
                "id": a.id,
                "assumption": a.assumption,
                "created_at": a.created_at,
            }
            for a in assumptions_saved
        ],
        "failure_modes": [
            {
                "id": f.id,
                "failure": f.failure,
                "created_at": f.created_at,
            }
            for f in failures_saved
        ],
    }
