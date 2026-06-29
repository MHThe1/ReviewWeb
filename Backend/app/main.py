from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import admin, auth, products, reviews

settings = get_settings()

app = FastAPI(
    title="Review Platform API",
    description="A REST API for product reviews",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin.router)
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(reviews.router)


@app.get("/")
def root():
    return {"message": "Review Platform API is running"}
