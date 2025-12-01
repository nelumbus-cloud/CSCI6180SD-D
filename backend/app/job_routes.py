from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from database import get_db
from models import Job, User
from auth import get_current_user
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import json
import logging

logger = logging.getLogger(__name__)

#router instance
router = APIRouter(prefix="/api/jobs", tags=["jobs"])

# pydantic models for requests and responses
class JobCreate(BaseModel):
    """ schema for new job records """
    title: str
    company: str
    location: Optional[str] = None
    work_location: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = "In Progress"
    salary: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[List[str]] = []
    interview_date: Optional[datetime] = None
    follow_up_date: Optional[datetime] = None
    application_deadline: Optional[datetime] = None
    offer_deadline: Optional[datetime] = None

class JobUpdate(BaseModel):
    """" schema for updating job records """
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    work_location: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None
    salary: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[List[str]] = None
    interview_date: Optional[datetime] = None
    follow_up_date: Optional[datetime] = None
    application_deadline: Optional[datetime] = None
    offer_deadline: Optional[datetime] = None

class JobResponse(BaseModel):
    """ schema for returning job data """
    id: str
    title: str
    company: str
    location: Optional[str]
    work_location: Optional[str]
    type: Optional[str]
    status: str
    salary: Optional[str]
    description: Optional[str]
    requirements: List[str]
    interview_date: Optional[str] = None
    follow_up_date: Optional[str] = None
    application_deadline: Optional[str] = None
    offer_deadline: Optional[str] = None
    created_at: str
    updated_at: str

    # allow ORM object conversion
    class Config:
        from_attributes = True

    # convert ORM object cleanly
    @classmethod
    def from_orm(cls, obj):
        data = {
            'id': obj.id,
            'title': obj.title,
            'company': obj.company,
            'location': obj.location,
            'work_location': obj.work_location,
            'type': obj.type,
            'status': obj.status,
            'salary': obj.salary,
            'description': obj.description,
            'requirements': obj.requirements if isinstance(obj.requirements, list) else [],
            'interview_date': obj.interview_date.isoformat() if obj.interview_date else None,
            'follow_up_date': obj.follow_up_date.isoformat() if obj.follow_up_date else None,
            'application_deadline': obj.application_deadline.isoformat() if obj.application_deadline else None,
            'offer_deadline': obj.offer_deadline.isoformat() if obj.offer_deadline else None,
            'created_at': obj.created_at.isoformat() if obj.created_at else '',
            'updated_at': obj.updated_at.isoformat() if obj.updated_at else ''
        }
        return cls(**data)

"""Job CRUD routes scoped to the authenticated user."""

