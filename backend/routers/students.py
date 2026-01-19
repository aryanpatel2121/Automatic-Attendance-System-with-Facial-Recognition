from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from services import face_recognition, database
import numpy as np
import cv2
import uuid
import tempfile
import os
import json

router = APIRouter()

@router.post("/register")
async def register_student(
    name: str = Form(...),
    student_id: str = Form(...),
    file: UploadFile = File(...)
):
    # Read image file
    try:
        file_bytes = await file.read()
        # Convert to numpy array for DeepFace
        nparr = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Get embedding
        embedding = face_recognition.get_embedding(img)
        
        if not embedding:
            raise HTTPException(status_code=400, detail="No face detected in the image.")

        # Save image locally
        # We need to reset file cursor or use bytes
        file.file.seek(0)
        filename = f"{student_id}_{uuid.uuid4()}.jpg"
        # Save to backend/uploads
        file_path = database.save_file_locally(file.file, filename)
        
        # In a real app we would serve this via static files. 
        # For this MVP, we store the local path. Front end won't be able to see it unless we serve it.
        # But for registration we usually just need it for debug/logging.
        
        student_data = {
            "name": name,
            "student_id": student_id,
            "embedding": embedding, # This will be stringified in database.py
            "photo_url": file_path
        }
        
        database.add_student(student_data)
        
        return {"message": "Student registered successfully", "student_id": student_id}

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
def get_students():
    try:
        students = database.get_all_students()
        # We don't want to send back the massive embedding string usually
        for s in students:
            if "embedding" in s:
                del s["embedding"]
        return students
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

