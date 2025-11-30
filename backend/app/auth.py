from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional, List
from sqlalchemy.orm import Session
from database import get_db
from models import User
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from pathlib import Path

# Get the backend directory (parent of app)
backend_dir = Path(__file__).parent.parent
env_path = backend_dir / ".env"
env_local_path = backend_dir / ".env.local"

load_dotenv(env_path)
load_dotenv(env_local_path, override=True)

SECRET_KEY = os.getenv("AUTH_SECRET_KEY") or "your-default-secret-key-change-this"
ALGORITHM = os.getenv("AUTH_ALGORITHM") or "HS256"

print(f"Loading .env from: {env_path}")
print(f"SECRET_KEY: {SECRET_KEY}, ALGORITHM: {ALGORITHM}")
ACCESS_TOKEN_EXPIRE_MINUTES = 10*60  # Updated to 600 minutes

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserBase(BaseModel):
    username: str
    # role: str

class UserInDB(UserBase):
    id: int
    hashed_password: Optional[str] = None

class UserCreate(BaseModel):
    username: str
    contact_email: str
    password: str
    # role: str

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)



def get_user(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def authenticate_user(db: Session, username: str, password: str):
    user = get_user(db, username)
    if not user or user.hashed_password is None or not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_token(request: Request):
    token = request.cookies.get("token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return token

async def get_current_user(token: str = Depends(get_token), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user(db, username)
    if user is None:
        raise credentials_exception
    print (user)
    return user


def require_role(*allowed_roles: List[str]):
    async def role_checker(current_user: UserInDB = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Requires one of: {allowed_roles}"
            )
        return current_user
    return role_checker
