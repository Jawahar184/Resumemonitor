from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from database.db import db
from user.parse_resume import extract_text_from_pdf, extract_text_from_docx, parse_resume
from datetime import datetime

router = APIRouter()

MAX_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


def get_user_key(request: Request) -> str:
    """Use the email from the X-User-Email header as the unique user key."""
    email = request.headers.get("X-User-Email", "").strip()
    return email if email else "default_user"


@router.post("/upload-resume")
async def upload_resume(request: Request, file: UploadFile = File(...)):
    user_key = get_user_key(request)

    # ── Validate file type ──────────────────────────────────────────────────
    filename = file.filename or ""
    is_pdf  = filename.lower().endswith(".pdf")  or file.content_type == "application/pdf"
    is_docx = (filename.lower().endswith(".docx") or filename.lower().endswith(".doc")
               or file.content_type in (
                   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                   "application/msword",
               ))

    if not (is_pdf or is_docx):
        raise HTTPException(status_code=400, detail="Unsupported file type. Please upload a PDF or DOCX file.")

    # ── Read & size-check ───────────────────────────────────────────────────
    file_bytes = await file.read()
    if len(file_bytes) > MAX_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File exceeds the 5 MB limit.")

    # ── Extract text ────────────────────────────────────────────────────────
    try:
        raw_text = extract_text_from_pdf(file_bytes) if is_pdf else extract_text_from_docx(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not read file content: {str(e)}")

    if not raw_text.strip():
        raise HTTPException(status_code=422, detail="No text could be extracted from the file.")

    # ── Parse & store ───────────────────────────────────────────────────────
    parsed = parse_resume(raw_text)
    parsed["filename"]    = filename
    parsed["uploaded_at"] = datetime.utcnow().isoformat()
    parsed["user_key"]    = user_key

    db.resumes.update_one(
        {"user_key": user_key},
        {"$set": parsed},
        upsert=True,
    )

    return {
        "message": "Resume uploaded and parsed successfully! 🎉",
        "parsed": parsed,
    }