from fastapi import APIRouter, HTTPException
from database.db import db

router = APIRouter()

@router.post("/register")
def register(data: dict):
    if db.users.find_one({"email": data.get("email")}):
        raise HTTPException(status_code=400, detail="Email already registered")

    db.users.insert_one(data)

    return {"message": "User Registered"}