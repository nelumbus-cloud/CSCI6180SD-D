from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware
from contextlib import asynccontextmanager
from database import engine
from models import Base
from auth_routes import router as auth_router
from external_jobs import router as external_jobs_router
from job_routes import router as job_router
from calendar_routes import router as calendar_router
from job_parser_routes import router as job_parser_router
from resume_routes import router as resume_router
from notes_routes import router as notes_router

import os
import logging
from dotenv import load_dotenv
from pathlib import Path


# Set up logging
logging.basicConfig(level=logging.INFO)

# Load environment variables from the backend directory
backend_dir = Path(__file__).parent.parent
env_path = backend_dir / ".env"
env_local_path = backend_dir / ".env.local"

load_dotenv(env_path)
load_dotenv(env_local_path, override=True)

# Get environment variables
APP_ENV = os.getenv("APP_ENV", "development")
SESSION_SECRET_KEY = os.getenv("SESSION_SECRET_KEY", "your-session-secret-key")

# Initialize FastAPI app with lifespan
app = FastAPI(redirect_slashes=False)

# Add CORSMiddleware FIRST (it's added last in execution, so it runs first)
# Define allowed origins
allowed_origins = [
    "http://localhost:5173",      # Vite dev server
    "http://localhost:5174",      # Vite fallback port
    "http://localhost:3000",      # Alternative React dev port
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:3000",
]

# Add production origins if in production
if APP_ENV == "production":
    allowed_origins.extend([
        "https://builder.cloud",
        "https://www.builder.cloud",
    ])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

# Add SessionMiddleware for OAuth state management
app.add_middleware(
    SessionMiddleware, 
    secret_key=SESSION_SECRET_KEY, 
    session_cookie="app_session",  # Unique name
    same_site="lax",
    https_only=True if APP_ENV == "production" else False,
    max_age=3600,
    domain=".builder.cloud" if APP_ENV == "production" else None
    )

# ADD PROXY HEADERS MIDDLEWARE LAST (it executes first)
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts="*")

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routers from other modules
app.include_router(auth_router)
app.include_router(external_jobs_router)
app.include_router(job_router)
app.include_router(calendar_router)
app.include_router(job_parser_router)
app.include_router(resume_router)
app.include_router(notes_router)

# app.include_router(mail_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)