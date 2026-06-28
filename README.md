# Review Platform

A full-stack review platform where users can browse products, submit reviews, and manage their accounts. Built with Next.js, FastAPI, and PostgreSQL.

## Live Demo

- **Frontend**: [https://your-frontend.vercel.app](https://your-frontend.vercel.app)
- **Backend API**: [https://your-backend.onrender.com](https://your-backend.onrender.com)
- **API Docs (Swagger)**: [https://your-backend.onrender.com/docs](https://your-backend.onrender.com/docs)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js, TypeScript, Tailwind CSS, Axios |
| Backend | FastAPI, Python, SQLAlchemy ORM |
| Database | PostgreSQL |
| Auth | JWT (python-jose + bcrypt) |
| Migrations | Alembic |
| Containerization | Docker Compose |

## Features

- **Product Listing** — Browse products with images, average ratings, and review counts
- **Search & Filter** — Search products by name, filter by minimum rating
- **Product Details** — View full product info and all user reviews
- **Review System** — Submit, edit, and delete reviews (1–5 star rating)
- **Authentication** — Register and login with JWT-based auth
- **Responsive UI** — Mobile-first design with Tailwind CSS
- **API Documentation** — Auto-generated Swagger/OpenAPI docs at `/docs`

## Project Structure

```
ReviewWeb/
├── docker-compose.yml
├── .env.example
├── .gitignore
├── backend/
│   ├── Dockerfile
│   ├── entrypoint.sh
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── alembic/
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   └── versions/
│   │       └── 30f12a1c1a62_initial_schema.py
│   └── app/
│       ├── main.py
│       ├── config.py
│       ├── database.py
│       ├── seed.py
│       ├── models/          # SQLAlchemy models
│       ├── schemas/         # Pydantic request/response schemas
│       ├── routers/         # API route handlers
│       └── utils/           # Auth utilities
└── frontend/
    ├── Dockerfile
    ├── src/
    │   ├── app/             # Next.js App Router pages
    │   ├── components/      # Reusable React components
    │   ├── context/         # Auth context provider
    │   ├── hooks/           # Custom hooks (useDebounce)
    │   ├── services/        # API service layer
    │   └── types/           # TypeScript interfaces
    └── ...
```

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- Git

### 1. Clone the repository

```bash
git clone https://github.com/your-username/review-platform.git
cd review-platform
```

### 2. Create environment file

```bash
cp .env.example .env
```

Edit `.env` if needed. The defaults work for local Docker development.

### 3. Start all services

```bash
docker compose up -d
```

This starts three services:
- **PostgreSQL** — `localhost:5432`
- **FastAPI backend** — `localhost:8000`
- **Next.js frontend** — `localhost:3000`

The backend entrypoint automatically runs Alembic migrations on startup.

### 4. Seed the database

```bash
docker compose exec backend python -m app.seed
```

This creates sample data:
- 4 test users (password: `password123`)
- 6 products
- 13 reviews

### 5. Open the app

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account (returns JWT) |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/auth/me` | Get current user (protected) |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products (with avg rating) |
| GET | `/api/products?search=term` | Search by title |
| GET | `/api/products?min_rating=4` | Filter by minimum rating |
| GET | `/api/products/{id}` | Product details with reviews |

### Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews` | Create review (protected) |
| PUT | `/api/reviews/{id}` | Update own review (protected) |
| DELETE | `/api/reviews/{id}` | Delete own review (protected) |

## Database Schema

### users
| Column | Type | Constraints |
|--------|------|------------|
| id | INTEGER | PK, auto-increment |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL, indexed |
| password_hash | VARCHAR(255) | NOT NULL |
| created_at | TIMESTAMP WITH TZ | DEFAULT now() |

### products
| Column | Type | Constraints |
|--------|------|------------|
| id | INTEGER | PK, auto-increment |
| title | VARCHAR(200) | NOT NULL |
| description | TEXT | nullable |
| image_url | VARCHAR(500) | nullable |
| created_at | TIMESTAMP WITH TZ | DEFAULT now() |

### reviews
| Column | Type | Constraints |
|--------|------|------------|
| id | INTEGER | PK, auto-increment |
| product_id | INTEGER | FK → products.id, CASCADE |
| user_id | INTEGER | FK → users.id, CASCADE |
| rating | INTEGER | CHECK (1–5) |
| comment | TEXT | NOT NULL |
| created_at | TIMESTAMP WITH TZ | DEFAULT now() |
| — | — | UNIQUE(product_id, user_id) |

## Database Migrations

```bash
# Generate a new migration after model changes
docker compose exec backend alembic revision --autogenerate -m "description"

# Apply pending migrations
docker compose exec backend alembic upgrade head

# Rollback one migration
docker compose exec backend alembic downgrade -1
```

## Development

### Hot reload

Both frontend and backend support hot reload via Docker volume mounts:
- Backend: edits to `backend/app/` trigger uvicorn restart
- Frontend: edits to `frontend/src/` trigger Next.js fast refresh

### Running tests (backend)

```bash
docker compose exec backend pytest
```

## Deployment

### Backend (Render)

1. Push to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Connect your repo, select Docker
4. Add a **PostgreSQL** database
5. Set environment variables from `.env.example`
6. Render auto-deploys on push

### Frontend (Vercel)

1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Set `NEXT_PUBLIC_API_URL` to your live backend URL
4. Vercel auto-deploys on push

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_USER` | Database username | `postgres` |
| `POSTGRES_PASSWORD` | Database password | `postgres` |
| `POSTGRES_DB` | Database name | `review_db` |
| `DATABASE_URL` | Full connection string | `postgresql://postgres:postgres@db:5432/review_db` |
| `JWT_SECRET_KEY` | Secret for signing JWTs | `super-secret-key-change-me` |
| `JWT_ALGORITHM` | JWT algorithm | `HS256` |
| `JWT_EXPIRE_MINUTES` | Token expiry (minutes) | `60` |
| `CORS_ORIGINS` | Comma-separated allowed origins | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000/api` |

## License

MIT
