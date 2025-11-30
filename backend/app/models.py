from sqlalchemy import Column, Integer, Text, String, ForeignKey, Enum, DateTime, Float, Date, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import json
import enum
from datetime import datetime
import uuid


Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(50), unique=True, nullable=False)
    contact_email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(100), nullable=True)
    role = Column(String(20), nullable=False) 
    is_active = Column(Boolean, default=True)
    reset_token = Column(String, nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)
    #google calendar integration
    google_calendar_token = Column(Text, nullable=True)  #stores serialized token
    created_at = Column(DateTime, default=datetime.utcnow)

class Job(Base):
    __tablename__ = 'jobs'
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id'), nullable=False)
    title = Column(String(200), nullable=False)
    company = Column(String(200), nullable=False)
    location = Column(String(200))
    work_location = Column(String(100))
    type = Column(String(50))
    status = Column(String(50), default='In Progress')
    salary = Column(String(100))
    description = Column(Text)
    requirements = Column(Text)
    #dates for calendar integration
    interview_date = Column(DateTime, nullable=True)
    follow_up_date = Column(DateTime, nullable=True)
    application_deadline = Column(DateTime, nullable=True)
    offer_deadline = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship('User')

class Resume(Base):
    __tablename__ = 'resumes'
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id'), nullable=False)
    # Store all resume data as JSON
    personal_info = Column(Text)  # JSON: {fullName, email, phone, location, linkedin, portfolio, summary}
    experience = Column(Text)  # JSON array: [{id, company, position, startDate, endDate, current, description}]
    education = Column(Text)  # JSON array: [{id, school, degree, field, startDate, endDate, gpa}]
    skills = Column(Text)  # JSON array: [{id, name, level}]
    projects = Column(Text)  # JSON array: [{id, name, description, technologies, link}]
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship('User')