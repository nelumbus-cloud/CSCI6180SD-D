import os
import json
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, Tuple
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from sqlalchemy.orm import Session
from models import User
from dotenv import load_dotenv

load_dotenv("../.env")
load_dotenv("../.env.local", override=True)

#google oauth configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "484205729441-n1ir2k6vru94il3op65v6ki2qrmkcndn.apps.googleusercontent.com")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "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")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/calendar/oauth2callback")

#scopes needed for calendar access
SCOPES = ['https://www.googleapis.com/auth/calendar']

def get_oauth_flow(redirect_uri: Optional[str] = None) -> Flow:
    """create oauth2 flow for google calendar"""
    client_config = {
        "web": {
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": [redirect_uri or GOOGLE_REDIRECT_URI]
        }
    }
    
    flow = Flow.from_client_config(
        client_config,
        scopes=SCOPES,
        redirect_uri=redirect_uri or GOOGLE_REDIRECT_URI
    )
    return flow

def get_authorization_url(user_id: str, redirect_uri: Optional[str] = None) -> Tuple[str, str]:
    """generate authorization url for oauth flow
    returns: (authorization_url, state) tuple
    """
    flow = get_oauth_flow(redirect_uri)
    #create state with user_id
    state = json.dumps({"user_id": user_id})
    authorization_url, _ = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent',  #force consent to get refresh token
        state=state  #pass state explicitly
    )
    return authorization_url, state

def save_credentials(user: User, credentials: Credentials, db: Session):
    """save google credentials to user model"""
    token_data = {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes
    }
    user.google_calendar_token = json.dumps(token_data)
    db.commit()

def get_credentials(user: User) -> Optional[Credentials]:
    """retrieve and build credentials from user model"""
    if not user.google_calendar_token:
        return None
    
    try:
        token_data = json.loads(user.google_calendar_token)
        credentials = Credentials(
            token=token_data.get('token'),
            refresh_token=token_data.get('refresh_token'),
            token_uri=token_data.get('token_uri'),
            client_id=token_data.get('client_id'),
            client_secret=token_data.get('client_secret'),
            scopes=token_data.get('scopes')
        )
        
        #note: token refresh should be handled when getting calendar service
        
        return credentials
    except Exception as e:
        print(f"error loading credentials: {e}")
        return None

def get_calendar_service(user: User, db: Session) -> Optional[Any]:
    """get google calendar service instance for user"""
    credentials = get_credentials(user)
    if not credentials:
        return None
    
    #refresh if needed
    if credentials.expired and credentials.refresh_token:
        credentials.refresh(Request())
        save_credentials(user, credentials, db)
    
    try:
        service = build('calendar', 'v3', credentials=credentials)
        return service
    except Exception as e:
        print(f"error building calendar service: {e}")
        return None

def create_calendar_event(
    user: User,
    db: Session,
    title: str,
    start_time: datetime,
    end_time: Optional[datetime] = None,
    description: Optional[str] = None,
    location: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    """create a calendar event in user's google calendar"""
    service = get_calendar_service(user, db)
    if not service:
        return None
    
    #default to 1 hour if no end time
    if not end_time:
        end_time = start_time + timedelta(hours=1)
    
    event = {
        'summary': title,
        'description': description or '',
        'location': location or '',
        'start': {
            'dateTime': start_time.isoformat(),
            'timeZone': 'UTC',
        },
        'end': {
            'dateTime': end_time.isoformat(),
            'timeZone': 'UTC',
        },
    }
    
    try:
        created_event = service.events().insert(calendarId='primary', body=event).execute()
        return {
            'id': created_event.get('id'),
            'htmlLink': created_event.get('htmlLink'),
            'summary': created_event.get('summary'),
            'start': created_event.get('start'),
            'end': created_event.get('end')
        }
    except HttpError as error:
        print(f"error creating calendar event: {error}")
        return None

def sync_job_dates_to_calendar(user: User, db: Session, job) -> Dict[str, Any]:
    """sync important dates from a job to google calendar"""
    events_created = []
    service = get_calendar_service(user, db)
    
    if not service:
        return {"error": "calendar not connected", "events_created": []}
    
    #create events for each important date
    if job.interview_date:
        event = create_calendar_event(
            user, db,
            title=f"Interview: {job.title} at {job.company}",
            start_time=job.interview_date,
            description=f"Job application interview for {job.title} position at {job.company}",
            location=job.location or job.work_location
        )
        if event:
            events_created.append({"type": "interview", "event": event})
    
    if job.follow_up_date:
        event = create_calendar_event(
            user, db,
            title=f"Follow-up: {job.title} at {job.company}",
            start_time=job.follow_up_date,
            description=f"Follow-up reminder for {job.title} position at {job.company}",
        )
        if event:
            events_created.append({"type": "follow_up", "event": event})
    
    if job.application_deadline:
        event = create_calendar_event(
            user, db,
            title=f"Application Deadline: {job.title} at {job.company}",
            start_time=job.application_deadline,
            description=f"Application deadline for {job.title} position at {job.company}",
        )
        if event:
            events_created.append({"type": "deadline", "event": event})
    
    if job.offer_deadline:
        event = create_calendar_event(
            user, db,
            title=f"Offer Deadline: {job.title} at {job.company}",
            start_time=job.offer_deadline,
            description=f"Offer response deadline for {job.title} position at {job.company}",
        )
        if event:
            events_created.append({"type": "offer_deadline", "event": event})
    
    return {"events_created": events_created, "count": len(events_created)}

