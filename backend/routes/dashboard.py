from flask import Blueprint, jsonify, request

from models import challenge as challenge_model
from models import submission as submission_model
from models import user as user_model
from routes.auth import login_required

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api")


@dashboard_bp.route("/dashboard", methods=["GET"])
@login_required
def dashboard():
    user = request.current_user
    current_day = min(user["completed_days"] + 1, user["total_days"])
    today_challenge = challenge_model.find_by_day(current_day)

    submission = submission_model.find_submission(user["id"], current_day)
    if submission:
        today_status = "completed"
    elif current_day <= user["completed_days"] + 1:
        today_status = "in_progress"
    else:
        today_status = "locked"

    percentage = round((user["completed_days"] / user["total_days"]) * 100, 2)

    achievements = user_model.get_achievements(user["id"])
    achievement_list = [
        {
            "name": a["achievement_name"],
            "description": a["description"],
            "unlocked": bool(a["unlocked"]),
            "unlockedAt": a["unlocked_at"],
        }
        for a in achievements
        if a["unlocked"]
    ]

    recent = submission_model.get_recent_activity(user["id"])

    return jsonify(
        {
            "student": {
                "name": user["name"],
                "track": user["track"],
                "streak": user["streak"],
                "completedDays": user["completed_days"],
                "totalDays": user["total_days"],
            },
            "today": {
                "day": current_day,
                "title": today_challenge["title"] if today_challenge else f"Day {current_day}",
                "estimatedTime": today_challenge["estimatedTime"] if today_challenge else "60–90 min",
                "status": today_status,
            },
            "progress": {
                "percentage": percentage,
                "completed": user["completed_days"],
                "total": user["total_days"],
            },
            "achievements": achievement_list,
            "recentActivity": recent,
        }
    )
