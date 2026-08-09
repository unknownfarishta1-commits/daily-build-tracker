from database import get_db


def find_submission(user_id, day_number):
    with get_db() as conn:
        row = conn.execute(
            """
            SELECT * FROM submissions
            WHERE user_id = ? AND day_number = ?
            """,
            (user_id, day_number),
        ).fetchone()
        return dict(row) if row else None


def format_submission(row):
    return {
        "day": row["day_number"],
        "githubRepository": row["github_repository"],
        "githubCommit": row["github_commit"],
        "linkedinPost": row["linkedin_post"],
        "status": row["status"],
        "submittedAt": row["submitted_at"],
    }


def create_submission(user_id, day_number, github_repository, github_commit, linkedin_post):
    with get_db() as conn:
        existing = conn.execute(
            "SELECT id FROM submissions WHERE user_id = ? AND day_number = ?",
            (user_id, day_number),
        ).fetchone()
        if existing:
            conn.execute(
                """
                UPDATE submissions
                SET github_repository = ?, github_commit = ?, linkedin_post = ?,
                    status = 'completed', submitted_at = datetime('now')
                WHERE user_id = ? AND day_number = ?
                """,
                (github_repository, github_commit, linkedin_post, user_id, day_number),
            )
        else:
            conn.execute(
                """
                INSERT INTO submissions
                    (user_id, day_number, github_repository, github_commit, linkedin_post, status)
                VALUES (?, ?, ?, ?, ?, 'completed')
                """,
                (user_id, day_number, github_repository, github_commit, linkedin_post),
            )
        row = conn.execute(
            "SELECT * FROM submissions WHERE user_id = ? AND day_number = ?",
            (user_id, day_number),
        ).fetchone()
        return dict(row)


def get_recent_activity(user_id, limit=5):
    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT s.day_number, s.submitted_at, s.status, c.title
            FROM submissions s
            LEFT JOIN challenges c ON c.day_number = s.day_number
            WHERE s.user_id = ?
            ORDER BY s.submitted_at DESC
            LIMIT ?
            """,
            (user_id, limit),
        ).fetchall()
        return [
            {
                "day": r["day_number"],
                "title": r["title"] or f"Day {r['day_number']}",
                "status": r["status"],
                "submittedAt": r["submitted_at"],
            }
            for r in rows
        ]


def count_completed(user_id):
    with get_db() as conn:
        row = conn.execute(
            "SELECT COUNT(*) as cnt FROM submissions WHERE user_id = ? AND status = 'completed'",
            (user_id,),
        ).fetchone()
        return row["cnt"]
