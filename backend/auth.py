from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
from typing import Optional
from models import User, UserCreate, UserLogin
from database import db

# Security configuration
SECRET_KEY = os.environ.get("JWT_SECRET", "riide_secret_key_2025")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user_data = await db.get_user_by_id(user_id)
    if user_data is None:
        raise credentials_exception
    
    return User(**user_data)

async def authenticate_user(email: str, password: str) -> Optional[User]:
    user_data = await db.get_user_by_email(email)
    if not user_data:
        return None
    
    if not verify_password(password, user_data["password_hash"]):
        return None
    
    # Remove password hash before returning user
    user_data.pop("password_hash", None)
    return User(**user_data)

async def create_user_account(user_create: UserCreate) -> User:
    # Check if user already exists
    existing_user = await db.get_user_by_email(user_create.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and create user
    hashed_password = get_password_hash(user_create.password)
    
    user_data = user_create.dict()
    user_data.pop("password")  # Remove plain password
    user_data["password_hash"] = hashed_password
    
    user = User(**user_data)
    user_id = await db.create_user(user.dict())
    
    # Create user profile
    from models import UserProfile
    profile = UserProfile(user_id=user_id)
    await db.create_document("user_profiles", profile.dict())
    
    return user

# Optional: Get current user (allows None for public endpoints)
async def get_current_user_optional(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Optional[User]:
    if not credentials:
        return None
    
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None