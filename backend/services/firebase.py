import firebase_admin
from firebase_admin import credentials, firestore, storage
import os

bucket_name = "your-app-id.appspot.com" # TODO: Replace with actual bucket name

def initialize_firebase():
    if not firebase_admin._apps:
        if os.path.exists("serviceAccountKey.json"):
            cred = credentials.Certificate("serviceAccountKey.json")
            firebase_admin.initialize_app(cred, {
                'storageBucket': bucket_name
            })
            print("Firebase initialized with service account.")
        else:
            print("ERROR: serviceAccountKey.json not found. Database operations will fail.")

def get_firestore_client():
    if not firebase_admin._apps:
        raise ValueError("Firebase not initialized. check backend logs for serviceAccountKey.json error.")
    return firestore.client()

def upload_image(file_obj, filename):
    bucket = storage.bucket()
    blob = bucket.blob(filename)
    blob.upload_from_file(file_obj)
    blob.make_public()
    return blob.public_url

def add_student_to_db(student_data):
    db = get_firestore_client()
    db.collection("students").add(student_data)

def log_attendance_to_db(attendance_data):
    db = get_firestore_client()
    db.collection("attendance").add(attendance_data)

