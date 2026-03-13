from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from auth import login, register
from admin import post_job, admin_data
from user import upload_resume, user_data

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(login.router, prefix="/auth")
app.include_router(register.router, prefix="/auth")

app.include_router(post_job.router, prefix="/admin")
app.include_router(admin_data.router, prefix="/admin")

app.include_router(upload_resume.router, prefix="/user")
app.include_router(user_data.router, prefix="/user")