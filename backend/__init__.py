from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, games, reviews

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Game Reviews Aggregator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(games.router)
app.include_router(reviews.router)


@app.get("/")
def root():
    return {"status": "ok"}