#getting all jobs
@router.get("/", response_model=List[JobResponse])
def get_jobs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    jobs = (
        db.query(Job)
        .filter(Job.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    result = []
    for job in jobs:
        requirements = []
        if job.requirements:
            try:
                requirements = json.loads(job.requirements)
            except:
                requirements = []
        
        result.append(JobResponse(
            id=job.id,
            title=job.title,
            company=job.company,
            location=job.location,
            work_location=job.work_location,
            type=job.type,
            status=job.status,
            salary=job.salary,
            description=job.description,
            requirements=requirements,
            interview_date=job.interview_date.isoformat() if job.interview_date else None,
            follow_up_date=job.follow_up_date.isoformat() if job.follow_up_date else None,
            application_deadline=job.application_deadline.isoformat() if job.application_deadline else None,
            offer_deadline=job.offer_deadline.isoformat() if job.offer_deadline else None,
            created_at=job.created_at.isoformat() if job.created_at else '',
            updated_at=job.updated_at.isoformat() if job.updated_at else ''
        ))
    
    return result

#creating new jobs
@router.post("/", response_model=JobResponse)
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    #convert requirements list to JSON string
    requirements_json = json.dumps(job.requirements) if job.requirements else "[]"
    
    db_job = Job(
        user_id=current_user.id,
        title=job.title,
        company=job.company,
        location=job.location,
        work_location=job.work_location,
        type=job.type,
        status=job.status,
        salary=job.salary,
        description=job.description,
        requirements=requirements_json,
        interview_date=job.interview_date,
        follow_up_date=job.follow_up_date,
        application_deadline=job.application_deadline,
        offer_deadline=job.offer_deadline
    )
    
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    
    #convert to response format
    return JobResponse(
        id=db_job.id,
        title=db_job.title,
        company=db_job.company,
        location=db_job.location,
        work_location=db_job.work_location,
        type=db_job.type,
        status=db_job.status,
        salary=db_job.salary,
        description=db_job.description,
        requirements=job.requirements or [],
        interview_date=db_job.interview_date.isoformat() if db_job.interview_date else None,
        follow_up_date=db_job.follow_up_date.isoformat() if db_job.follow_up_date else None,
        application_deadline=db_job.application_deadline.isoformat() if db_job.application_deadline else None,
        offer_deadline=db_job.offer_deadline.isoformat() if db_job.offer_deadline else None,
        created_at=db_job.created_at.isoformat() if db_job.created_at else '',
        updated_at=db_job.updated_at.isoformat() if db_job.updated_at else ''
    )

#get specific job
@router.get("/{job_id}", response_model=JobResponse)
def get_job(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = (
        db.query(Job)
        .filter(Job.id == job_id, Job.user_id == current_user.id)
        .first()
    )
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    #convert requirements from JSON string to list
    requirements = []
    if job.requirements:
        try:
            requirements = json.loads(job.requirements)
        except:
            requirements = []
    
    return JobResponse(
        id=job.id,
        title=job.title,
        company=job.company,
        location=job.location,
        work_location=job.work_location,
        type=job.type,
        status=job.status,
        salary=job.salary,
        description=job.description,
        requirements=requirements,
        interview_date=job.interview_date.isoformat() if job.interview_date else None,
        follow_up_date=job.follow_up_date.isoformat() if job.follow_up_date else None,
        application_deadline=job.application_deadline.isoformat() if job.application_deadline else None,
        offer_deadline=job.offer_deadline.isoformat() if job.offer_deadline else None,
        created_at=job.created_at.isoformat() if job.created_at else '',
        updated_at=job.updated_at.isoformat() if job.updated_at else ''
    )

#update specific job
@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: str,
    job_update: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = (
        db.query(Job)
        .filter(Job.id == job_id, Job.user_id == current_user.id)
        .first()
    )
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    #update provided fields
    update_data = job_update.dict(exclude_unset=True)

    # Handle requirements conversion to JSON
    if "requirements" in update_data:
        requirements_json = json.dumps(update_data["requirements"]) if update_data["requirements"] else "[]"
        update_data["requirements"] = requirements_json
    
    for field, value in update_data.items():
        setattr(job, field, value)
    
    db.commit()
    db.refresh(job)
    
    # Parse requirements from JSON for response
    requirements = []
    if job.requirements:
        try:
            requirements = json.loads(job.requirements)
        except:
            requirements = []
    
    # Return properly formatted response
    return JobResponse(
        id=job.id,
        title=job.title,
        company=job.company,
        location=job.location,
        work_location=job.work_location,
        type=job.type,
        status=job.status,
        salary=job.salary,
        description=job.description,
        requirements=requirements,
        interview_date=job.interview_date.isoformat() if job.interview_date else None,
        follow_up_date=job.follow_up_date.isoformat() if job.follow_up_date else None,
        application_deadline=job.application_deadline.isoformat() if job.application_deadline else None,
        offer_deadline=job.offer_deadline.isoformat() if job.offer_deadline else None,
        created_at=job.created_at.isoformat() if job.created_at else '',
        updated_at=job.updated_at.isoformat() if job.updated_at else ''
    )

#delete a specific job
@router.delete("/{job_id}")
def delete_job(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = (
        db.query(Job)
        .filter(Job.id == job_id, Job.user_id == current_user.id)
        .first()
    )
    if not job:
        raise HTTPException(status_code=404, detail="job not found")
    
    db.delete(job)
    db.commit()
    
    return {"message": "job deleted successfully"}

# Get upcoming interviews (multiple)
@router.get("/dashboard/upcoming-interviews", response_model=List[JobResponse])
def get_upcoming_interviews(
    limit: int = Query(10, ge=1, le=20),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all upcoming interviews (jobs with interview_date in the future), sorted by date"""
    current_time = datetime.utcnow()
    
    upcoming_jobs = (
        db.query(Job)
        .filter(
            and_(
                Job.user_id == current_user.id,
                Job.interview_date.isnot(None),
                Job.interview_date > current_time,
            )
        )
        .order_by(Job.interview_date)
        .limit(limit)
        .all()
    )
    
    return [JobResponse.from_orm(job) for job in upcoming_jobs]

# Keep old endpoint for backward compatibility
@router.get("/dashboard/upcoming-interview", response_model=Optional[JobResponse])
def get_upcoming_interview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get the next upcoming interview (job with the earliest interview_date in the future)"""
    current_time = datetime.utcnow()
    
    upcoming_job = (
        db.query(Job)
        .filter(
            and_(
                Job.user_id == current_user.id,
                Job.interview_date.isnot(None),
                Job.interview_date > current_time,
            )
        )
        .order_by(Job.interview_date)
        .first()
    )
    
    if not upcoming_job:
        return None
    
    return JobResponse.from_orm(upcoming_job)

# Get suggested job match
@router.get("/dashboard/suggested-match", response_model=Optional[JobResponse])
def get_suggested_job_match(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a suggested job match (e.g., a job in 'In Progress' status, or the most recent one)"""
    # Strategy: Find a job in "In Progress" status that might be a good match
    suggested_job = (
        db.query(Job)
        .filter(
            and_(
                Job.user_id == current_user.id,
                Job.status.in_(["In Progress", "Applied"]),
            )
        )
        .order_by(Job.created_at.desc())
        .first()
    )
    
    if not suggested_job:
        # Fallback: return the most recent job
        suggested_job = (
            db.query(Job)
            .filter(Job.user_id == current_user.id)
            .order_by(Job.created_at.desc())
            .first()
        )
    
    if not suggested_job:
        return None
    
    return JobResponse.from_orm(suggested_job)
