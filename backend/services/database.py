import sqlite3
import os
import shutil
from datetime import datetime

DB_NAME = "attendance_system.db"
UPLOAD_DIR = "uploads"

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def initialize_db():
    conn = get_db_connection()
    c = conn.cursor()
    
    # Create students table
    c.execute('''
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            student_id TEXT UNIQUE NOT NULL,
            photo_path TEXT NOT NULL,
            embedding TEXT NOT NULL, -- JSON string of embedding
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create attendance table
    c.execute('''
        CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT NOT NULL,
            name TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            date TEXT NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()
    print("Database initialized (SQLite).")

def save_file_locally(file_obj, filename):
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file_obj, buffer)
    # Return absolute path or relative path accessible by frontend?
    # Ideally serve via StaticFiles. For now, just path.
    return file_path

# Helpers for Students
def add_student(student_data):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute(
        "INSERT INTO students (name, student_id, photo_path, embedding) VALUES (?, ?, ?, ?)",
        (student_data["name"], student_data["student_id"], student_data["photo_url"], str(student_data["embedding"])) # embedding stored as string representation for simplicity in SQLite
    )
    conn.commit()
    conn.close()

def get_all_students():
    conn = get_db_connection()
    students = conn.execute("SELECT * FROM students").fetchall()
    conn.close()
    # Convert Row objects to dicts
    return [dict(ix) for ix in students]

# Helpers for Attendance
def get_attendance_today(student_id):
    today = datetime.now().strftime("%Y-%m-%d")
    conn = get_db_connection()
    logs = conn.execute(
        "SELECT * FROM attendance WHERE student_id = ? AND date = ?",
        (student_id, today)
    ).fetchall()
    conn.close()
    return [dict(ix) for ix in logs]

def log_attendance(data):
    conn = get_db_connection()
    conn.execute(
        "INSERT INTO attendance (student_id, name, date) VALUES (?, ?, ?)",
        (data["student_id"], data["name"], data["date"])
    )
    conn.commit()
    conn.close()

def get_all_reports():
    conn = get_db_connection()
    reports = conn.execute("SELECT * FROM attendance ORDER BY timestamp DESC").fetchall()
    conn.close()
    return [dict(ix) for ix in reports]
