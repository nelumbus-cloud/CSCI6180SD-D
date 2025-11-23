from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from gemini_service import parse_job_description

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

class ParseJobRequest(BaseModel):
    """Request model for parsing unstructured job description"""
    text: str

class ParseJobResponse(BaseModel):
    """Response model for parsed job data"""
    success: bool
    data: Optional[dict] = None
    error: Optional[str] = None

@router.post("/parse", response_model=ParseJobResponse)
async def parse_job_description_endpoint(request: ParseJobRequest):
    """
    Parse unstructured job description text using Gemini AI
    and return structured job data.
    """
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    result = parse_job_description(request.text)
    
    if not result['success']:
        raise HTTPException(
            status_code=500, 
            detail=result.get('error', 'Failed to parse job description')
        )
    
    return ParseJobResponse(
        success=True,
        data=result['data']
    )

