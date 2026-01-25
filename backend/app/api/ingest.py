from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from app.db.database import get_db
from app.db.models import Ingest, IngestChunk

from app.services.parser import parse_pdf
from app.services.chunker import chunk_text
from app.services.embedding_service import embed_chunks
from app.services.vector_store import store_vectors

router = APIRouter()


# =========================
# Request / Response Schemas
# =========================
class IngestTextRequest(BaseModel):
    title: str
    text: str


class IngestResponse(BaseModel):
    ingest_id: int
    chunks_created: int


# =========================
# INGEST TEXT (Stage 1)
# =========================
@router.post("/text", response_model=IngestResponse)
def ingest_text(
    request: IngestTextRequest,
    db: Session = Depends(get_db)
):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    # 1. Create ingest record
    ingest = Ingest(title=request.title)
    db.add(ingest)
    db.commit()
    db.refresh(ingest)

    # 2. Chunk text
    chunks: List[str] = chunk_text(request.text)

    if not chunks:
        raise HTTPException(status_code=500, detail="Chunking failed")

    # 3. Persist chunks
    for idx, chunk in enumerate(chunks):
        db.add(
            IngestChunk(
                ingest_id=ingest.id,
                content=chunk,
                chunk_index=idx
            )
        )

    db.commit()

    return {
        "ingest_id": ingest.id,
        "chunks_created": len(chunks)
    }


# =========================
# INGEST PAPER (PDF)
# =========================
@router.post("/paper")
async def ingest_paper(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Ingest a research paper PDF:
    - Parse PDF
    - Chunk text
    - Store chunks in DB
    - Embed chunks
    - Store vectors
    """

    # 1. Parse PDF
    raw_text = parse_pdf(file)

    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Failed to extract text from PDF")

    # 2. Create ingest record
    ingest = Ingest(title=file.filename)
    db.add(ingest)
    db.commit()
    db.refresh(ingest)

    # 3. Chunk text
    chunks: List[str] = chunk_text(raw_text)

    if not chunks:
        raise HTTPException(status_code=500, detail="Chunking failed")

    # 4. Persist chunks
    for idx, chunk in enumerate(chunks):
        db.add(
            IngestChunk(
                ingest_id=ingest.id,
                content=chunk,
                chunk_index=idx
            )
        )

    db.commit()

    # 5. Embed + store vectors (existing pipeline)
    vectors = embed_chunks(chunks)
    store_vectors(chunks, vectors)

    return {
        "message": "Paper ingested successfully",
        "ingest_id": ingest.id,
        "chunks_created": len(chunks),
        "embedding_dim": len(vectors[0]) if vectors else 0
    }
