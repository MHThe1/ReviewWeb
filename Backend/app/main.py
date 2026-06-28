from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, products, reviews

app = FastAPI(
    title="Review Platform API",
    description="A REST API for product reviews",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(reviews.router)


@app.get("/")
def root():
    return {"message": "Review Platform API is running"}
