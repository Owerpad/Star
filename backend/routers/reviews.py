from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Review, Game
from schemas import ReviewCreate, ReviewResponse
from auth import get_current_user

router = APIRouter(prefix="/reviews", tags=["reviews"])


def update_average_rating(game_id: int, db: Session):
    avg = db.query(func.avg(Review.rating)).filter(Review.game_id == game_id).scalar()
    game = db.query(Game).filter(Game.id == game_id).first()
    if game:
        game.average_rating = round(avg or 0, 1)
        db.commit()


@router.get("/{game_id}")
def list_reviews(game_id: int, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.game_id == game_id).order_by(Review.id.desc()).all()


@router.post("")
def create_review(data: ReviewCreate, db: Session = Depends(get_db), username: str = Depends(get_current_user)):
    if data.rating < 1 or data.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    game = db.query(Game).filter(Game.id == data.game_id).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    review = Review(game_id=data.game_id, username=username, text=data.text, rating=data.rating)
    db.add(review)
    db.commit()
    update_average_rating(data.game_id, db)
    db.refresh(review)
    return review
