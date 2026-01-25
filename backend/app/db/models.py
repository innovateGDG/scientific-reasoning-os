from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.database import Base


# =========================
# Hypothesis
# =========================
class Hypothesis(Base):
    __tablename__ = "hypotheses"

    id = Column(Integer, primary_key=True, index=True)
    context = Column(Text, nullable=False)
    hypothesis = Column(Text, nullable=False)
    rationale = Column(Text, nullable=False)
    falsification = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# =========================
# Assumption
# =========================
class Assumption(Base):
    __tablename__ = "assumptions"

    id = Column(Integer, primary_key=True, index=True)
    hypothesis_id = Column(Integer, ForeignKey("hypotheses.id"))
    assumption = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# =========================
# Failure Mode
# =========================
class FailureMode(Base):
    __tablename__ = "failure_modes"

    id = Column(Integer, primary_key=True, index=True)
    hypothesis_id = Column(Integer, ForeignKey("hypotheses.id"))
    failure = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# =========================
# Ingest (Paper / Text Entry)
# =========================
class Ingest(Base):
    __tablename__ = "ingests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    chunks = relationship(
        "IngestChunk",
        back_populates="ingest",
        cascade="all, delete-orphan"
    )


# =========================
# Ingest Chunks
# =========================
class IngestChunk(Base):
    __tablename__ = "ingest_chunks"

    id = Column(Integer, primary_key=True, index=True)
    ingest_id = Column(Integer, ForeignKey("ingests.id"))
    content = Column(Text, nullable=False)
    chunk_index = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

    ingest = relationship("Ingest", back_populates="chunks")
