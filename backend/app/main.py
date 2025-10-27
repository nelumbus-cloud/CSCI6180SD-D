from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware
from contextlib import asynccontextmanager
from .database import engine
from .models import Base
from .auth_routes import router as auth_router
from .external_jobs import router as external_jobs_router
from .job_routes import router as job_router

import os
import logging
from dotenv import load_dotenv


# Set up logging
logging.basicConfig(level=logging.INFO)


load_dotenv("../.env")
load_dotenv("../.env.local", override=True) 

# Get environment variables
APP_ENV = os.getenv("APP_ENV")
SESSION_SECRET_KEY = os.getenv("SESSION_SECRET_KEY")

# Initialize FastAPI app with lifespan
app = FastAPI(redirect_slashes=False)

# 2. ADD PROXY HEADERS MIDDLEWARE FIRST
# This is the most critical fix. It allows the app to trust headers from your Nginx proxy.
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts="*")

# Add SessionMiddleware for OAuth state management
app.add_middleware(
    SessionMiddleware, 
    secret_key=SESSION_SECRET_KEY, 
    session_cookie="app_session",  # Unique name
    same_site="lax",
    https_only=True if APP_ENV == "production" else False,
    max_age=3600,
    domain=".homeinsight.cloud" if APP_ENV == "production" else None
    )

# Add CORSMiddleware for cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routers from other modules
app.include_router(auth_router)
app.include_router(external_jobs_router)
app.include_router(job_router)

# app.include_router(mail_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)