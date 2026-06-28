from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.product import Product
from app.models.review import Review
from app.schemas.product import ProductResponse, ProductDetail, ReviewInProduct

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()

    results = []
    for product in products:
        stats = db.query(
            func.avg(Review.rating).label("average_rating"),
            func.count(Review.id).label("review_count"),
        ).filter(Review.product_id == product.id).first()

        results.append(ProductResponse(
            id=product.id,
            title=product.title,
            description=product.description,
            image_url=product.image_url,
            average_rating=round(float(stats.average_rating), 1) if stats.average_rating else None,
            review_count=stats.review_count or 0,
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

    return ProductDetail(
        id=product.id,
        title=product.title,
        description=product.description,
        image_url=product.image_url,
        average_rating=round(float(stats.average_rating), 1) if stats.average_rating else None,
        review_count=stats.review_count or 0,
        created_at=product.created_at,
        reviews=review_list,
    )
