from fastapi import APIRouter
from database.db import db

router = APIRouter()

@router.post("/login")
def login(data: dict):
    requested_role = data.get("role")
    
    # 1. Look for an exact match (Email + Password + Role)
    query = {
        "email": data.get("email"),
        "password": data.get("password")
    }
    if requested_role:
        query["role"] = requested_role

    user = db.users.find_one(query)

    if user:
        return {
            "message": "Login success",
            "name":    user.get("name", ""),
            "email":   user.get("email", ""),
            "role":    user.get("role", "User"),
        }

    # 2. If no exact match, see if they just got the role wrong
    if requested_role:
        wrong_role_user = db.users.find_one({
            "email": data.get("email"),
            "password": data.get("password")
        })
        if wrong_role_user:
            return {"message": "Invalid role"}

    return {"message": "Invalid credentials"}