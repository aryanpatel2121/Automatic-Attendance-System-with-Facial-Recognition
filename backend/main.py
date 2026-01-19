from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import attendance, students, admin

from services.database import initialize_db

app = FastAPI(title="Cloud Attendance System")

@app.on_event("startup")
async def startup_event():
    initialize_db()


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(students.router, prefix="/api/students", tags=["Students"])
app.include_router(attendance.router, prefix="/api/attendance", tags=["Attendance"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

@app.get("/")
def root():
    return {"message": "Cloud Attendance System API is running"}
