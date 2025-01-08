import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Routes, Route, useLocation } from 'react-router-dom';
import Home from './dashboard/Home';
import Events from './dashboard/Events';
import StudentList from './dashboard/StudentList';
import AlumniList from './dashboard/AlumniList';
import Chat from './dashboard/Chat';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const getActiveClass = (path) => {
    return location.pathname === path
      ? "text-gray-900 border-b-2 border-blue-500"
      : "text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">NIE Student Portal</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link 
                  to="/dashboard"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${getActiveClass('/dashboard')}`}
                >
                  Home
                </Link>
                <Link 
                  to="/dashboard/events"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${getActiveClass('/dashboard/events')}`}
                >
                  Events
                </Link>
                <Link 
                  to="/dashboard/students"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${getActiveClass('/dashboard/students')}`}
                >
                  Students
                </Link>
                <Link 
                  to="/dashboard/alumni"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${getActiveClass('/dashboard/alumni')}`}
                >
                  Alumni
                </Link>
                <Link 
                  to="/dashboard/chat"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${getActiveClass('/dashboard/chat')}`}
                >
                  Connect
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  navigate('/login');
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/alumni" element={<AlumniList />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
