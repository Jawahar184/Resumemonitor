from fastapi import APIRouter, Request
from database.db import db
import re

router = APIRouter()


def get_admin_key(request: Request) -> str:
    email = request.headers.get("X-User-Email", "").strip()
    return email if email else "default_admin"


# ─── Matching Helpers ─────────────────────────────────────────────────────────

def _normalise(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", s.lower())


def _skill_match_score(job_skills: list, resume_skills: list) -> float:
    """
    Returns % of job-required skills found in the resume (0-100).
    Comparison is normalised (removes dots, spaces, case) so
    'React.js' == 'reactjs' == 'React JS'.
    """
    if not job_skills:
        return 100.0
    job_norm    = {_normalise(s) for s in job_skills}
    resume_norm = {_normalise(s) for s in resume_skills}
    matched = job_norm & resume_norm
    return round(len(matched) / len(job_norm) * 100, 1)


def _cgpa_ok(resume_cgpa: str, min_cgpa: float) -> bool:
    """Resume CGPA is stored as a string; safely convert and compare."""
    if not min_cgpa:
        return True
    try:
        val = float(str(resume_cgpa).strip())
        # Handle 10-point scale: if val > 10 it's percentage, skip
        if val > 10:
            return True          # can't compare percentage to 0-4 scale reliably
        return val >= min_cgpa
    except (ValueError, TypeError):
        return True              # if CGPA is unparseable, don't disqualify


# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.post("/post-job")
def post_job(request: Request, job: dict):
    admin_key = get_admin_key(request)
    job["posted_by"] = admin_key

    # Parse required skills from comma-separated string into a clean list
    raw_skills  = job.get("skills", "")
    job_skills  = [s.strip() for s in str(raw_skills).split(",") if s.strip()]
    job["skills_list"] = job_skills          # store parsed list for matching

    min_cgpa = float(job.get("min_cgpa") or 0)

    result = db.jobs.insert_one(job)
    job_id = str(result.inserted_id)

    # ── Real matching against resumes collection ──────────────────────────────
    resumes = list(db.resumes.find({}, {"_id": 0}))
    matched_candidates = []

    for resume in resumes:
        resume_skills = resume.get("skills", [])
        resume_cgpa   = resume.get("cgpa", "")
        user_email    = resume.get("user_key", "")

        # Skill match score
        score = _skill_match_score(job_skills, resume_skills)
        if score < 30:           # below 30 % skill overlap → skip
            continue

        # CGPA gate
        if not _cgpa_ok(resume_cgpa, min_cgpa):
            continue

        matched_candidates.append({
            "job_id":       job_id,
            "name":         resume.get("name", user_email),
            "email":        user_email,
            "match_score":  score,
            "cgpa":         resume_cgpa or "N/A",
            "skills":       resume_skills[:6],
            "status":       "Email Sent" if score >= 70 else "Pending",
            "posted_by":    admin_key,
        })

    # Sort by match score descending
    matched_candidates.sort(key=lambda x: x["match_score"], reverse=True)

    # Persist matched candidates so the dashboard can read them
    for c in matched_candidates:
        db.matches.update_one(
            {"job_id": job_id, "email": c["email"]},
            {"$set": c},
            upsert=True,
        )

    return {
        "message": f"Job Posted & {len(matched_candidates)} Candidates Matched 🎯",
        "job_id":  job_id,
        "matches": matched_candidates,
    }


@router.get("/dashboard-stats")
def get_dashboard_stats(request: Request):
    admin_key = get_admin_key(request)

    open_vacancies  = db.jobs.count_documents({"posted_by": admin_key})
    resumes_scanned = db.resumes.count_documents({})
    top_matches     = db.matches.count_documents({"posted_by": admin_key, "match_score": {"$gte": 70}})
    alerts_sent     = db.matches.count_documents({"posted_by": admin_key, "status": "Email Sent"})

    return {
        "open_vacancies":  open_vacancies,
        "resumes_scanned": resumes_scanned,
        "top_matches":     top_matches,
        "alerts_sent":     alerts_sent,
    }


@router.get("/eligible-candidates")
def get_eligible_candidates(request: Request):
    """Return all matched candidates for this admin's jobs, newest first."""
    admin_key = get_admin_key(request)
    candidates = list(db.matches.find({"posted_by": admin_key}, {"_id": 0}))
    candidates.sort(key=lambda x: x.get("match_score", 0), reverse=True)
    return candidates