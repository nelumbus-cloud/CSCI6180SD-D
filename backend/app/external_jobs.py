from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional, List
from sqlalchemy.orm import Session
from database import get_db
from models import Job, User
from auth import get_current_user
import httpx
import random

router = APIRouter(prefix="/api/external/jobs", tags=["External Jobs"])

REMOTIVE_BASE = "https://remotive.com/api/remote-jobs"
REQUEST_TIMEOUT = 60.0  # Increased timeout to 60 seconds

@router.get("/suggested-matches")
async def get_suggested_job_matches(
    limit: int = Query(5, ge=1, le=10),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get multiple suggested jobs from external API based on user's saved jobs.
    Analyzes user's saved job titles to find similar external jobs.
    """
    # Get this user's saved jobs to understand their preferences
    user_jobs = db.query(Job).filter(Job.user_id == current_user.id).all()
    
    # Extract keywords from user's saved job titles
    search_keywords = []
    for job in user_jobs:
        if job.title:
            # Extract meaningful words from job titles
            words = job.title.lower().split()
            for word in words:
                # Filter common words, keep role-related keywords
                if len(word) > 3 and word not in ['senior', 'junior', 'lead', 'staff', 'principal', 'the', 'and', 'for', 'with']:
                    search_keywords.append(word)
    
    # Remove duplicates and get top keywords
    search_keywords = list(set(search_keywords))[:5]
    
    # If no keywords found, use some common tech job searches
    if not search_keywords:
        search_keywords = ['software', 'developer', 'engineer']
    
    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            # Try to find jobs matching user's preferences
            all_matching_jobs = []
            
            for keyword in search_keywords[:3]:  # Limit to 3 searches to avoid too many API calls
                params = {"search": keyword}
                resp = await client.get(REMOTIVE_BASE, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    jobs = data.get("jobs", [])
                    all_matching_jobs.extend(jobs[:10])  # Get top 10 from each search
            
            # Remove duplicates based on job id
            seen_ids = set()
            unique_jobs = []
            for job in all_matching_jobs:
                if job.get("id") not in seen_ids:
                    seen_ids.add(job.get("id"))
                    unique_jobs.append(job)
            
            if unique_jobs:
                # Shuffle and return multiple jobs
                random.shuffle(unique_jobs)
                selected_jobs = unique_jobs[:limit]
                
                return [
                    {
                        "id": job.get("id"),
                        "title": job.get("title"),
                        "company": job.get("company_name"),
                        "location": job.get("candidate_required_location"),
                        "type": job.get("job_type"),
                        "salary": job.get("salary") or "Not specified",
                        "description": job.get("description", "")[:300] + "..." if job.get("description") and len(job.get("description", "")) > 300 else job.get("description", ""),
                        "url": job.get("url"),
                        "publication_date": job.get("publication_date"),
                        "tags": job.get("tags", [])[:5],
                        "source": "remotive",
                        "match_reason": f"Based on your interest in {', '.join(search_keywords[:3])}"
                    }
                    for job in selected_jobs
                ]
            
            return []
            
    except httpx.ReadTimeout:
        raise HTTPException(status_code=504, detail="External job service timed out. Please try again.")
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Failed to connect to job service: {str(e)}")

# Keep old endpoint for backward compatibility
@router.get("/suggested-match")
async def get_suggested_job_match(db: Session = Depends(get_db)):
    """Get a single suggested job (backward compatibility)"""
    results = await get_suggested_job_matches(limit=1, db=db)
    return results[0] if results else None

@router.get("/")
async def list_jobs(
    search: Optional[str] = Query(None, description="Keyword to search for (title, skills)"),
    location: Optional[str] = Query(None, description="Filter by location"),
    company_name: Optional[str] = Query(None, description="Filter by company name"),
    limit: int = Query(20, ge=1, le=100)
):
    params = {}
    if search:
        params["search"] = search
    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            resp = await client.get(REMOTIVE_BASE, params=params)
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail="Failed to fetch jobs from Remotive")
            data = resp.json()
            jobs = data.get("jobs", [])
            # Optional in-process filtering
            if location:
                jobs = [j for j in jobs if j.get("candidate_required_location") and location.lower() in j.get("candidate_required_location").lower()]
            if company_name:
                jobs = [j for j in jobs if j.get("company_name") and company_name.lower() in j.get("company_name").lower()]
            return jobs[:limit]
    except httpx.ReadTimeout:
        raise HTTPException(status_code=504, detail="External job service timed out. Please try again.")
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Failed to connect to job service: {str(e)}")

@router.get("/{job_id}")
async def get_job_detail(job_id: int):
    # Remotive doesn't provide single-job endpoint by id; fetch list and filter
    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            resp = await client.get(REMOTIVE_BASE)
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail="Failed to fetch jobs from Remotive")
            data = resp.json()
            for job in data.get("jobs", []):
                if job.get("id") == job_id:
                    return job
    except httpx.ReadTimeout:
        raise HTTPException(status_code=504, detail="External job service timed out. Please try again.")
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Failed to connect to job service: {str(e)}")
    raise HTTPException(status_code=404, detail="Job not found")
