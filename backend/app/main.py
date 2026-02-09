from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# --- Core Routers (direct imports, NO circular imports) ---
from app.api.ingest import router as ingest_router
from app.api.hypothesis import router as hypothesis_router
from app.api.assumptions import router as assumptions_router
from app.api.failure import router as failure_router
from app.api.pipeline import router as pipeline_router

from app.api.auth import router as auth_router
from app.api.profile import router as profile_router
from app.api.projects import router as projects_router


app = FastAPI(
    title="Scientific Reasoning OS",
    description="Backend for hypothesis generation, assumption extraction, failure analysis, and paper ingestion",
    version="0.1.0"
)

# =========================
# CORS Middleware
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5177",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Register API Routers
# =========================

# 🔐 Auth
app.include_router(
    auth_router,
    tags=["Auth"]
)

# 👤 User Profile
app.include_router(
    profile_router,
    tags=["User Profile"]
)

# 📁 Projects
app.include_router(
    projects_router,
    tags=["Projects"]
)

# 📥 Ingestion
app.include_router(
    ingest_router,
    prefix="/ingest",
    tags=["Ingestion"]
)

# 🧠 Hypothesis
app.include_router(
    hypothesis_router,
    prefix="/hypothesis",
    tags=["Hypothesis"]
)

# 🧩 Assumptions
app.include_router(
    assumptions_router,
    prefix="/assumptions",
    tags=["Assumptions"]
)

# ⚠️ Failure Intelligence
app.include_router(
    failure_router,
    prefix="/failure",
    tags=["Failure Intelligence"]
)

# 🔥 Auto Pipeline
app.include_router(
    pipeline_router,
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