from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import httpx

router = APIRouter(prefix="/external/jobs", tags=["External Jobs"])

REMOTIVE_BASE = "https://remotive.com/api/remote-jobs"

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
    async with httpx.AsyncClient(timeout=20.0) as client:
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

@router.get("/{job_id}")
async def get_job_detail(job_id: int):
    # Remotive doesn't provide single-job endpoint by id; fetch list and filter
    async with httpx.AsyncClient(timeout=20.0) as client:
        resp = await client.get(REMOTIVE_BASE)
        if resp.status_code != 200:
            raise HTTPException(status_code=resp.status_code, detail="Failed to fetch jobs from Remotive")
        data = resp.json()
        for job in data.get("jobs", []):
            if job.get("id") == job_id:
                return job
    raise HTTPException(status_code=404, detail="Job not found")
