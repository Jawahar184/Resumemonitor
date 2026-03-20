from fastapi import APIRouter, Request
from database.db import db
import random

router = APIRouter()


def get_company_key(request: Request) -> str:
    email = request.headers.get("X-User-Email", "").strip()
    return email if email else "default_company"


@router.get("/jobs")
def get_company_jobs(request: Request):
    company_key = get_company_key(request)
    # Return only jobs posted by this company
    jobs = list(db.jobs.find({"posted_by": company_key}, {"_id": 1, "title": 1, "skills": 1, "job_type": 1}))
    return [
        {"id": str(j["_id"]), "title": j.get("title"), "skills": j.get("skills"), "job_type": j.get("job_type")}
        for j in jobs
    ]


@router.get("/scans")
def get_resume_scans(request: Request):
    company_key = get_company_key(request)
    # Show all user resumes uploaded (shared across companies — candidates are global)
    users = list(db.users.find({"role": "User"}, {"_id": 1, "name": 1, "email": 1}))
    return [
        {
            "id":           str(u["_id"]),
            "name":         u.get("name"),
            "email":        u.get("email"),
            "avg_match":    random.randint(40, 95),
            "scanned_date": "Today"
        }
        for u in users
    ]


@router.get("/emails")
def get_email_logs(request: Request):
    company_key = get_company_key(request)
    # In a full system this would filter by company. Keeping global for now.
    return [
        {"id": 1, "recipient": "sarah@example.com",  "subject": "Job Match Alert: React Dev",         "status": "Delivered", "timestamp": "10:30 AM"},
        {"id": 2, "recipient": "david@example.com",  "subject": "Job Match Alert: UI Designer",       "status": "Failed",    "timestamp": "09:15 AM"},
        {"id": 3, "recipient": "emily@example.com",  "subject": "System Verification Complete",        "status": "Delivered", "timestamp": "Yesterday"}
    ]
