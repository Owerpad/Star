from sqlalchemy import Column, Integer, String, Float, Text
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)


class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, default="")
    genre = Column(String, default="")
    cover_url = Column(String, default="")
    average_rating = Column(Float, default=0.0)
    screenshots = Column(Text, default="")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, nullable=False)
    username = Column(String, nullable=False)
    text = Column(Text, default="")
    rating = Column(Integer, nullable=False)
