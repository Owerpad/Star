from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Game, Review
from schemas import GameCreate
from auth import get_current_user
from rawg import search_rawg

router = APIRouter(prefix="/games", tags=["games"])


@router.get("")
def list_games(
    search: str = "",
    genre: str = "",
    min_rating: float = 0,
    sort: str = "",
    db: Session = Depends(get_db),
):
    query = db.query(Game)

    if search:
        query = query.filter(Game.title.ilike(f"%{search}%"))
    if genre:
        query = query.filter(Game.genre.ilike(f"%{genre}%"))
    if min_rating:
        query = query.filter(Game.average_rating >= min_rating)

    if sort == "rating":
        query = query.order_by(Game.average_rating.desc())
    elif sort == "title":
        query = query.order_by(Game.title.asc())
    else:
        query = query.order_by(Game.id.desc())

    return query.all()


@router.get("/{game_id}")
def get_game(game_id: int, db: Session = Depends(get_db)):
    game = db.query(Game).filter(Game.id == game_id).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return game


@router.post("")
def create_game(data: GameCreate, db: Session = Depends(get_db), username: str = Depends(get_current_user)):
    game = Game(**data.model_dump())
    db.add(game)
    db.commit()
    db.refresh(game)
    return game


@router.get("/rawg/search")
def rawg_search(query: str):
    return search_rawg(query)


@router.delete("/{game_id}")
def delete_game(game_id: int, db: Session = Depends(get_db), username: str = Depends(get_current_user)):
    game = db.query(Game).filter(Game.id == game_id).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    db.query(Review).filter(Review.game_id == game_id).delete()
    db.delete(game)
    db.commit()
    return {"detail": "Game deleted"}
