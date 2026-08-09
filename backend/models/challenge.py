import json

from database import get_db


def _parse_json_list(value):
    if isinstance(value, list):
        return value
    return json.loads(value)


def find_by_day(day_number):
    with get_db() as conn:
        row = conn.execute(
            "SELECT * FROM challenges WHERE day_number = ?",
            (day_number,),
        ).fetchone()
        if not row:
            return None
        return _format_challenge(row)


def _format_challenge(row):
    return {
        "day": row["day_number"],
        "title": row["title"],
        "description": row["description"],
        "estimatedTime": row["estimated_time"],
        "skills": _parse_json_list(row["skills"]),
        "requirements": _parse_json_list(row["requirements"]),
    }


def get_all():
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM challenges ORDER BY day_number").fetchall()
        return [_format_challenge(r) for r in rows]


def seed_challenge(day_number, title, description, estimated_time, skills, requirements):
    with get_db() as conn:
        conn.execute(
            """
            INSERT OR IGNORE INTO challenges
                (day_number, title, description, estimated_time, skills, requirements)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                day_number,
                title,
                description,
                estimated_time,
                json.dumps(skills),
                json.dumps(requirements),
            ),
        )
