# from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, Text
# from sqlalchemy.orm import declarative_base, relationship
# from datetime import datetime

# Base = declarative_base()

# class User(Base):
#     __tablename__ = 'users'
#     id = Column(Integer, primary_key=True, index=True)
#     email = Column(String, unique=True, index=True, nullable=False)
#     password_hash = Column(String, nullable=False)
#     name = Column(String, nullable=False)
#     created_at = Column(DateTime, default=datetime.utcnow)

#     job_applications = relationship('JobApplication', back_populates='user')
#     resumes = relationship('Resume', back_populates='user')

# class JobApplication(Base):
#     __tablename__ = 'job_applications'
#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
#     job_title = Column(String, nullable=False)
#     company_name = Column(String, nullable=False)
#     location = Column(String)
#     salary_min = Column(Float)
#     salary_max = Column(Float)
#     salary_currency = Column(String, default='USD')
#     employment_type = Column(String)  # e.g., Full Time, Part Time
#     remote = Column(Boolean, default=False)
#     status = Column(String, default='Applied')  # e.g., Applied, In Progress, Interview, Offer, Rejected
#     applied_date = Column(DateTime)
#     interview_date = Column(DateTime)
#     notes = Column(Text)
#     created_at = Column(DateTime, default=datetime.utcnow)

#     user = relationship('User', back_populates='job_applications')

# class Resume(Base):
#     __tablename__ = 'resumes'
#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
#     title = Column(String, nullable=False)
#     content = Column(Text)  # Could be JSON or plain text
#     created_at = Column(DateTime, default=datetime.utcnow)

#     user = relationship('User', back_populates='resumes')

# class FeedItem(Base):
#     __tablename__ = 'feed_items'
#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String, nullable=False)
#     content = Column(Text)
#     url = Column(String)
#     published_at = Column(DateTime, default=datetime.utcnow)


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
    role = Column(String(20), nullable=False)  # e.g., "admin", "unsubscribeduser", "subscribeduser", "newuser", "freeuser"
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