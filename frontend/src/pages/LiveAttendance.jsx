import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const LiveAttendance = () => {
    const webcamRef = useRef(null);
    const [logs, setLogs] = useState([]);
    const [isScanning, setIsScanning] = useState(false);
    const [lastScanTime, setLastScanTime] = useState(0);

    const scanFace = async () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) return;

            try {
                const response = await fetch(imageSrc);
                const blob = await response.blob();
                const file = new File([blob], "scan.jpg", { type: "image/jpeg" });
                const formData = new FormData();
                formData.append('file', file);

                const res = await axios.post('http://localhost:8000/api/attendance/mark', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (res.data.status === 'success') {
                    const newLog = {
                         ...res.data.student,
                         time: new Date().toLocaleTimeString(),
                         status: 'Marked'
                    };
                    setLogs(prev => [newLog, ...prev]);
                } else if (res.data.status === 'duplicate') {
                    // Optional: Show duplicate message briefly
                     console.log("Duplicate attendance");
                }
            } catch (error) {
                console.error("Scanning error", error);
            }
        }
    };

    useEffect(() => {
        let interval;
        if (isScanning) {
            interval = setInterval(() => {
                scanFace();
            }, 5000); // Scan every 5 seconds
        }
        return () => clearInterval(interval);
    }, [isScanning]);

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)]">
            {/* Camera Section */}
            <div className="w-full lg:w-2/3 h-full flex flex-col">
                <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-6 h-full flex flex-col relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                         <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isScanning ? 'bg-red-400' : 'bg-gray-400'}`}></span>
                              <span className={`relative inline-flex rounded-full h-3 w-3 ${isScanning ? 'bg-red-500' : 'bg-gray-500'}`}></span>
                            </span>
                            Live Scanner Feed
                        </h2>
                        <div className="bg-slate-900/50 px-3 py-1 rounded-full text-xs font-mono text-gray-400 border border-white/5">
                            Status: {isScanning ? 'ACTIVE' : 'IDLE'}
                        </div>
                    </div>
                    
                    <div className="relative flex-grow rounded-xl overflow-hidden bg-black border border-slate-700 shadow-inner group">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className="w-full h-full object-cover opacity-80"
                        />
                        
                        {/* Scanner Overlay UI */}
                        {isScanning && (
                            <div className="absolute inset-0 pointer-events-none">
                                {/* Corners */}
                                <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-blue-500/50 rounded-tl-xl"></div>
                                <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-blue-500/50 rounded-tr-xl"></div>
                                <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-blue-500/50 rounded-bl-xl"></div>
                                <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-blue-500/50 rounded-br-xl"></div>
                                
                                {/* Scanning Line */}
                                <div className="absolute inset-x-0 h-0.5 bg-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-scan-y top-1/2"></div>
                                
                                {/* Center Target */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/20 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={() => setIsScanning(!isScanning)}
                            className={`w-full max-w-sm py-4 rounded-xl font-bold text-white transition-all transform hover:scale-105 shadow-lg ${
                                isScanning 
                                ? 'bg-gradient-to-r from-red-600 to-pink-600 shadow-red-500/30' 
                                : 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/30'
                            }`}
                        >
                            {isScanning ? 'Stop Surveillance' : 'Initiate Scanning Protocol'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Logs Section */}
            <div className="w-full lg:w-1/3 h-full">
                <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl p-6 h-full flex flex-col">
                    <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-4">
                        Detection Logs
                    </h2>
                    <div className="overflow-y-auto flex-grow pr-2 scrollbar-thin scrollbar-thumb-slate-600">
                        {logs.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                                <div className="text-4xl opacity-20">📜</div>
                                <p>No detection events recorded.</p>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {logs.map((log, index) => (
                                    <li key={index} className="bg-slate-900/50 border border-white/5 rounded-xl p-4 flex justify-between items-center hover:bg-white/5 transition animate-fade-in-left">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                {log.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-200">{log.name}</p>
                                                <p className="text-xs text-blue-400 font-mono">ID: {log.student_id}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-xs font-mono text-gray-400">{log.time}</span>
                                            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 rounded-full border border-emerald-400/20">
                                                Verified
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveAttendance;
