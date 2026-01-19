import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const RegisterStudent = () => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
    }, [webcamRef]);

    const retake = () => {
        setImgSrc(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imgSrc) return;
        setLoading(true);
        setMessage('');

        try {
            // Convert base64 to blob
            const response = await fetch(imgSrc);
            const blob = await response.blob();
            const file = new File([blob], "photo.jpg", { type: "image/jpeg" });

            const formData = new FormData();
            formData.append('name', name);
            formData.append('student_id', studentId);
            formData.append('file', file);

            // TODO: Use env var for URL
            await axios.post('http://localhost:8000/api/students/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Student registered successfully!');
            setName('');
            setStudentId('');
            setImgSrc(null);
        } catch (error) {
            console.error(error);
            setMessage('Error registering student. ' + (error.response?.data?.detail || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-8 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Register New Student
            </h2>
            {message && (
                <div className={`p-4 mb-6 rounded-lg border flex items-center gap-3 ${
                    message.includes('success') 
                    ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                    <span>{message.includes('success') ? '✅' : '⚠️'}</span>
                    {message}
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Capture Photo</label>
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border-2 border-slate-700 group">
                        {imgSrc ? (
                            <div className="relative">
                                <img src={imgSrc} alt="Captured" className="w-full h-auto" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button onClick={retake} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-lg backdrop-blur-sm transition">
                                        Retake Photo
                                     </button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    className="w-full"
                                />
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                                    <button
                                        onClick={capture}
                                        className="bg-blue-600/90 text-white p-4 rounded-full shadow-lg hover:bg-blue-500 hover:scale-105 transition-all transform border-2 border-white/20"
                                    >
                                        📷 Capture
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 text-center">Ensure good lighting and face the camera directly.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6 lg:mt-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter student name"
                            className="mt-2 block w-full bg-slate-900/50 border border-slate-700 rounded-xl shadow-inner text-white p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Student ID</label>
                        <input
                            type="text"
                            required
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                             placeholder="e.g. STU-12345"
                            className="mt-2 block w-full bg-slate-900/50 border border-slate-700 rounded-xl shadow-inner text-white p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-600"
                        />
                    </div>
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading || !imgSrc}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Registering...
                                </span>
                            ) : 'Complete Registration'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterStudent;
