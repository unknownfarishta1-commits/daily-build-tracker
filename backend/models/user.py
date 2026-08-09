import json
from werkzeug.security import check_password_hash, generate_password_hash

from database import get_db


def row_to_public_user(row):
    return {
        "id": row["id"],
        "name": row["name"],
        "email": row["email"],
        "track": row["track"],
        "streak": row["streak"],
        "completedDays": row["completed_days"],
        "totalDays": row["total_days"],
    }


def find_by_email(email):
    with get_db() as conn:
        row = conn.execute("SELECT * FROM users WHERE email = ?", (email.lower().strip(),)).fetchone()
        return dict(row) if row else None


def find_by_id(user_id):
    with get_db() as conn:
        row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        return dict(row) if row else None


def create_user(name, email, password, track="Full Stack Development"):
    password_hash = generate_password_hash(password)
    email = email.lower().strip()
    with get_db() as conn:
        cursor = conn.execute(
            """
            INSERT INTO users (name, email, password_hash, track)
            VALUES (?, ?, ?, ?)
            """,
            (name.strip(), email, password_hash, track),
        )
        user_id = cursor.lastrowid
        row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        return dict(row)


def verify_password(user, password):
    return check_password_hash(user["password_hash"], password)


def update_progress(user_id, completed_days, streak):
    with get_db() as conn:
        conn.execute(
            "UPDATE users SET completed_days = ?, streak = ? WHERE id = ?",
            (completed_days, streak, user_id),
        )


def get_achievements(user_id):
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM achievements WHERE user_id = ? ORDER BY id",
            (user_id,),
        ).fetchall()
        return [dict(r) for r in rows]


def unlock_achievement(user_id, name, description):
    with get_db() as conn:
        existing = conn.execute(
            "SELECT id, unlocked FROM achievements WHERE user_id = ? AND achievement_name = ?",
            (user_id, name),
        ).fetchone()
        if existing and existing["unlocked"]:
            return
        if existing:
            conn.execute(
                """
                UPDATE achievements SET unlocked = 1, unlocked_at = datetime('now')
                WHERE id = ?
                """,
                (existing["id"],),
            )
        else:
            conn.execute(
                """
                INSERT INTO achievements (user_id, achievement_name, description, unlocked, unlocked_at)
                VALUES (?, ?, ?, 1, datetime('now'))
                """,
                (user_id, name, description),
            )
