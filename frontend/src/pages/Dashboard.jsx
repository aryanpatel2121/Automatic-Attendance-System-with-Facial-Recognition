import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className="space-y-8">
            <div className="text-center sm:text-left">
                <h3 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                    Admin Dashboard
                </h3>
                <p className="mt-2 max-w-2xl text-lg text-gray-400">
                    Welcome to the Next-Gen Cloud Attendance System. Monitor, Manage, and Secure.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1 */}
                <Link to="/register" className="group relative block p-8 bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-2xl hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                        <div className="h-12 w-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
                            👤
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">Register Student</h4>
                        <p className="text-gray-400">Onboard new students with instant facial embedding generation.</p>
                    </div>
                </Link>

                {/* Card 2 */}
                <Link to="/attendance" className="group relative block p-8 bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-2xl hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-500/20">
                     <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                         <div className="h-12 w-12 bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
                            📷
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">Live Attendance</h4>
                        <p className="text-gray-400">Real-time facial recognition and automated attendance logging.</p>
                    </div>
                </Link>

                {/* Card 3 */}
                <Link to="/reports" className="group relative block p-8 bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-2xl hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20">
                     <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                         <div className="h-12 w-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
                            📊
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">View Reports</h4>
                        <p className="text-gray-400">Comprehensive attendance analytics and data export.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
