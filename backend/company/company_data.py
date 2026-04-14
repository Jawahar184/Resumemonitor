from fastapi import APIRouter, Request, HTTPException
from database.db import db
import random
from datetime import datetime
from utils.email_utils import send_bulk_emails
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
    # Filter by company instead of global
    logs = list(db.email_logs.find({"posted_by": company_key}, {"_id": 0}).sort("_id", -1))
    return logs


@router.get("/job-matches/{job_id}")
def get_job_matches(request: Request, job_id: str):
    company_key = get_company_key(request)
    # Return all matched candidates for a specific job
    candidates = list(db.matches.find({"job_id": job_id, "posted_by": company_key}, {"_id": 0}))
    candidates.sort(key=lambda x: x.get("match_score", 0), reverse=True)
    return candidates


@router.post("/send-emails")
async def send_emails(request: Request, payload: dict):
    company_key = get_company_key(request)
    job_id = payload.get("job_id")
    min_score = payload.get("min_score", 50)
    subject = payload.get("subject", "Job Match Notification")
    body = payload.get("body", "You are a match for a job!")
    specific_email = payload.get("specific_email")
    
    if not job_id:
        raise HTTPException(status_code=400, detail="job_id is required")
        
    query = {"job_id": job_id, "posted_by": company_key, "match_score": {"$gte": min_score}}
    if specific_email:
        query["email"] = specific_email
        
    candidates = list(db.matches.find(query, {"_id": 0}))
    if not candidates:
        return {"message": "No candidates found matching criteria", "sent_count": 0}
        
    recipients = [c["email"] for c in candidates if c.get("email")]
    if not recipients:
        return {"message": "No valid email addresses found", "sent_count": 0}

        
    # Send email using fastapi-mail
    success = await send_bulk_emails(recipients, subject, body)
    
    if success:
        # Log success and update matches
        timestamp = datetime.now().strftime("%Y-%m-%d %I:%M %p")
        for email in recipients:
            db.matches.update_one({"job_id": job_id, "email": email}, {"$set": {"status": "Email Sent"}})
            db.email_logs.insert_one({
                "recipient": email,
                "subject": subject,
                "status": "Delivered",
                "timestamp": timestamp,
                "posted_by": company_key
            })
        return {"message": f"Successfully sent emails to {len(recipients)} candidates.", "sent_count": len(recipients)}
    else:
        # Log failure
        timestamp = datetime.now().strftime("%Y-%m-%d %I:%M %p")
        for email in recipients:
             db.email_logs.insert_one({
                "recipient": email,
                "subject": subject,
                "status": "Failed",
                "timestamp": timestamp,
                "posted_by": company_key
            })
        raise HTTPException(status_code=500, detail="Failed to send emails. Check your email configuration.")
