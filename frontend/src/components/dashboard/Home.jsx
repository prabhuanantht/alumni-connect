import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="relative h-[600px] -mt-6 -mx-8">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in transform transition-all duration-500 hover:scale-105">
            Connect, Learn, and Grow Together
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl opacity-90 animate-slide-up">
            Join our vibrant community of alumni and students to share experiences, find mentorship, and explore opportunities.
          </p>
          <div className="flex space-x-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link
              to="/dashboard/events"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Get Started
            </Link>
            <Link
              to="/dashboard/alumni"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Why Join Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
          Why Join AlumniConnect?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Mentorship Programs */}
          <div className="text-center group animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="mb-6 transform transition-transform duration-500 group-hover:scale-110">
              <div className="w-20 h-20 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Mentorship Programs</h3>
            <p className="text-gray-600">Connect with experienced alumni who can guide you through your career journey.</p>
          </div>

          {/* Exclusive Events */}
          <div className="text-center group animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="mb-6 transform transition-transform duration-500 group-hover:scale-110">
              <div className="w-20 h-20 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Exclusive Events</h3>
            <p className="text-gray-600">Participate in networking events, workshops, and professional development sessions.</p>
          </div>

          {/* Job Opportunities */}
          <div className="text-center group animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="mb-6 transform transition-transform duration-500 group-hover:scale-110">
              <div className="w-20 h-20 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Job Opportunities</h3>
            <p className="text-gray-600">Access exclusive job postings and career opportunities from our alumni network.</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 text-white py-16 px-4 -mx-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Join Our Community?</h2>
          <Link
            to="/dashboard/students"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
