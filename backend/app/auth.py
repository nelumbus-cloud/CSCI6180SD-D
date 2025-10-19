# from datetime import datetime, timedelta
# from typing import Optional
# from jose import JWTError, jwt
# from passlib.context import CryptContext
# from fastapi import Depends, HTTPException, status
# from fastapi.security import OAuth2PasswordBearer
# from sqlalchemy.orm import Session
# from pydantic import BaseModel, EmailStr
# from database import get_db
# from models import User

# # Configuration
# SECRET_KEY = "mysecretkey"
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 60

# # Password hashing
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# # OAuth2 scheme
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# # Pydantic models
# class UserCreate(BaseModel):
#     email: EmailStr
#     password: str

# class UserResponse(BaseModel):
#     id: int
#     email: str
#     is_active: bool
#     is_verified: bool
#     created_at: datetime

#     class Config:
#         from_attributes = True

# class Token(BaseModel):
#     access_token: str
#     token_type: str

# class TokenData(BaseModel):
#     email: Optional[str] = None

# # Password utilities
# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     """Verify a password against its hash"""
#     return pwd_context.verify(plain_password, hashed_password)

# def get_password_hash(password: str) -> str:
#     """Hash a password"""
#     return pwd_context.hash(password)

# # User utilities
# def get_user_by_email(db: Session, email: str) -> Optional[User]:
#     """Get user by email"""
#     return db.query(User).filter(User.email == email).first()

# def create_user(db: Session, user: UserCreate) -> User:
#     """Create a new user"""
#     hashed_password = get_password_hash(user.password)
#     db_user = User(email=user.email, hashed_password=hashed_password)
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user

# def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
#     """Authenticate a user"""
#     user = get_user_by_email(db, email)
#     if not user:
#         return None
#     if not verify_password(password, user.hashed_password):
#         return None
#     return user

# # JWT utilities
# def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
#     """Create a JWT access token"""
#     to_encode = data.copy()
#     if expires_delta:
#         expire = datetime.utcnow() + expires_delta
#     else:
#         expire = datetime.utcnow() + timedelta(minutes=15)
#     to_encode.update({"exp": expire})
#     encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
#     return encoded_jwt

# async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
#     """Get current authenticated user from token"""
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         email: str = payload.get("sub")
#         if email is None:
#             raise credentials_exception
#         token_data = TokenData(email=email)
#     except JWTError:
#         raise credentials_exception
    
#     user = get_user_by_email(db, email=token_data.email)
#     if user is None:
#         raise credentials_exception
#     return user

# async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
#     """Get current active user"""
#     if not current_user.is_active:
#         raise HTTPException(status_code=400, detail="Inactive user")
#     return current_user

# from fastapi import Depends, HTTPException, status, Request
# from fastapi.security import OAuth2PasswordRequestForm
# from jose import JWTError, jwt
# from passlib.context import CryptContext
# from datetime import datetime, timedelta
# from typing import Optional
# from sqlalchemy.orm import Session
# from database import get_db
# from models import User
# from pydantic import BaseModel

# SECRET_KEY = "your-secret-key-here"
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 14400 # 10 days

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# class UserBase(BaseModel):
#     username: str
#     role: str

# class UserInDB(UserBase):
#     id: int
#     hashed_password: Optional[str] = None

# class UserCreate(BaseModel):
#     username: str
#     contact_email: str
#     password: str
#     role: str

# def verify_password(plain_password, hashed_password):
#     """Verify a plain password against a hashed password."""
#     return pwd_context.verify(plain_password, hashed_password)

# def get_user(db: Session, username: str):
#     """Retrieve a user from the database by username."""
#     db_user = db.query(User).filter(User.username == username).first()
#     if db_user:
#         return UserInDB(
#             id=db_user.id,
#             username=db_user.username,
#             role=db_user.role,
#             hashed_password=db_user.hashed_password
#         )
#     return None

# def authenticate_user(db: Session, username: str, password: str):#######
#     """Authenticate a user with username and password."""
#     user = get_user(db, username)
#     if not user:
#         print("not user")
#         return False
#     if user.hashed_password is None:  # Google login user
#         print("hashed_password is None")
#         return False
#     if not verify_password(password, user.hashed_password):
#         print("not verify_password")
#         return False
#     return user

# def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
#     """Create a JWT access token."""
#     print("create_access_token")
#     to_encode = data.copy()
#     if expires_delta:
#         expire = datetime.utcnow() + expires_delta
#     else:
#         expire = datetime.utcnow() + timedelta(minutes=15)
#     to_encode.update({"exp": expire})
#     encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
#     print("encoded_jwt")
#     return encoded_jwt

# def get_token(request: Request):
#     """Extract the access token from the 'token' cookie."""
#     token = request.cookies.get("token")
#     if not token:
#         raise HTTPException(status_code=401, detail="Not authenticated")
#     return token

# async def get_current_user(token: str = Depends(get_token), db: Session = Depends(get_db)):
#     """Get the current user from a JWT token in the cookie."""
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         print(token)
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         username: str = payload.get("sub")
#         if username is None:
#             raise credentials_exception
#     except JWTError:
#         raise credentials_exception
#     user = get_user(db, username)
#     if user is None:
#         raise credentials_exception
#     return user

# def require_role(role: str):
#     """Dependency to check if the user has the required role."""
#     async def role_checker(current_user: UserInDB = Depends(get_current_user)):
#         if current_user.role != role:
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail="Insufficient permissions"
#             )
#         return current_user
#     return role_checker












from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional, List
from sqlalchemy.orm import Session
from .database import get_db
from .models import User
from pydantic import BaseModel
from dotenv import load_dotenv
import os


load_dotenv("../.env")
load_dotenv("../.env.local", override=True) 
SECRET_KEY = os.getenv("AUTH_SECRET_KEY")
ALGORITHM = os.getenv("AUTH_ALGORITHM")

# SECRET_KEY="your-secret-key-here"
# ALGORITHM="HS256"

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
