



import os
from fastapi import APIRouter, Depends, HTTPException, Response, BackgroundTasks, Request
from fastapi.responses import RedirectResponse
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from .database import get_db
from .models import User
from .auth import (OAuth2PasswordRequestForm, create_access_token,
                 ACCESS_TOKEN_EXPIRE_MINUTES, UserCreate, pwd_context,
                 authenticate_user, get_current_user,require_role,get_user)
from datetime import timedelta, datetime
from pydantic import BaseModel
import uuid
import smtplib
from email.mime.text import MIMEText
from jose import JWTError, jwt
from dotenv import load_dotenv

# Load both .env and .env.local
load_dotenv("../.env")
load_dotenv("../.env.local", override=True) 

APP_ENV = os.getenv("APP_ENV")
SECRET_KEY = os.getenv("AUTH_SECRET_KEY")
ALGORITHM = os.getenv("AUTH_ALGORITHM")

router = APIRouter()

# Pydantic models for forgot/reset password
class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class TokenVerificationRequest(BaseModel):
    token: str

# Email sending function
def send_email(to_email: str, subject: str, body: str):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    smtp_username = "xtharxman@gmail.com"
    smtp_password = "wzyz cfgf txxt paiy"
    
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = "xtharxman@gmail.com"
    msg['To'] = to_email
    
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.send_message(msg)

@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    # Create new user
    hashed_password = pwd_context.hash(user.password)
    new_user = User(
        username=user.username,
        contact_email=user.contact_email,
        hashed_password=hashed_password,
        role="user"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    # Create access token for the new user
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.username},
        expires_delta=access_token_expires
    )
    # Create response with token cookie
    response = JSONResponse(content={
        "username": new_user.username,
        # "role": new_user.role,
        "message": "Account created and logged in successfully"
    })
    # Set the authentication cookie
    cookie_args = {
        "key": "token",
        "value": access_token,
        "httponly": True,
        "secure": True,
        "samesite": "none",
        "max_age": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "path": "/"
    }

    if APP_ENV == "production":
        cookie_args["domain"] = ".homeinsight.cloud"

    response.set_cookie(**cookie_args)
    return response

@router.post("/token")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        # data={"sub": user.username, "role": user.role},
        data={"sub": user.username},
        expires_delta=access_token_expires
    )
    response = JSONResponse(content={"message": "Login successful"})
    
    # just test
    cookie_args = {
        "key": "token",
        "value": access_token,
        "httponly": True,
        "secure": True,
        "samesite": "none",
        "max_age": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "path": "/"
    }

    if APP_ENV == "production":
        cookie_args["domain"] = ".homeinsight.cloud"

    response.set_cookie(**cookie_args)
    
    return response

# Get current user details
@router.get("/me")
async def get_current_user_details(current_user: User = Depends(get_current_user)):
    return {"username": current_user.username, "email": current_user.contact_email, "uid": current_user.id}


# Create user (admin only)
@router.post("/users/", dependencies=[Depends(require_role("admin"))])
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = pwd_context.hash(user.password)
    new_user = User(username=user.username, hashed_password=hashed_password, role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"username": new_user.username, "role": new_user.role}

# Forgot password
@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.contact_email == request.email).first()
    if user:
        reset_token = str(uuid.uuid4())
        expires = datetime.utcnow() + timedelta(hours=1)
        user.reset_token = reset_token
        user.reset_token_expires = expires
        db.commit()
        
        frontend_url = "https://website-builder.homeinsight.cloud"
        reset_link = f"{frontend_url}/reset-password?token={reset_token}"
        
        email_body = f"""
        Hello,
        
        You've requested to reset your password. Please click the link below to set a new password:
        
        {reset_link}
        
        This link will expire in 1 hour.
        
        If you didn't request this, please ignore this email.
        
        Thank you,
        Your App Team
        """
        
        background_tasks.add_task(send_email, user.contact_email, "Password Reset Request", email_body)
    
    return {"message": "If the email exists, a reset link has been sent."}

# Reset password
@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.reset_token == request.token).first()
    if user and user.reset_token_expires > datetime.utcnow():
        user.hashed_password = pwd_context.hash(request.new_password)
        user.reset_token = None
        user.reset_token_expires = None
        db.commit()
        return {"message": "Password has been reset successfully."}
    else:
        raise HTTPException(status_code=400, detail="Invalid or expired token.")
    
    
def clear_user_token(response: Response):
    cookie_args ={
        "key":"token",
        "path":"/",
        "httponly": True,
        "secure": True,
        "samesite":"none",
    }
    
    if APP_ENV == "production":
        cookie_args["domain"]=".homeinsight.cloud"
    
    response.delete_cookie(**cookie_args)    
    
    return {"message": "Logged out successfully"}  


@router.post("/logout")
async def logout(request: Request, response: Response):
    # Clear all session data (including OAuth state)
    request.session.clear()
    
    # Delete the token cookie
    token_cookie_args = {
        "key": "token",
        "path": "/",
        "httponly": True,
        "secure": False if APP_ENV == "development" else True,  # Adjust for local testing
        "samesite": "none",
    }
    if APP_ENV == "production":
        token_cookie_args["domain"] = ".homeinsight.cloud"
    response.delete_cookie(**token_cookie_args)
    
    # Delete the session cookie
    app_session_cookie_args = {
        "key": "app_session",  # Default name used by SessionMiddleware
        "path": "/",
        "httponly": True,
        "secure": False if APP_ENV == "development" else True,
        "samesite": "lax",
    }
    if APP_ENV == "production":
        app_session_cookie_args["domain"] = ".homeinsight.cloud"
    response.delete_cookie(**app_session_cookie_args)
    
    # Delete external session for site-builder.homeinsight.cloud
    external_session_cookie_args = {
        "key": "session",
        "path": "/",
        "httponly": True,
        "secure": False,
        "samesite": "lax",
        "domain": "site-builder.homeinsight.cloud" if APP_ENV == "production" else None
    }
    response.delete_cookie(**external_session_cookie_args)
    
    return {"message": "Logged out successfully"}

    
    

@router.post("/refresh-token")
async def refresh_token(response: Response, current_user: User = Depends(get_current_user)):
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    new_access_token = create_access_token(
        data={"sub": current_user.username},
        expires_delta=access_token_expires
    )
    
    cookie_args = {
        "key": "token",
        "value": new_access_token,
        "httponly": True,
        "secure": True,
        "samesite": "none",
        "max_age": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "path": "/"
    }

    if APP_ENV == "production":
        cookie_args["domain"] = ".homeinsight.cloud"

    response.set_cookie(**cookie_args)
    
    return {"message": "Token refreshed successfully"}
