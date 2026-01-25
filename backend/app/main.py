from fastapi import FastAPI

from app.api import ingest, hypothesis, assumptions, failure, pipeline

app = FastAPI(
    title="Scientific Reasoning OS",
    description="Backend for hypothesis generation, assumption extraction, failure analysis, and paper ingestion",
    version="0.1.0"
)

# =========================
# Register API Routers
# =========================
app.include_router(
    ingest.router,
    prefix="/ingest",
    tags=["Ingestion"]
)

app.include_router(
    hypothesis.router,
    prefix="/hypothesis",
    tags=["Hypothesis"]
)

app.include_router(
    assumptions.router,
    prefix="/assumptions",
    tags=["Assumptions"]
)

app.include_router(
    failure.router,
    prefix="/failure",
    tags=["Failure Intelligence"]
)

# 🔥 NEW: Auto Pipeline Router
app.include_router(
    pipeline.router,
    prefix="/pipeline",
    tags=["Auto Pipeline"]
)


# =========================
# Health Check
# =========================
@app.get("/")
def root():
    return {
        "status": "Backend running successfully",
        "service": "Scientific Reasoning OS"
    }
