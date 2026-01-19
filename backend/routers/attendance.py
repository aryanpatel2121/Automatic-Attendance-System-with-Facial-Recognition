from fastapi import APIRouter, File, UploadFile, HTTPException
from services import face_recognition, database
import numpy as np
import cv2
from datetime import date
import json

router = APIRouter()

@router.post("/mark")
async def mark_attendance(file: UploadFile = File(...)):
    try:
        # Read and decode image
        file_bytes = await file.read()
        nparr = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Fetch known faces
        students_db = database.get_all_students()
        known_faces = []
        for s in students_db:
             # embedding is stored as string in sqlite, need to parse back to list
             if s["embedding"]:
                 s["embedding"] = json.loads(s["embedding"])
                 known_faces.append(s)
        
        if not known_faces:
             raise HTTPException(status_code=400, detail="No students registered.")

        # Recognize face
        match = face_recognition.recognize_face(img, known_faces)
        
        if match:
            student_id = match["student_id"]
            name = match["name"]
            
            # Check for duplicate
            duplicates = database.get_attendance_today(student_id)
            
            if duplicates:
                return {
                    "status": "duplicate",
                    "message": f"Attendance already marked for {name} today.",
                    "student": {"name": name, "student_id": student_id}
                }

            # Log attendance
            log_data = {
                "student_id": student_id,
                "name": name,
                "date": str(date.today())
            }
            database.log_attendance(log_data)
            
            return {
                "status": "success",
                "message": f"Attendance marked for {name}",
                "student": {"name": name, "student_id": student_id}
            }
        
        else:
             raise HTTPException(status_code=404, detail="Face not recognized.")

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

