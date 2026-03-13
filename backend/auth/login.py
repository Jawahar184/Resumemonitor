from fastapi import APIRouter
from database.db import db

router = APIRouter()

@router.post("/login")
def login(data: dict):
    user = db.users.find_one({
        "email": data["email"],
        "password": data["password"]
    })

    if user:
        return {
            "message": "Login success",
            "name":    user.get("name", ""),
            "email":   user.get("email", ""),
            "role":    user.get("role", "User"),
        }

    return {"message": "Invalid credentials"}