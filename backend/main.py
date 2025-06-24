
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn

from database import get_db, engine
from models import Base, User, Config
from schemas import UserCreate, UserResponse, UserUpdate, ConfigCreate, ConfigResponse, LoginRequest, LoginResponse
from auth import create_access_token, verify_token, get_password_hash, verify_password

# Criar as tabelas
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SIC Dashboard API", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    user_id = verify_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return user

# Auth endpoints
@app.post("/api/auth/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user"
        )
    
    access_token = create_access_token(data={"sub": user.id})
    
    return LoginResponse(
        token=access_token,
        user=UserResponse.from_orm(user)
    )

@app.post("/api/auth/logout")
def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Successfully logged out"}

# User endpoints
@app.get("/api/users", response_model=List[UserResponse])
def get_users(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    users = db.query(User).all()
    return users

@app.post("/api/users", response_model=UserResponse)
def create_user(user_data: UserCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password,
        role=user_data.role,
        is_active=user_data.is_active
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@app.put("/api/users/{user_id}", response_model=UserResponse)
def update_user(user_id: str, user_data: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update user fields
    for field, value in user_data.dict(exclude_unset=True).items():
        if field == "password" and value:
            value = get_password_hash(value)
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    
    return user

@app.delete("/api/users/{user_id}")
def delete_user(user_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    db.delete(user)
    db.commit()
    
    return {"message": "User deleted successfully"}

# Config endpoints
@app.get("/api/configs", response_model=List[ConfigResponse])
def get_configs(config_type: Optional[str] = None, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    query = db.query(Config).filter(Config.user_id == current_user.id)
    
    if config_type:
        query = query.filter(Config.config_type == config_type)
    
    configs = query.all()
    return configs

@app.post("/api/configs", response_model=ConfigResponse)
def create_config(config_data: ConfigCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check if config already exists for this user and type
    existing_config = db.query(Config).filter(
        Config.user_id == current_user.id,
        Config.config_type == config_data.config_type
    ).first()
    
    if existing_config:
        # Update existing config
        existing_config.config = config_data.config
        db.commit()
        db.refresh(existing_config)
        return existing_config
    
    # Create new config
    db_config = Config(
        user_id=current_user.id,
        config_type=config_data.config_type,
        config=config_data.config
    )
    
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    
    return db_config

@app.put("/api/configs/{config_id}", response_model=ConfigResponse)
def update_config(config_id: str, config_data: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    config = db.query(Config).filter(
        Config.id == config_id,
        Config.user_id == current_user.id
    ).first()
    
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Config not found"
        )
    
    config.config = config_data["config"]
    db.commit()
    db.refresh(config)
    
    return config

@app.delete("/api/configs/{config_id}")
def delete_config(config_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    config = db.query(Config).filter(
        Config.id == config_id,
        Config.user_id == current_user.id
    ).first()
    
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Config not found"
        )
    
    db.delete(config)
    db.commit()
    
    return {"message": "Config deleted successfully"}

@app.get("/")
def root():
    return {"message": "SIC Dashboard API is running!"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
