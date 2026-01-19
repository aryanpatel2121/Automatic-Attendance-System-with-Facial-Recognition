import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/admin/');
            setReports(res.data);
        } catch (error) {
            console.error("Error fetching reports", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                     <h3 className="text-2xl font-bold text-white">Attendance Register</h3>
                     <p className="text-sm text-gray-400">Total Records: {reports.length}</p>
                </div>
                <button 
                  onClick={fetchReports}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 group"
                >
                  <span className="group-hover:rotate-180 transition-transform duration-500">🔄</span>
                  Refresh
                </button>
            </div>
            
            <div className="bg-slate-900/50 rounded-xl overflow-hidden border border-white/5">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-400">Syncing with database...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/5">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-400 uppercase tracking-wider">Student Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-400 uppercase tracking-wider">ID Number</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-400 uppercase tracking-wider">Time Logged</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-blue-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {reports.map((report, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">{report.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-xs">
                                                {report.name.charAt(0)}
                                            </div>
                                            {report.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">{report.student_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                              {/* Handle Timestamp object from Firebase or formatted string */}
                                              {/* If it's a string, just display it. If it's undefined, current time. */}
                                            {report.timestamp?._seconds 
                                                ? new Date(report.timestamp._seconds * 1000).toLocaleTimeString() 
                                                : report.timestamp || "N/A"
                                            }
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                Present
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
