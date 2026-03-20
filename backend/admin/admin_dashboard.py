from fastapi import APIRouter, Request
from database.db import db

router = APIRouter()

def get_admin_key(request: Request) -> str:
    email = request.headers.get("X-User-Email", "").strip()
    return email if email else "default_admin"

@router.get("/dashboard-stats")
def get_dashboard_stats(request: Request):
    # Global stats for Admin
    admin_key = get_admin_key(request)
    total_users = db.users.count_documents({"role": "User"})
    total_companies = db.users.count_documents({"role": "Company"})
    total_jobs = db.jobs.count_documents({})
    total_resumes = db.resumes.count_documents({})
    
    return {
        "total_users": total_users,
        "total_companies": total_companies,
        "total_jobs": total_jobs,
        "total_resumes": total_resumes
    }

@router.get("/all-users")
def get_all_users(request: Request):
    admin_key = get_admin_key(request)
    users = list(db.users.find({}, {"_id": 1, "name": 1, "email": 1, "role": 1}))
    return [
        {
            "id": str(u["_id"]),
            "name": u.get("name"),
            "email": u.get("email"),
            "role": u.get("role", "User")
        }
        for u in users
    ]
