from backend.app.database import SessionLocal, init_db
from backend.app.models import User, JobApplication
from passlib.hash import bcrypt
from datetime import datetime, timedelta

init_db()
session = SessionLocal()

# Clear existing data
session.query(JobApplication).delete()
session.query(User).delete()
session.commit()

# Create users
user1 = User(
    email="alice@example.com",
    password_hash=bcrypt.hash("password123"),
    name="Alice Smith"
)
user2 = User(
    email="bob@example.com",
    password_hash=bcrypt.hash("password456"),
    name="Bob Johnson"
)
session.add_all([user1, user2])
session.commit()

# Create job applications for user1
jobs_user1 = [
    JobApplication(
        user_id=user1.id,
        job_title="Software Engineer, Full-Stack",
        company_name="Apex Omnitools",
        location="New York City, New York",
        salary_min=80000,
        salary_max=150000,
        salary_currency="USD",
        employment_type="Full Time",
        remote=True,
        status="In Progress",
        applied_date=datetime.utcnow() - timedelta(days=10),
        interview_date=datetime.utcnow() + timedelta(days=2),
        notes="salarian-owned omni-tool developer and producer\n2+ years of professional software engineering\nExperience in Angular, C#, and .NET Core Web API development"
    ),
    JobApplication(
        user_id=user1.id,
        job_title="Backend Developer",
        company_name="Acme Inc.",
        location="Remote",
        salary_min=90000,
        salary_max=130000,
        salary_currency="USD",
        employment_type="Full Time",
        remote=True,
        status="Interview",
        applied_date=datetime.utcnow() - timedelta(days=20),
        interview_date=datetime.utcnow() + timedelta(days=1),
        notes="Interview scheduled for Sept 5, 12:15 PM"
    ),
]

# Create job applications for user2
jobs_user2 = [
    JobApplication(
        user_id=user2.id,
        job_title="Frontend Developer",
        company_name="BetaSoft",
        location="San Francisco, CA",
        salary_min=95000,
        salary_max=140000,
        salary_currency="USD",
        employment_type="Full Time",
        remote=False,
        status="Applied",
        applied_date=datetime.utcnow() - timedelta(days=5),
        notes="React, TypeScript, UI/UX focus"
    ),
]

session.add_all(jobs_user1 + jobs_user2)
session.commit()
session.close()
print("Seed data inserted.")
