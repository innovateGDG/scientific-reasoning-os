from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, String, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.database import Base


# =========================
# User (AUTH FOUNDATION)
# =========================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="Researcher")  # Student | Researcher | Engineer | Scientist
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("UserProfile", back_populates="user", uselist=False)
    projects = relationship("Project", back_populates="owner")


# =========================
# User Profile
# =========================
class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    research_domain = Column(String)
    experience_level = Column(String)
    research_purpose = Column(String)
    preferred_methods = Column(String)
    confidentiality_level = Column(String)

    user = relationship("User", back_populates="profile")


# =========================
# Project (CORE WORKSPACE)
# =========================
class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="projects")


# =========================
# Hypothesis
# =========================
class Hypothesis(Base):
    __tablename__ = "hypotheses"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)  # SAFE ADD
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
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)  # SAFE ADD
    assumption = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# =========================
# Failure Mode
# =========================
class FailureMode(Base):
    __tablename__ = "failure_modes"

    id = Column(Integer, primary_key=True, index=True)
    hypothesis_id = Column(Integer, ForeignKey("hypotheses.id"))
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)  # SAFE ADD
    failure = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# =========================
# Ingest (Paper / Text Entry)
# =========================
class Ingest(Base):
    __tablename__ = "ingests"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)  # SAFE ADD
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
