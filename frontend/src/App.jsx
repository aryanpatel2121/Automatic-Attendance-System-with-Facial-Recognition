import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import RegisterStudent from './pages/RegisterStudent';
import LiveAttendance from './pages/LiveAttendance';
import Reports from './pages/Reports';

function NavLink({ to, children }) {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link 
            to={to} 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive 
                ? 'bg-blue-600 shadow-lg shadow-blue-500/50 text-white transform scale-105' 
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
        >
            {children}
        </Link>
    );
}

function AppContent() {
    return (
        <div className="min-h-screen bg-transparent text-gray-100 flex flex-col font-sans">
             {/* Glassmorphism Navbar */}
            <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/70 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                             <div className="h-8 w-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <span className="text-white font-bold text-lg">A</span>
                             </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                FaceAttend
                            </span>
                        </div>
                        <div className="hidden sm:flex sm:space-x-4">
                            <NavLink to="/">Dashboard</NavLink>
                            <NavLink to="/register">Register</NavLink>
                            <NavLink to="/attendance">Live Scan</NavLink>
                            <NavLink to="/reports">Reports</NavLink>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-fade-in-up">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/register" element={<RegisterStudent />} />
                        <Route path="/attendance" element={<LiveAttendance />} />
                        <Route path="/reports" element={<Reports />} />
                    </Routes>
                </div>
            </main>
            
            <footer className="border-t border-white/10 mt-auto bg-slate-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto py-6 px-4 flex justify-between items-center text-sm text-gray-500">
                     <p>&copy; 2024 FaceAttend System</p>
                     <p>Powered by DeepFace & React</p>
                </div>
            </footer>
        </div>
    );
}

function App() {
  return (
    <Router>
        <AppContent />
    </Router>
  );
}

export default App;
