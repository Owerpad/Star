from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserRegister, UserLogin, Token
from auth import hash_password, verify_password, create_token

router = APIRouter(prefix="", tags=["auth"])


@router.post("/register")
def register(data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    user = User(username=data.username, password=hash_password(data.password))
    db.add(user)
    db.commit()
    token = create_token(user.username)
    return Token(access_token=token, token_type="bearer")


@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(user.username)
    return Token(access_token=token, token_type="bearer")
