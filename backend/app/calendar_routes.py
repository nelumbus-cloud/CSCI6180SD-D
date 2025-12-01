from fastapi import APIRouter, Depends, HTTPException, Request, Query
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from models import User, Job
from auth import get_current_user
from calendar_service import (
    get_authorization_url,
    get_oauth_flow,
    save_credentials,
    sync_job_dates_to_calendar,
    get_calendar_service
)
import json
import os
from dotenv import load_dotenv

load_dotenv("../.env")
load_dotenv("../.env.local", override=True)

router = APIRouter(prefix="/api/calendar", tags=["calendar"])

GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/calendar/oauth2callback")

@router.get("/connect")
async def connect_calendar(
    user_id: Optional[str] = Query(None),  #for testing without auth
    db: Session = Depends(get_db),
    redirect: bool = Query(True),  #whether to redirect directly to google
    current_user: User = Depends(get_current_user)  #require authentication
):
    """initiate google calendar oauth connection
    
    requires authentication via login (cookie)
    """
    #get authenticated user
    user = current_user
    
    if not user:
        raise HTTPException(
            status_code=401, 
            detail="authentication required. please log in first"
        )
    
    authorization_url, state = get_authorization_url(user.id)
    
    #redirect directly to google if redirect=true (default)
    if redirect:
        return RedirectResponse(url=authorization_url)
    
    #otherwise return json with the url
    return {"authorization_url": authorization_url, "state": state}

@router.get("/oauth2callback")
async def oauth2callback(
    code: str = Query(...),
    state: str = Query(None),
    request: Request = None,
    db: Session = Depends(get_db)
):
    """handle oauth2 callback from google"""
    try:
        #parse state to get user_id
        if state:
            state_data = json.loads(state)
            user_id = state_data.get("user_id")
        else:
            #fallback: try to get from session or query param
            user_id = request.query_params.get("user_id") if request else None
        
        if not user_id:
            raise HTTPException(status_code=400, detail="missing user_id in state")
        
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="user not found")
        
        #exchange code for token
        flow = get_oauth_flow()
        #pass state to verify it matches
        flow.fetch_token(code=code, state=state if state else None)
        
        #save credentials
        save_credentials(user, flow.credentials, db)
        
        #redirect to frontend with success
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        return RedirectResponse(url=f"{frontend_url}/dashboard?calendar_connected=true")
    
    except Exception as e:
        print(f"oauth error: {e}")
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        return RedirectResponse(url=f"{frontend_url}/dashboard?calendar_error=true")

@router.get("/status")
async def calendar_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """check if user has connected google calendar"""
    service = get_calendar_service(current_user, db)
    return {
        "connected": service is not None,
        "has_token": current_user.google_calendar_token is not None
    }

@router.post("/sync/job/{job_id}")
async def sync_job_to_calendar(
    job_id: str,
    user_id: Optional[str] = Query(None),  #for testing without auth
    request: Request = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """sync a specific job's important dates to google calendar"""
    #get user from current_user (authenticated)
    user = current_user
    
    #if no authenticated user but user_id provided for testing
    if not user and user_id:
        user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="authentication required or provide user_id for testing")
    
    #check if user has connected google calendar
    if not user.google_calendar_token:
        raise HTTPException(
            status_code=401, 
            detail="Google Calendar not connected. Please connect your Google Calendar first."
        )
    
    #find job - only from this user's jobs
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == user.id,
    ).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="job not found")
    
    result = sync_job_dates_to_calendar(user, db, job)
    
    #check if any events were created
    if not result.get("events_created") or len(result.get("events_created", [])) == 0:
        raise HTTPException(
            status_code=400, 
            detail="No events were created. Ensure the job has at least one date set (interview, deadline, or follow-up date)."
        )
    
    return result

@router.post("/sync/all")
async def sync_all_jobs_to_calendar(
    user_id: Optional[str] = Query(None),  #for testing without auth
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """sync all jobs' important dates to google calendar"""
    #get user from current_user (authenticated)
    user = current_user
    
    #if no authenticated user but user_id provided for testing
    if not user and user_id:
        user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="authentication required or provide user_id for testing")
    
    #check if user has connected google calendar
    if not user.google_calendar_token:
        raise HTTPException(
            status_code=401, 
            detail="Google Calendar not connected. Please connect your Google Calendar first."
        )
    
    #get jobs - only this user's jobs
    jobs = db.query(Job).filter(Job.user_id == user.id).all()
    
    all_results = []
    for job in jobs:
        result = sync_job_dates_to_calendar(user, db, job)
        all_results.append({
            "job_id": job.id,
            "job_title": job.title,
            "company": job.company,
            "result": result
        })
    
    total_events = sum(r["result"].get("count", 0) for r in all_results)
    return {
        "jobs_processed": len(all_results),
        "total_events_created": total_events,
        "results": all_results
    }

@router.delete("/disconnect")
async def disconnect_calendar(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """disconnect google calendar"""
    current_user.google_calendar_token = None
    db.commit()
    return {"message": "calendar disconnected successfully"}

