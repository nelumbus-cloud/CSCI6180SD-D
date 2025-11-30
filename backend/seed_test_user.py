"""
Add test user to database for testing
Run from backend directory: python seed_test_user.py
"""
import sys
sys.path.insert(0, './app')

from app.database import SessionLocal, engine
from app.models import Base, User
from app.auth import pwd_context
from datetime import datetime

# Create all tables
Base.metadata.create_all(bind=engine)
session = SessionLocal()

try:
    # Check if test user already exists
    existing_user = session.query(User).filter(User.username == "testuser").first()
    if existing_user:
        print("Test user 'testuser' already exists")
    else:
        # Create test user
        test_user = User(
            username="testuser",
            contact_email="test@example.com",
            hashed_password=pwd_context.hash("password123"),
            role="user",
            is_active=True
        )
        session.add(test_user)
        session.commit()
        print(f"✓ Test user created successfully!")
        print(f"  Username: testuser")
        print(f"  Password: password123")
        print(f"  Email: test@example.com")
except Exception as e:
    print(f"Error creating test user: {e}")
    session.rollback()
finally:
    session.close()
