from fastapi import APIRouter, HTTPException
from database.db import db
import random
from utils.email_utils import send_otp_email
from datetime import datetime, timedelta

router = APIRouter()

@router.post("/send-otp")
async def send_register_otp(data: dict):
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
        
    if db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")
        
    otp = str(random.randint(100000, 999999))
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    db.otps.update_one(
        {"email": email},
        {"$set": {"otp": otp, "expires_at": expires_at}},
        upsert=True
    )
    
    success = await send_otp_email(email, otp)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send OTP email")
        
    return {"message": "OTP sent successfully"}

@router.post("/register")
def register(data: dict):
    email = data.get("email")
    provided_otp = data.get("otp")
    
    if not email or not provided_otp:
        raise HTTPException(status_code=400, detail="Email and OTP are required")

    if db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    # Validate OTP
    otp_record = db.otps.find_one({"email": email})
    if not otp_record:
        raise HTTPException(status_code=400, detail="No OTP requested for this email")
        
    if otp_record.get("expires_at") < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP expired. Please request a new one.")
        
    if otp_record.get("otp") != provided_otp.strip():
        raise HTTPException(status_code=400, detail="Invalid OTP code")

    # Clean up OTP record and create user
    db.otps.delete_one({"email": email})
    
    # Remove the OTP from the dict before it's saved to the general user block
    if "otp" in data:
        del data["otp"]
        
    db.users.insert_one(data)

    return {"message": "User Registered with Verified Email"}