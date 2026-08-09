from werkzeug.security import generate_password_hash

from database import get_db
from models import challenge as challenge_model
from models import user as user_model


CHALLENGES = [
    {
        "day_number": 1,
        "title": "Ship Your Developer Profile",
        "description": (
            "Create a single-page profile site with your name, track, and the goal you're "
            "chasing for the next 60 days. Push it to GitHub and post it publicly. "
            "Small build, real proof."
        ),
        "estimated_time": "30–45 min",
        "skills": ["Git Basics", "HTML & CSS", "Writing in Public"],
        "requirements": [
            "One page, deployed or pushed",
            "Your name, track and 60-day goal",
            "Clean README in the repo",
        ],
    },
    {
        "day_number": 2,
        "title": "Build a Personal Landing Page",
        "description": (
            "Design and build a responsive landing page that showcases who you are as a developer. "
            "Include a hero section, about section, and contact links."
        ),
        "estimated_time": "45–60 min",
        "skills": ["HTML & CSS", "Responsive Design", "Typography"],
        "requirements": [
            "Hero section with name and tagline",
            "About section",
            "Contact or social links",
            "Mobile-responsive layout",
        ],
    },
    {
        "day_number": 3,
        "title": "Create a Todo List App",
        "description": (
            "Build a todo list application where users can add, complete, and delete tasks. "
            "Focus on clean state management and a polished UI."
        ),
        "estimated_time": "45–60 min",
        "skills": ["State Management", "DOM Manipulation", "Local Storage"],
        "requirements": [
            "Add new tasks",
            "Mark tasks complete",
            "Delete tasks",
            "Persist data locally",
        ],
    },
    {
        "day_number": 4,
        "title": "Build a Calculator",
        "description": (
            "Create a functional calculator with basic arithmetic operations. "
            "Handle edge cases like division by zero and chained operations."
        ),
        "estimated_time": "40–55 min",
        "skills": ["JavaScript Logic", "Event Handling", "UI Design"],
        "requirements": [
            "Basic arithmetic (+, -, ×, ÷)",
            "Clear and equals buttons",
            "Keyboard support",
            "Error handling for invalid input",
        ],
    },
    {
        "day_number": 5,
        "title": "Design a Component Library Starter",
        "description": (
            "Build a small set of reusable UI components: Button, Input, and Card. "
            "Document each component with usage examples."
        ),
        "estimated_time": "50–70 min",
        "skills": ["Component Design", "CSS Variables", "Documentation"],
        "requirements": [
            "Button component with variants",
            "Input component with validation states",
            "Card component",
            "Usage documentation",
        ],
    },
    {
        "day_number": 6,
        "title": "Build a Quote Generator",
        "description": (
            "Create an app that displays random inspirational quotes. "
            "Allow users to fetch new quotes and share them."
        ),
        "estimated_time": "35–50 min",
        "skills": ["API Integration", "Random Data", "Copy to Clipboard"],
        "requirements": [
            "Display a random quote",
            "New quote button",
            "Author attribution",
            "Share or copy functionality",
        ],
    },
    {
        "day_number": 7,
        "title": "Create a Countdown Timer",
        "description": (
            "Build a countdown timer with start, pause, and reset controls. "
            "Add visual feedback when the timer completes."
        ),
        "estimated_time": "40–55 min",
        "skills": ["Timers", "State Management", "Audio/Visual Feedback"],
        "requirements": [
            "Set custom duration",
            "Start, pause, reset controls",
            "Visual countdown display",
            "Completion notification",
        ],
    },
    {
        "day_number": 8,
        "title": "Build a Markdown Preview Editor",
        "description": (
            "Create a split-pane editor where users write Markdown on the left "
            "and see a live preview on the right."
        ),
        "estimated_time": "55–75 min",
        "skills": ["Markdown Parsing", "Real-time Updates", "Split Layout"],
        "requirements": [
            "Markdown input area",
            "Live HTML preview",
            "Syntax highlighting (optional)",
            "Responsive split layout",
        ],
    },
    {
        "day_number": 9,
        "title": "Create a Password Generator",
        "description": (
            "Build a secure password generator with configurable length and character sets. "
            "Include a strength indicator."
        ),
        "estimated_time": "35–50 min",
        "skills": ["Cryptography Basics", "Form Controls", "UX Design"],
        "requirements": [
            "Configurable password length",
            "Toggle character types (upper, lower, numbers, symbols)",
            "Copy to clipboard",
            "Strength indicator",
        ],
    },
    {
        "day_number": 10,
        "title": "Build a Pomodoro Timer",
        "description": (
            "Create a Pomodoro timer with work and break intervals. "
            "Track completed sessions and display session history."
        ),
        "estimated_time": "50–70 min",
        "skills": ["Timer Logic", "Session Tracking", "Notifications"],
        "requirements": [
            "25-minute work timer",
            "5-minute break timer",
            "Session counter",
            "Start/pause/reset controls",
        ],
    },
    {
        "day_number": 11,
        "title": "Recovery Build: Tip Splitter",
        "description": (
            "A compact recovery task. Build a tip splitter that takes a bill, a tip percentage "
            "and a number of people, and shows the per-person total live as you type."
        ),
        "estimated_time": "25–40 min",
        "skills": ["State Handling", "Form Inputs", "Number Formatting"],
        "requirements": ["Live calculation", "Input validation", "Mobile-first layout"],
    },
    {
        "day_number": 12,
        "title": "Build a Weather Dashboard",
        "description": (
            "Create a responsive weather application that allows users to search for a city "
            "and view its current weather information."
        ),
        "estimated_time": "60–90 min",
        "skills": ["API Integration", "Async JavaScript", "Error Handling", "Responsive UI"],
        "requirements": [
            "City search",
            "Temperature",
            "Weather condition",
            "Weather icon",
            "Responsive layout",
        ],
    },
]


def seed_challenges():
    for c in CHALLENGES:
        challenge_model.seed_challenge(
            c["day_number"],
            c["title"],
            c["description"],
            c["estimated_time"],
            c["skills"],
            c["requirements"],
        )


def seed_demo_user():
    demo = user_model.find_by_email("demo@abtalks.dev")
    if demo:
        return demo

    password_hash = generate_password_hash("demo123")
    with get_db() as conn:
        cursor = conn.execute(
            """
            INSERT INTO users
                (name, email, password_hash, track, streak, completed_days, total_days)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                "Dhammjit",
                "demo@abtalks.dev",
                password_hash,
                "Full Stack Development",
                12,
                11,
                60,
            ),
        )
        user_id = cursor.lastrowid

        # Seed achievements for demo user (already unlocked week one)
        conn.execute(
            """
            INSERT INTO achievements (user_id, achievement_name, description, unlocked, unlocked_at)
            VALUES (?, ?, ?, 1, datetime('now'))
            """,
            (user_id, "Week One Warrior", "Completed your first 7 days of the challenge"),
        )

        # Seed submissions for days 1-11
        for day in range(1, 12):
            conn.execute(
                """
                INSERT INTO submissions
                    (user_id, day_number, github_repository, github_commit, linkedin_post, status)
                VALUES (?, ?, ?, ?, ?, 'completed')
                """,
                (
                    user_id,
                    day,
                    f"https://github.com/dhammjit/day-{day}-build",
                    f"https://github.com/dhammjit/day-{day}-build/commit/abc{day:03d}",
                    f"https://www.linkedin.com/posts/dhammjit-day{day}",
                ),
            )

    return user_model.find_by_email("demo@abtalks.dev")


def run_seed():
    seed_challenges()
    seed_demo_user()
    print("Database seeded successfully.")
