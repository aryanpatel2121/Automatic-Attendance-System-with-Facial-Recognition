# Automatic Attendance System with Facial Recognition

A full-stack application for automated student attendance tracking using facial recognition technology. This system consists of a FastAPI backend and a modern React frontend.

## 🚀 Features

- **Automated Attendance**: Logs attendance automatically using facial recognition.
- **Student Management**: Register students with their photos.
- **Real-time Logs**: View attendance logs in real-time.
- **Admin Dashboard**: Access reports and manage the system.

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: SQLite (Local)
- **Computer Vision**: OpenCV, DeepFace (FaceNet model)
- **ML/AI**: TensorFlow/Keras (via DeepFace)

### Frontend
- **Framework**: React (Vite)
- **Styling**: TailwindCSS
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Camera**: react-webcam

## 📋 Prerequisites

- **Python**: 3.9 or higher
- **Node.js**: 18.0 or higher
- **Webcam**: Required for live attendance and registration.

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Backend Setup
Navigate to the backend directory and set up the Python environment.

```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies.

```bash
cd ../frontend
npm install
```

## 🚀 Usage

### Start the Backend
From the `backend` directory with your virtual environment activated:

```bash
uvicorn main:app --reload
```
The backend API will run at `http://127.0.0.1:8000`.

### Start the Frontend
From the `frontend` directory:

```bash
npm run dev
```
The application will launch in your browser (typically at `http://localhost:5173`).

## 🧠 Model Information
This project uses **DeepFace** with the **FaceNet** model. 
- On the first run, the system will automatically download the necessary pre-trained model weights. This may take a few minutes depending on your internet connection.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
