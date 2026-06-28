from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ReviewInProduct(BaseModel):
    id: int
    user_name: str
    rating: int
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True


class ProductResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    average_rating: Optional[float] = None
    review_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


class ProductDetail(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    average_rating: Optional[float] = None
    review_count: int = 0
    created_at: datetime
    reviews: list[ReviewInProduct] = []

    class Config:
        from_attributes = True
