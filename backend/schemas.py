from pydantic import BaseModel
from typing import Optional


class UserRegister(BaseModel):
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class GameCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    genre: Optional[str] = ""
    cover_url: Optional[str] = ""
    screenshots: Optional[str] = ""


class GameResponse(BaseModel):
    id: int
    title: str
    description: str
    genre: str
    cover_url: str
    average_rating: float
    screenshots: str


class ReviewCreate(BaseModel):
    game_id: int
    text: str
    rating: int


class ReviewResponse(BaseModel):
    id: int
    game_id: int
    username: str
    text: str
    rating: int


class RAWGSearchResult(BaseModel):
    title: str
    description: str
    genre: str
    cover_url: str
    screenshots: str
