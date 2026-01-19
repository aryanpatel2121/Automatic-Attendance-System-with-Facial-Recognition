# Face recognition service using DeepFace
from deepface import DeepFace
import numpy as np

MODEL_NAME = "Facenet"

def get_embedding(img_path):
    """
    Extracts facial embedding from an image path.
    Returns the first face's embedding as a list of floats.
    """
    try:
        # result is a list of dicts: [{'embedding': [], 'facial_area': ...}]
        result = DeepFace.represent(img_path=img_path, model_name=MODEL_NAME, enforce_detection=True)
        if result:
            return result[0]["embedding"]
        return None
    except Exception as e:
        print(f"Error in face embedding: {e}")
        return None

def calculate_distance(embedding1, embedding2):
    """
    Calculates Euclidean distance between two embeddings.
    """
    a = np.array(embedding1)
    b = np.array(embedding2)
    return np.linalg.norm(a - b)

def recognize_face(img_path, known_faces):
    """
    Identifies a face from img_path against a list of known_faces.
    known_faces: List of dicts {'id': '...', 'name': '...', 'embedding': [...]}
    Returns the match or None.
    """
    embedding = get_embedding(img_path)
    if not embedding:
        return None

    min_dist = float("inf")
    match = None
    
    # FaceNet L2 threshold is typically around 10.0, but DeepFace might normalize differently depending on version.
    # DeepFace default for FaceNet L2 is 0.40 if normalized, or 10 if not.
    # We will use a conservative threshold.
    THRESHOLD = 10.0 

    for face in known_faces:
        dist = calculate_distance(embedding, face["embedding"])
        if dist < min_dist:
            min_dist = dist
            match = face
            
    if min_dist < THRESHOLD:
        return match
    
    return None

