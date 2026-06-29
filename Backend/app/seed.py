"""Seed script to populate the database with sample data.

Run with: docker compose exec backend python -m app.seed
"""

from app.database import SessionLocal
from app.models.user import User
from app.models.product import Product
from app.models.review import Review
from app.utils.auth import get_password_hash


def seed():
    db = SessionLocal()

    try:
        if db.query(User).first():
            print("Database already seeded, skipping.")
            return

        # Create users
        users = [
            User(name="Alice Johnson", email="alice@example.com", password_hash=get_password_hash("password123"), is_admin=True),
            User(name="Bob Smith", email="bob@example.com", password_hash=get_password_hash("password123")),
            User(name="Carol Davis", email="carol@example.com", password_hash=get_password_hash("password123")),
            User(name="Dave Wilson", email="dave@example.com", password_hash=get_password_hash("password123")),
        ]
        db.add_all(users)
        db.flush()

        # Create products
        products = [
            Product(
                title="Gaming Laptop Pro",
                description="High-performance gaming laptop with RTX 4070, 32GB RAM, and 1TB SSD. Perfect for gaming and content creation.",
                image_url="https://placehold.co/600x400/3b82f6/ffffff?text=Gaming+Laptop",
            ),
            Product(
                title="Wireless Noise-Cancelling Headphones",
                description="Premium over-ear headphones with active noise cancellation, 40-hour battery life, and Hi-Res audio support.",
                image_url="https://placehold.co/600x400/10b981/ffffff?text=Headphones",
            ),
            Product(
                title="Smart Fitness Watch",
                description="Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and 7-day battery life.",
                image_url="https://placehold.co/600x400/f59e0b/ffffff?text=Fitness+Watch",
            ),
            Product(
                title="4K Ultra HD Monitor",
                description="32-inch 4K IPS monitor with HDR600, 120Hz refresh rate, and USB-C connectivity.",
                image_url="https://placehold.co/600x400/8b5cf6/ffffff?text=4K+Monitor",
            ),
            Product(
                title="Mechanical Keyboard RGB",
                description="Full-size mechanical keyboard with Cherry MX Brown switches, per-key RGB lighting, and aluminum frame.",
                image_url="https://placehold.co/600x400/ec4899/ffffff?text=Keyboard",
            ),
            Product(
                title="Portable Bluetooth Speaker",
                description="Waterproof portable speaker with 360-degree sound, 20-hour battery, and built-in microphone.",
                image_url="https://placehold.co/600x400/06b6d4/ffffff?text=Speaker",
            ),
        ]
        db.add_all(products)
        db.flush()

        # Create reviews
        reviews = [
            Review(product_id=1, user_id=1, rating=5, comment="Absolutely amazing laptop! Runs every game at max settings without breaking a sweat."),
            Review(product_id=1, user_id=2, rating=4, comment="Great performance but runs a bit hot under heavy load. Otherwise excellent."),
            Review(product_id=1, user_id=3, rating=5, comment="Best laptop I have ever owned. The display is stunning."),
            Review(product_id=2, user_id=1, rating=5, comment="The noise cancellation is incredible. I can finally focus on my work."),
            Review(product_id=2, user_id=4, rating=4, comment="Sound quality is superb. Comfortable for long listening sessions."),
            Review(product_id=3, user_id=2, rating=4, comment="Accurate fitness tracking and the battery lasts forever. Love it."),
            Review(product_id=3, user_id=3, rating=3, comment="Good watch but the app could be better. GPS takes a while to lock."),
            Review(product_id=4, user_id=1, rating=5, comment="The picture quality is breathtaking. Colors are incredibly accurate."),
            Review(product_id=4, user_id=4, rating=4, comment="Excellent monitor for both work and gaming. USB-C is a nice touch."),
            Review(product_id=5, user_id=2, rating=5, comment="Perfect typing experience. The build quality is top-notch."),
            Review(product_id=5, user_id=3, rating=4, comment="Great keyboard, just wish it had a wrist rest included."),
            Review(product_id=6, user_id=1, rating=4, comment="Impressive sound for its size. Truly waterproof too!"),
            Review(product_id=6, user_id=4, rating=5, comment="Best portable speaker I have owned. Battery lasts forever."),
        ]
        db.add_all(reviews)
        db.commit()

        print(f"Seeded {len(users)} users, {len(products)} products, {len(reviews)} reviews.")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
