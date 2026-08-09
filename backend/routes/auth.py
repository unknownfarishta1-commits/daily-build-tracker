import re
from functools import wraps

from flask import Blueprint, jsonify, request, session

from models import user as user_model

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user_id = session.get("user_id")
        if not user_id:
            return jsonify({"success": False, "message": "Unauthorized. Please log in."}), 401
        user = user_model.find_by_id(user_id)
        if not user:
            session.clear()
            return jsonify({"success": False, "message": "Unauthorized. Please log in."}), 401
        request.current_user = user
        return f(*args, **kwargs)

    return decorated


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    password = data.get("password") or ""

    if not name:
        return jsonify({"success": False, "message": "Name is required"}), 400
    if not email or not EMAIL_RE.match(email):
        return jsonify({"success": False, "message": "A valid email address is required"}), 400
    if not password:
        return jsonify({"success": False, "message": "Password is required"}), 400

    if user_model.find_by_email(email):
        return jsonify({"success": False, "message": "An account with this email already exists"}), 409

    try:
        new_user = user_model.create_user(name, email, password)
    except Exception:
        return jsonify({"success": False, "message": "Something went wrong"}), 500

    return jsonify(
        {
            "success": True,
            "message": "Account created successfully",
            "user": {
                "id": new_user["id"],
                "name": new_user["name"],
                "email": new_user["email"],
            },
        }
    ), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required"}), 400

    user = user_model.find_by_email(email)
    if not user or not user_model.verify_password(user, password):
        return jsonify({"success": False, "message": "Invalid email or password"}), 401

    session["user_id"] = user["id"]
    session.permanent = True

    return jsonify(
        {
            "success": True,
            "message": "Login successful",
            "user": user_model.row_to_public_user(user),
        }
    )


@auth_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"success": True, "message": "Logged out successfully"})


@auth_bp.route("/me", methods=["GET"])
@login_required
def me():
    return jsonify({"success": True, "user": user_model.row_to_public_user(request.current_user)})
