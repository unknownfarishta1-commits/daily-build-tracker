import re
from urllib.parse import urlparse

from flask import Blueprint, jsonify, request

from models import challenge as challenge_model
from models import submission as submission_model
from models import user as user_model
from routes.auth import login_required

challenges_bp = Blueprint("challenges", __name__, url_prefix="/api/challenges")

MILESTONES = {
    7: ("Week One Warrior", "Completed your first 7 days of the challenge"),
    10: ("Double Digits", "Reached 10 completed challenge days"),
    30: ("Halfway Hero", "Completed 30 days of the 60-day challenge"),
}


def is_valid_url(url, allowed_hosts=None):
    try:
        parsed = urlparse(url.strip())
        if parsed.scheme not in ("http", "https"):
            return False
        if not parsed.netloc:
            return False
        if allowed_hosts:
            host = parsed.netloc.lower()
            return any(h in host for h in allowed_hosts)
        return True
    except Exception:
        return False


@challenges_bp.route("/day/<int:day_number>", methods=["GET"])
@login_required
def get_day(day_number):
    challenge = challenge_model.find_by_day(day_number)
    if not challenge:
        return jsonify({"success": False, "message": f"Challenge day {day_number} not found"}), 404
    return jsonify(challenge)


@challenges_bp.route("/day/<int:day_number>/submit", methods=["POST"])
@login_required
def submit_day(day_number):
    user = request.current_user
    challenge = challenge_model.find_by_day(day_number)
    if not challenge:
        return jsonify({"success": False, "message": f"Challenge day {day_number} not found"}), 404

    data = request.get_json(silent=True) or {}
    github_repo = (data.get("githubRepository") or "").strip()
    github_commit = (data.get("githubCommit") or "").strip()
    linkedin_post = (data.get("linkedinPost") or "").strip()

    missing = []
    if not github_repo:
        missing.append("githubRepository")
    if not github_commit:
        missing.append("githubCommit")
    if not linkedin_post:
        missing.append("linkedinPost")
    if missing:
        return jsonify(
            {"success": False, "message": f"Missing required fields: {', '.join(missing)}"}
        ), 400

    if not is_valid_url(github_repo, ["github.com"]):
        return jsonify({"success": False, "message": "Invalid GitHub repository URL"}), 400
    if not is_valid_url(github_commit, ["github.com"]):
        return jsonify({"success": False, "message": "Invalid GitHub commit URL"}), 400
    if not is_valid_url(linkedin_post, ["linkedin.com"]):
        return jsonify({"success": False, "message": "Invalid LinkedIn post URL"}), 400

    existing = submission_model.find_submission(user["id"], day_number)
    already_completed = existing and existing["status"] == "completed"

    try:
        submission_model.create_submission(
            user["id"], day_number, github_repo, github_commit, linkedin_post
        )
    except Exception:
        return jsonify({"success": False, "message": "Something went wrong"}), 500

    new_completed = user["completed_days"]
    new_streak = user["streak"]

    if not already_completed and day_number == user["completed_days"] + 1:
        new_completed = user["completed_days"] + 1
        new_streak = user["streak"] + 1
        user_model.update_progress(user["id"], new_completed, new_streak)

        for milestone_day, (name, desc) in MILESTONES.items():
            if new_completed >= milestone_day:
                user_model.unlock_achievement(user["id"], name, desc)

    return jsonify(
        {
            "success": True,
            "message": f"Day {day_number} completed successfully",
            "submission": {"day": day_number, "status": "completed"},
            "streak": new_streak,
        }
    )


@challenges_bp.route("/day/<int:day_number>/submission", methods=["GET"])
@login_required
def get_submission(day_number):
    user = request.current_user
    submission = submission_model.find_submission(user["id"], day_number)
    if not submission:
        return jsonify({"success": False, "message": f"No submission found for day {day_number}"}), 404
    return jsonify(submission_model.format_submission(submission))
