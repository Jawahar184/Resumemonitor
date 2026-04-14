from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

from auth import login, register
from company import post_job, company_data
from admin import admin_dashboard
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

app.include_router(post_job.router, prefix="/company")
app.include_router(company_data.router, prefix="/company")

app.include_router(admin_dashboard.router, prefix="/admin")

app.include_router(upload_resume.router, prefix="/user")
app.include_router(user_data.router, prefix="/user")

@app.get('/favicon.ico', include_in_schema=False)
async def favicon():
    return Response(content=b"", media_type="image/x-icon")