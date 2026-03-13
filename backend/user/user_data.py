from fastapi import APIRouter, Request
from database.db import db

router = APIRouter()

@router.get("/resume")
def get_user_resume(request: Request):
    user_key = request.headers.get("X-User-Email", "default_user").strip()
    resume = db.resumes.find_one({"user_key": user_key}, {"_id": 0})
    if resume:
        return resume
    return {"message": "No resume data found. Please upload your resume."}

@router.put("/resume")
def update_user_resume(request: Request, data: dict):
    user_key = request.headers.get("X-User-Email", "default_user").strip()
    allowed = {"name", "email", "phone", "cgpa", "skills", "education", "experience"}
    update_fields = {k: v for k, v in data.items() if k in allowed}
    if not update_fields:
        return {"message": "No valid fields to update."}
    db.resumes.update_one(
        {"user_key": user_key},
        {"$set": update_fields},
        upsert=True,
    )
    return {"message": "Resume updated successfully ✅"}

@router.get("/alerts")
def get_user_alerts():
    # Mocking alerts related to a candidate's activity
    return [
        {"id": 1, "type": "Match", "message": "You have a 92% match with 'React Developer' at TechCorp.", "date": "2 hours ago"},
        {"id": 2, "type": "System", "message": "Resume parsed successfully. System verified CGPA is 3.85.", "date": "1 day ago"}
    ]

@router.get("/saved-jobs")
def get_saved_jobs():
    # Return mock saved jobs (In reality, search db.jobs using job IDs linked to user)
    return [
        {"id": "101", "title": "Frontend Engineer", "company": "Innovate LLC", "match": 88},
        {"id": "102", "title": "Full Stack Dev", "company": "Global Systems", "match": 75}
    ]

@router.get("/account")
def get_user_account():
    user = db.users.find_one({"role": "User"})
    if user:
        return {
            "name": user.get("name"),
            "email": user.get("email"),
            "status": "Active Profile",
            "member_since": "2024"
        }
    return {"message": "User not found"}
