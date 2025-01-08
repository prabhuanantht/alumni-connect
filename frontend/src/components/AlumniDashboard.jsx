import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Routes, Route, useLocation } from 'react-router-dom';
import Events from './dashboard/Events';
import StudentList from './dashboard/StudentList';
import Chat from './dashboard/Chat';
import Profile from './dashboard/Profile';
import AlumniList from './dashboard/AlumniList';

const AlumniDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      // Fetch user data
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData?.role !== 'alumni') {
        navigate('/dashboard');
      }
      setUser(userData);
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
                <h1 className="text-2xl font-bold text-gray-900">NIE Alumni Portal</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link 
                  to="/alumni-dashboard"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${getActiveClass('/alumni-dashboard')}`}
                >
                  Home
                </Link>
                <Link 
                  to="/alumni-dashboard/events"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${getActiveClass('/alumni-dashboard/events')}`}
                >
                  Events
                </Link>
                <Link 
                  to="/alumni-dashboard/alumni"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${getActiveClass('/alumni-dashboard/alumni')}`}
                >
                  Alumni Network
                </Link>
                <Link 
                  to="/alumni-dashboard/students"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${getActiveClass('/alumni-dashboard/students')}`}
                >
                  Connect with Students
                </Link>
                <Link 
                  to="/alumni-dashboard/chat"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${getActiveClass('/alumni-dashboard/chat')}`}
                >
                  Messages
                </Link>
                <Link 
                  to="/alumni-dashboard/profile"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${getActiveClass('/alumni-dashboard/profile')}`}
                >
                  My Profile
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
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
          <Route path="/" element={<AlumniHome user={user} />} />
          <Route path="/events" element={<Events />} />
          <Route path="/alumni" element={<AlumniList />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

// Alumni Home Component
const AlumniHome = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome Back, {user?.name}!</h2>
        <p className="text-gray-600">
          Thank you for being part of the NIE alumni community. Your experience and insights are valuable to our current students.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Alumni Network</h3>
          <p className="text-gray-600 mb-4">
            Connect with fellow alumni and expand your professional network.
          </p>
          <Link
            to="/alumni-dashboard/alumni"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Alumni →
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect with Students</h3>
          <p className="text-gray-600 mb-4">
            Share your experience and guide current students in their career journey.
          </p>
          <Link
            to="/alumni-dashboard/students"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Students →
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Events</h3>
          <p className="text-gray-600 mb-4">
            Stay updated with college events and alumni meetups.
          </p>
          <Link
            to="/alumni-dashboard/events"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Events →
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Messages</h3>
          <p className="text-gray-600 mb-4">
            Check your messages from students and other alumni.
          </p>
          <Link
            to="/alumni-dashboard/chat"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Messages →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;
