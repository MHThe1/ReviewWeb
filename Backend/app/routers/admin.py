from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.product import Product
from app.models.review import Review
from app.models.user import User
from app.schemas.product import ProductCreate, ProductResponse
from app.utils.auth import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    data: ProductCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    product = Product(title=data.title, description=data.description, image_url=data.image_url)
    db.add(product)
    db.commit()
    db.refresh(product)

    return ProductResponse(
        id=product.id,
        title=product.title,
        description=product.description,
        image_url=product.image_url,
        average_rating=None,
        review_count=0,
        created_at=product.created_at,
    )


@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    db.delete(product)
    db.commit()


@router.delete("/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_review(
    review_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")

    db.delete(review)
    db.commit()


@router.get("/users")
def list_users(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    users = db.query(User).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "is_admin": u.is_admin,
            "created_at": u.created_at.isoformat(),
        }
        for u in users
    ]
