import sqlite3
from contextlib import contextmanager

from config import Config


def get_connection():
    conn = sqlite3.connect(Config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


@contextmanager
def get_db():
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db():
    with get_db() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                track TEXT DEFAULT 'Full Stack Development',
                streak INTEGER DEFAULT 0,
                completed_days INTEGER DEFAULT 0,
                total_days INTEGER DEFAULT 60,
                created_at TEXT DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS challenges (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                day_number INTEGER NOT NULL UNIQUE,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                estimated_time TEXT NOT NULL,
                skills TEXT NOT NULL,
                requirements TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS submissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                day_number INTEGER NOT NULL,
                github_repository TEXT NOT NULL,
                github_commit TEXT NOT NULL,
                linkedin_post TEXT NOT NULL,
                submitted_at TEXT DEFAULT (datetime('now')),
                status TEXT DEFAULT 'completed',
                FOREIGN KEY (user_id) REFERENCES users(id),
                UNIQUE(user_id, day_number)
            );

            CREATE TABLE IF NOT EXISTS achievements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                achievement_name TEXT NOT NULL,
                description TEXT NOT NULL,
                unlocked INTEGER DEFAULT 0,
                unlocked_at TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id),
                UNIQUE(user_id, achievement_name)
            );
            """
        )
