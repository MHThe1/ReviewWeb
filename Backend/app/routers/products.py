from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.product import Product
from app.models.review import Review
from app.schemas.product import ProductResponse, ProductDetail, ReviewInProduct

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=list[ProductResponse])
def get_products(
    search: Optional[str] = Query(None, description="Search by product title"),
    min_rating: Optional[float] = Query(None, ge=0, le=5, description="Filter by minimum average rating"),
    db: Session = Depends(get_db),
):
    # Subquery: compute average rating and review count per product
    stats_subq = (
        db.query(
            Review.product_id,
            func.avg(Review.rating).label("avg_rating"),
            func.count(Review.id).label("review_count"),
        )
        .group_by(Review.product_id)
        .subquery()
    )

    # Build query with outer join so products with no reviews still appear
    query = db.query(
        Product,
        func.coalesce(stats_subq.c.avg_rating, 0).label("average_rating"),
        func.coalesce(stats_subq.c.review_count, 0).label("review_count"),
    ).outerjoin(stats_subq, Product.id == stats_subq.c.product_id)

    # Apply filters
    if search:
        query = query.filter(Product.title.ilike(f"%{search}%"))
    if min_rating is not None:
        query = query.filter(func.coalesce(stats_subq.c.avg_rating, 0) >= min_rating)

    query = query.order_by(Product.created_at.desc())

    results = []
    for product, average_rating, review_count in query.all():
        results.append(ProductResponse(
            id=product.id,
            title=product.title,
            description=product.description,
            image_url=product.image_url,
            average_rating=round(float(average_rating), 1) if review_count > 0 else None,
            review_count=review_count,
            created_at=product.created_at,
        ))

    return results


@router.get("/{product_id}", response_model=ProductDetail)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    stats = db.query(
        func.avg(Review.rating).label("average_rating"),
        func.count(Review.id).label("review_count"),
    ).filter(Review.product_id == product.id).first()

    reviews = (
        db.query(Review)
        .filter(Review.product_id == product.id)
        .order_by(Review.created_at.desc())
        .all()
    )

    review_list = [
        ReviewInProduct(
            id=r.id,
            user_name=r.user.name,
            rating=r.rating,
            comment=r.comment,
            created_at=r.created_at,
        )
        for r in reviews
    ]

    average_rating = round(float(stats.average_rating), 1) if stats.average_rating else None
    review_count = stats.review_count or 0

    return ProductDetail(
        id=product.id,
        title=product.title,
        description=product.description,
        image_url=product.image_url,
        average_rating=average_rating,
        review_count=review_count,
        created_at=product.created_at,
        reviews=review_list,
    )
