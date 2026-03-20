import sys
import os

# Ensure backend logic connects
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from database.db import db

def seed_users():
    print("Seeding users...")
    
    # Insert an admin
    if not db.users.find_one({"email": "admin@example.com"}):
        db.users.insert_one({"name": "Super Admin", "email": "admin@example.com", "password": "admin", "role": "Admin"})
        print("Inserted Admin: admin@example.com / admin")

    # Insert a company
    if not db.users.find_one({"email": "company@example.com"}):
        db.users.insert_one({"name": "Tech Corp", "email": "company@example.com", "password": "company", "role": "Company"})
        print("Inserted Company: company@example.com / company")
        
    # Insert a user
    if not db.users.find_one({"email": "user@example.com"}):
        db.users.insert_one({"name": "John Doe", "email": "user@example.com", "password": "user", "role": "User"})
        print("Inserted User: user@example.com / user")
        
    print("Seeding complete.")

if __name__ == "__main__":
    seed_users()
