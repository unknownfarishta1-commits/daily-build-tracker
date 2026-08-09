import os
import sys

from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from database import init_db
from routes.auth import auth_bp
from routes.challenges import challenges_bp
from routes.dashboard import dashboard_bp
from utils.seed import run_seed


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
        app,
        origins=Config.CORS_ORIGINS,
        supports_credentials=True,
        allow_headers=["Content-Type"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(challenges_bp)

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "message": "Resource not found"}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({"success": False, "message": "Method not allowed"}), 405

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"success": False, "message": "Something went wrong"}), 500

    @app.route("/api/health")
    def health():
        return jsonify({"success": True, "message": "ABTalks backend is running"})

    return app


app = create_app()


if __name__ == "__main__":
    init_db()

    from models.user import find_by_email

    if not find_by_email("demo@abtalks.dev") or "--seed" in sys.argv:
        run_seed()

    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
