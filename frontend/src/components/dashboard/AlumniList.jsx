import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HARDCODED_ALUMNI = [
  {
    _id: '1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    batch: '2018',
    branch: 'Computer Science',
    company: 'Google',
    linkedin: 'https://linkedin.com/in/rahul-sharma',
    role: 'alumni'
  },
  {
    _id: '2',
    name: 'Priya Patel',
    email: 'priya.patel@gmail.com',
    batch: '2017',
    branch: 'Information Science',
    company: 'Microsoft',
    linkedin: 'https://linkedin.com/in/priya-patel',
    role: 'alumni'
  },
  {
    _id: '3',
    name: 'Arun Kumar',
    email: 'arun.kumar@gmail.com',
    batch: '2019',
    branch: 'Computer Science',
    company: 'Amazon',
    linkedin: 'https://linkedin.com/in/arun-kumar',
    role: 'alumni'
  },
  {
    _id: '4',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@gmail.com',
    batch: '2020',
    branch: 'Electronics',
    company: 'Apple',
    linkedin: 'https://linkedin.com/in/sneha-reddy',
    role: 'alumni'
  },
  {
    _id: '5',
    name: 'Karthik M',
    email: 'karthik.m@gmail.com',
    batch: '2016',
    branch: 'Mechanical',
    company: 'Tesla',
    linkedin: 'https://linkedin.com/in/karthik-m',
    role: 'alumni'
  }
];

const AlumniList = () => {
  const [alumni, setAlumni] = useState(HARDCODED_ALUMNI);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    batch: '',
    branch: '',
    company: '',
    linkedin: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Add new alumni to the list with a generated ID
    const newAlumni = {
      _id: String(alumni.length + 1),
      ...formData,
      role: 'alumni'
    };
    
    setAlumni(prev => [newAlumni, ...prev]);
    setFormData({
      name: '',
      email: '',
      batch: '',
      branch: '',
      company: '',
      linkedin: '',
      password: ''
    });
    setShowForm(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Alumni Directory</h2>
          <p className="text-gray-600">Connect with NIE alumni</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Alumni Profile
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add Alumni Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Batch</label>
                <input
                  type="text"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Branch</label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alumni && alumni.length > 0 ? (
          alumni.map((alumnus) => (
            <div key={alumnus._id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-lg font-semibold text-gray-900 mb-2">{alumnus.name}</div>
              <div className="text-gray-600 space-y-1">
                <div><span className="font-medium">Batch:</span> {alumnus.batch}</div>
                <div><span className="font-medium">Branch:</span> {alumnus.branch}</div>
                <div><span className="font-medium">Company:</span> {alumnus.company}</div>
                <div><span className="font-medium">Email:</span> {alumnus.email}</div>
                {alumnus.linkedin && (
                  <div>
                    <a
                      href={alumnus.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>
              <button
                onClick={() => window.location.href = '/dashboard/chat'}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
              >
                Connect
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500 py-8">
            No alumni profiles found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniList;
