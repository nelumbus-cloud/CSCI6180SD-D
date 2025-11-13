from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import get_db
from .models import Job, User
from pydantic import BaseModel
from typing import List, Optional
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
            'created_at': obj.created_at.isoformat() if obj.created_at else '',
            'updated_at': obj.updated_at.isoformat() if obj.updated_at else ''
        }
        return cls(**data)

# default user
DEFAULT_USER_ID = "default-user-id"

#getting all jobs
@router.get("/", response_model=List[JobResponse])
def get_jobs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    jobs = db.query(Job).filter(Job.user_id == DEFAULT_USER_ID).offset(skip).limit(limit).all()
    
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
            created_at=job.created_at.isoformat() if job.created_at else '',
            updated_at=job.updated_at.isoformat() if job.updated_at else ''
        ))
    
    return result

#creating new jobs
@router.post("/", response_model=JobResponse)
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    #convert requirements list to JSON string
    requirements_json = json.dumps(job.requirements) if job.requirements else "[]"
    
    db_job = Job(
        user_id=DEFAULT_USER_ID,
        title=job.title,
        company=job.company,
        location=job.location,
        work_location=job.work_location,
        type=job.type,
        status=job.status,
        salary=job.salary,
        description=job.description,
        requirements=requirements_json
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
        created_at=db_job.created_at.isoformat() if db_job.created_at else '',
        updated_at=db_job.updated_at.isoformat() if db_job.updated_at else ''
    )

#get specific job
@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: str, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id, Job.user_id == DEFAULT_USER_ID).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    #convert requirements from JSON string to list
    if job.requirements:
        try:
            job.requirements = json.loads(job.requirements)
        except:
            job.requirements = []
    else:
        job.requirements = []
    
    return job

#update specific job
@router.put("/{job_id}", response_model=JobResponse)
def update_job(job_id: str, job_update: JobUpdate, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id, Job.user_id == DEFAULT_USER_ID).first()
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
        created_at=job.created_at.isoformat() if job.created_at else '',
        updated_at=job.updated_at.isoformat() if job.updated_at else ''
    )

#delete a specific job
@router.delete("/{job_id}")
def delete_job(job_id: str, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id, Job.user_id == DEFAULT_USER_ID).first()
    if not job:
        raise HTTPException(status_code=404, detail="job not found")
    
    db.delete(job)
    db.commit()
    
    return {"message": "job deleted successfully"}
