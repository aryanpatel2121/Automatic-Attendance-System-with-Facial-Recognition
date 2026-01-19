from fastapi import APIRouter, HTTPException
from services import database

router = APIRouter()

@router.get("/")
def get_reports():
    try:
        return database.get_all_reports()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

