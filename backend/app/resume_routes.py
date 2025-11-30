from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from database import get_db
from models import Resume, User
from auth import get_current_user
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
import json

router = APIRouter(prefix="/api/resume", tags=["resume"])

# Pydantic models for request/response
class PersonalInfo(BaseModel):
    fullName: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    linkedin: str = ""
    portfolio: str = ""
    summary: str = ""

class ExperienceItem(BaseModel):
    id: Optional[int] = None
    company: str = ""
    position: str = ""
    startDate: str = ""
    endDate: str = ""
    current: bool = False
    description: str = ""

class EducationItem(BaseModel):
    id: Optional[int] = None
    school: str = ""
    degree: str = ""
    field: str = ""
    startDate: str = ""
    endDate: str = ""
    gpa: str = ""

class SkillItem(BaseModel):
    id: Optional[int] = None
    name: str = ""
    level: str = "intermediate"

class ProjectItem(BaseModel):
    id: Optional[int] = None
    name: str = ""
    description: str = ""
    technologies: str = ""
    link: str = ""

class ResumeData(BaseModel):
    personal: PersonalInfo
    experience: List[ExperienceItem] = []
    education: List[EducationItem] = []
    skills: List[SkillItem] = []
    projects: List[ProjectItem] = []

class ResumeResponse(BaseModel):
    id: str
    personal: PersonalInfo
    experience: List[ExperienceItem]
    education: List[EducationItem]
    skills: List[SkillItem]
    projects: List[ProjectItem]
    created_at: str
    updated_at: str

# Helper functions to convert between JSON and objects
def resume_to_dict(resume: Resume) -> Dict[str, Any]:
    """Convert Resume database model to dictionary"""
    return {
        "id": resume.id,
        "personal": json.loads(resume.personal_info) if resume.personal_info else PersonalInfo().dict(),
        "experience": json.loads(resume.experience) if resume.experience else [],
        "education": json.loads(resume.education) if resume.education else [],
        "skills": json.loads(resume.skills) if resume.skills else [],
        "projects": json.loads(resume.projects) if resume.projects else [],
        "created_at": resume.created_at.isoformat() if resume.created_at else "",
        "updated_at": resume.updated_at.isoformat() if resume.updated_at else "",
    }


@router.get("/", response_model=ResumeResponse)
async def get_resume(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get the current user's resume"""
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    
    if not resume:
        # Return empty resume structure
        return ResumeResponse(
            id="",
            personal=PersonalInfo(),
            experience=[],
            education=[],
            skills=[],
            projects=[],
            created_at="",
            updated_at=""
        )
    
    return resume_to_dict(resume)


@router.post("/", response_model=ResumeResponse)
async def create_or_update_resume(
    resume_data: ResumeData,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create or update the current user's resume"""
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    
    if resume:
        # Update existing resume
        resume.personal_info = json.dumps(resume_data.personal.dict())
        resume.experience = json.dumps([exp.dict() for exp in resume_data.experience])
        resume.education = json.dumps([edu.dict() for edu in resume_data.education])
        resume.skills = json.dumps([skill.dict() for skill in resume_data.skills])
        resume.projects = json.dumps([proj.dict() for proj in resume_data.projects])
        resume.updated_at = datetime.utcnow()
    else:
        # Create new resume
        resume = Resume(
            user_id=current_user.id,
            personal_info=json.dumps(resume_data.personal.dict()),
            experience=json.dumps([exp.dict() for exp in resume_data.experience]),
            education=json.dumps([edu.dict() for edu in resume_data.education]),
            skills=json.dumps([skill.dict() for skill in resume_data.skills]),
            projects=json.dumps([proj.dict() for proj in resume_data.projects])
        )
        db.add(resume)
    
    db.commit()
    db.refresh(resume)
    
    return resume_to_dict(resume)

@router.put("/personal", response_model=ResumeResponse)
async def update_personal_info(
    personal: PersonalInfo,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update personal information section"""
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    
    if not resume:
        # Create new resume with just personal info
        resume = Resume(
            user_id=current_user.id,
            personal_info=json.dumps(personal.dict()),
            experience=json.dumps([]),
            education=json.dumps([]),
            skills=json.dumps([]),
            projects=json.dumps([])
        )
        db.add(resume)
    else:
        resume.personal_info = json.dumps(personal.dict())
        resume.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(resume)
    
    return resume_to_dict(resume)

@router.put("/experience", response_model=ResumeResponse)
async def update_experience(
    experience: List[ExperienceItem],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update experience section"""
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    
    if not resume:
        # Create new resume
        resume = Resume(
            user_id=current_user.id,
            personal_info=json.dumps(PersonalInfo().dict()),
            experience=json.dumps([exp.dict() for exp in experience]),
            education=json.dumps([]),
            skills=json.dumps([]),
            projects=json.dumps([])
        )
        db.add(resume)
    else:
        resume.experience = json.dumps([exp.dict() for exp in experience])
        resume.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(resume)
    
    return resume_to_dict(resume)

@router.put("/education", response_model=ResumeResponse)
async def update_education(
    education: List[EducationItem],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update education section"""
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    
    if not resume:
        resume = Resume(
            user_id=current_user.id,
            personal_info=json.dumps(PersonalInfo().dict()),
            experience=json.dumps([]),
            education=json.dumps([edu.dict() for edu in education]),
            skills=json.dumps([]),
            projects=json.dumps([])
        )
        db.add(resume)
    else:
        resume.education = json.dumps([edu.dict() for edu in education])
        resume.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(resume)
    
    return resume_to_dict(resume)

@router.put("/skills", response_model=ResumeResponse)
async def update_skills(
    skills: List[SkillItem],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update skills section"""
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    
    if not resume:
        resume = Resume(
            user_id=current_user.id,
            personal_info=json.dumps(PersonalInfo().dict()),
            experience=json.dumps([]),
            education=json.dumps([]),
            skills=json.dumps([skill.dict() for skill in skills]),
            projects=json.dumps([])
        )
        db.add(resume)
    else:
        resume.skills = json.dumps([skill.dict() for skill in skills])
        resume.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(resume)
    
    return resume_to_dict(resume)

@router.put("/projects", response_model=ResumeResponse)
async def update_projects(
    projects: List[ProjectItem],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update projects section"""
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    
    if not resume:
        resume = Resume(
            user_id=current_user.id,
            personal_info=json.dumps(PersonalInfo().dict()),
            experience=json.dumps([]),
            education=json.dumps([]),
            skills=json.dumps([]),
            projects=json.dumps([proj.dict() for proj in projects])
        )
        db.add(resume)
    else:
        resume.projects = json.dumps([proj.dict() for proj in projects])
        resume.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(resume)
    
    return resume_to_dict(resume)

@router.delete("/")
async def delete_resume(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete the current user's resume"""
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    db.delete(resume)
    db.commit()
    
    return {"message": "Resume deleted successfully"}

