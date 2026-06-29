# Review Platform

A full-stack review platform where users can browse products, submit reviews, and manage their accounts. Built with Next.js, FastAPI, and PostgreSQL.

## Live Demo

- **Frontend**: [https://review-web-frontend.vercel.app](https://review-web-frontend.vercel.app)
- **Backend API**: [https://reviewweb.onrender.com](https://reviewweb.onrender.com)
- **API Docs (Swagger)**: [https://reviewweb.onrender.com/docs](https://reviewweb.onrender.com/docs)

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
- **Admin Dashboard** — Manage catalog (create/delete products) and moderate reviews/users
- **Authentication** — Register and login with JWT-based auth
- **Responsive UI** — Mobile-first design with Tailwind CSS
- **API Documentation** — Auto-generated Swagger/OpenAPI docs at `/docs`

## Project Structure

```
ReviewWeb/
├── docker-compose.yml
├── .env.example
├── .gitignore
├── Backend/
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
└── Frontend/
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
- 5 users (includes a dedicated admin account — see credentials below)
- 6 products
- 13 reviews

### 5. Open the app

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Running Without Docker

If you don't have Docker, you can run each service manually. You'll need **Python 3.11+**, **Node.js 18+**, and **PostgreSQL** installed.

> **Note on environment files:** There is a single `.env.example` at the project root. For local development without Docker, you'll create separate env files inside `Backend/` and `Frontend/` as described below.

### Step 1 — PostgreSQL setup

Create a database. In `psql` or pgAdmin run:

```sql
CREATE DATABASE review_db;
```

### Step 2 — Backend (FastAPI)

```bash
cd Backend

# Create and activate a virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy the backend env template (already scoped for local use)
cp .env.example .env
```

Open **`Backend/.env`** and update `DATABASE_URL` with your local PostgreSQL password:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/review_db
```

> ⚠️ **Special characters in your password?** URL-encode them — `@` → `%40`, `!` → `%21`, `#` → `%23`.
> e.g. password `p@ss!` becomes `postgresql://postgres:p%40ss%21@localhost:5432/review_db`

The other variables in `.env.example` have sensible defaults and don't need changing for local dev.

```bash
# Apply database migrations (creates all tables)
alembic upgrade head

# (Optional) Seed sample data
python -m app.seed

# Start the server
uvicorn app.main:app --reload --port 8000
```

Backend is running at **http://localhost:8000** — Swagger docs at **http://localhost:8000/docs**

### Step 3 — Frontend (Next.js)

```bash
cd Frontend

# Install dependencies
npm install

# Copy the frontend env template
cp .env.local.example .env.local

# Start the dev server
npm run dev
```

Frontend is running at **http://localhost:3000**

> **Test credentials** (if you ran the seed):
> Admin: `admin@reviewdibo.com` / `adminPassword123!`
> Regular user: `alice@example.com` / `password123`

---

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

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/products` | Create product (admin protected) |
| PUT | `/api/admin/products/{id}` | Update product details (admin protected) |
| DELETE | `/api/admin/products/{id}` | Delete product (admin protected) |
| DELETE | `/api/admin/reviews/{id}` | Delete any user review (admin protected) |
| GET | `/api/admin/users` | List all users (admin protected) |
| PUT | `/api/admin/users/{id}` | Update user details / role toggle (admin protected) |
| DELETE | `/api/admin/users/{id}` | Delete user account (admin protected, prevents self-deletion) |

## Database Schema

### users
| Column | Type | Constraints |
|--------|------|------------|
| id | INTEGER | PK, auto-increment |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL, indexed |
| password_hash | VARCHAR(255) | NOT NULL |
| is_admin | BOOLEAN | DEFAULT false, NOT NULL |
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

### Docker (Recommended)

To quickly build, run, and scale the entire stack (Next.js, FastAPI, and PostgreSQL) in any containerized environment:

1. **Set Production Credentials**:
   Make a copy of `.env` and configure the JWT secret and live domain origins:
   ```bash
   JWT_SECRET_KEY=your-secure-production-key-here
   CORS_ORIGINS=http://your-domain.com
   NEXT_PUBLIC_API_URL=http://your-domain.com/api
   ```

2. **Build and Start Container Daemon**:
   ```bash
   docker compose up -d --build
   ```

3. **Initialize Database Schema & Seeds**:
   ```bash
   docker compose exec backend alembic upgrade head
   docker compose exec backend python -m app.seed
   ```

4. **Check Status & Logs**:
   ```bash
   docker compose ps
   docker compose logs -f
   ```

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
