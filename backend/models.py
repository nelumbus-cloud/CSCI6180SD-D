from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    job_applications = relationship('JobApplication', back_populates='user')
    resumes = relationship('Resume', back_populates='user')

class JobApplication(Base):
    __tablename__ = 'job_applications'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    job_title = Column(String, nullable=False)
    company_name = Column(String, nullable=False)
    location = Column(String)
    salary_min = Column(Float)
    salary_max = Column(Float)
    salary_currency = Column(String, default='USD')
    employment_type = Column(String)  # e.g., Full Time, Part Time
    remote = Column(Boolean, default=False)
    status = Column(String, default='Applied')  # e.g., Applied, In Progress, Interview, Offer, Rejected
    applied_date = Column(DateTime)
    interview_date = Column(DateTime)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship('User', back_populates='job_applications')

class Resume(Base):
    __tablename__ = 'resumes'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text)  # Could be JSON or plain text
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship('User', back_populates='resumes')

class FeedItem(Base):
    __tablename__ = 'feed_items'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text)
    url = Column(String)
    published_at = Column(DateTime, default=datetime.utcnow)
