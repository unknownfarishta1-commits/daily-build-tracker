# ABTalks 60-Day Challenge — Backend

Lightweight Flask REST API with SQLite for the Daily Build Tracker frontend.

## Quick Start

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

Server runs at **http://localhost:5000**

On first run, the database is created and seeded automatically with:
- Demo user: `demo@abtalks.dev` / `demo123`
- Challenge days 1–12

Re-seed anytime:

```bash
python app.py --seed
```

## Demo Login

| Field    | Value              |
|----------|--------------------|
| Email    | demo@abtalks.dev   |
| Password | demo123            |

## API Endpoints

| Method | Endpoint                              | Auth     | Description              |
|--------|---------------------------------------|----------|--------------------------|
| GET    | `/api/health`                         | No       | Health check             |
| POST   | `/api/auth/register`                  | No       | Register new user        |
| POST   | `/api/auth/login`                     | No       | Login (session cookie)   |
| POST   | `/api/auth/logout`                    | No       | Logout                   |
| GET    | `/api/auth/me`                        | Yes      | Current user profile     |
| GET    | `/api/dashboard`                      | Yes      | Dashboard data           |
| GET    | `/api/challenges/day/<n>`             | Yes      | Challenge day details    |
| POST   | `/api/challenges/day/<n>/submit`      | Yes      | Submit proof of work     |
| GET    | `/api/challenges/day/<n>/submission`  | Yes      | Submission status        |

## Frontend Integration

1. Start the backend: `python app.py` (port 5000)
2. Start the frontend: `npm run dev` (port 5173 or 8080/8081)
3. Vite proxies `/api/*` requests to the Flask server, so cookies work in dev

The React app uses `src/lib/api.ts` with `credentials: "include"` for session auth.

### Flow

```
Login page  →  POST /api/auth/login
Dashboard   →  GET  /api/dashboard
Day page    →  GET  /api/challenges/day/12
Submit      →  POST /api/challenges/day/12/submit
```

## Environment Variables

| Variable       | Default              | Description                    |
|----------------|----------------------|--------------------------------|
| `SECRET_KEY`   | dev key              | Flask session secret           |
| `DATABASE_PATH`| `./database.db`      | SQLite database file path      |
| `PORT`         | `5000`               | Server port                    |
| `FRONTEND_URL` | —                    | Extra CORS origin for production |

## Project Structure

```
backend/
├── app.py              # Flask entry point
├── config.py           # Configuration
├── database.py         # SQLite connection helpers
├── requirements.txt
├── models/
│   ├── user.py
│   ├── challenge.py
│   └── submission.py
├── routes/
│   ├── auth.py
│   ├── dashboard.py
│   └── challenges.py
└── utils/
    └── seed.py         # Demo data seeder
```

## Security Notes

- Passwords hashed with Werkzeug
- Parameterized SQL queries (no injection)
- No real OAuth — GitHub/Google buttons are UI-only
- Demo/hackathon project — not production-hardened
