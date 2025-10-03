from fastapi import FastAPI, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import SessionLocal, init_db
from models import JobApplication, User
from pydantic import BaseModel, Field
from datetime import datetime

from routers.external_jobs import router as external_jobs_router

app = FastAPI()

init_db()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Schemas
class JobApplicationBase(BaseModel):
    job_title: str
    company_name: str
    location: Optional[str] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    salary_currency: Optional[str] = "USD"
    employment_type: Optional[str] = None
    remote: Optional[bool] = False
    status: Optional[str] = "Applied"
    applied_date: Optional[datetime] = None
    interview_date: Optional[datetime] = None
    notes: Optional[str] = None

class JobApplicationCreate(JobApplicationBase):
    pass

class JobApplicationUpdate(JobApplicationBase):
    pass

class JobApplicationOut(JobApplicationBase):
    id: int
    user_id: int
    created_at: datetime
    class Config:
        orm_mode = True

# Simulate current user (user_id=1)
def get_current_user_id():
    return 1

@app.get("/jobs/", response_model=List[JobApplicationOut])
def list_jobs(
    skip: int = 0,
    limit: int = Query(20, le=100),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    jobs = db.query(JobApplication).filter(JobApplication.user_id == user_id).order_by(JobApplication.created_at.desc()).offset(skip).limit(limit).all()
    return jobs

@app.post("/jobs/", response_model=JobApplicationOut)
def create_job(
    job: JobApplicationCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    db_job = JobApplication(**job.dict(), user_id=user_id)
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@app.get("/jobs/{job_id}", response_model=JobApplicationOut)
def get_job(job_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    job = db.query(JobApplication).filter(JobApplication.id == job_id, JobApplication.user_id == user_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@app.put("/jobs/{job_id}", response_model=JobApplicationOut)
def update_job(job_id: int, job_update: JobApplicationUpdate, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    job = db.query(JobApplication).filter(JobApplication.id == job_id, JobApplication.user_id == user_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    for key, value in job_update.dict(exclude_unset=True).items():
        setattr(job, key, value)
    db.commit()
    db.refresh(job)
    return job

@app.delete("/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    job = db.query(JobApplication).filter(JobApplication.id == job_id, JobApplication.user_id == user_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()
    return {"ok": True}

# Register external jobs router
app.include_router(external_jobs_router)
