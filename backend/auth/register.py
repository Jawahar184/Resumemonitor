from fastapi import APIRouter
from database.db import db

router = APIRouter()

@router.post("/register")
def register(data: dict):

    db.users.insert_one(data)

    return {"message": "User Registered"}