import React, { useState, useEffect } from 'react';
import api from '../axios';
import { useNavigate } from 'react-router-dom';

interface Session {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'available' | 'booked' | 'completed' | 'cancelled';
}

const CoachDashboard = () => {
  const [isCoach, setIsCoach] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    price: 0,
  });
  const [showAddSession, setShowAddSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkCoach = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await api.get('/coach/check');
        setIsCoach(response.data.isCoach);
        
        if (response.data.isCoach) {
          fetchSessions();
        }
      } catch (error: any) {
        console.error('Error checking coach status:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkCoach();
  }, [navigate]);

  const fetchSessions = async () => {
    try {
      const response = await api.get('/coach/sessions');
      setSessions(response.data.sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSession({
      ...newSession,
      [name]: name === 'duration' || name === 'price' ? parseFloat(value) : value,
    });
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/coach/sessions', newSession);
      setShowAddSession(false);
      setNewSession({
        title: '',
        description: '',
        date: '',
        time: '',
        duration: 60,
        price: 0,
      });
      fetchSessions();
    } catch (error) {
      console.error('Error adding session:', error);
    }
  };

  const handleDeleteSession = async (sessionId: number) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await api.delete(`/coach/sessions/${sessionId}`);
        fetchSessions();
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isCoach) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-red-600">You are not authorized to view this page.</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Coach Dashboard</h2>
        <ul>
          <li className="mb-2">
            <button 
              onClick={() => setShowAddSession(true)}
              className="text-gray-700 hover:text-blue-500"
            >
              Add New Session
            </button>
          </li>
          <li className="mb-2">
            <a href="#" className="text-gray-700 hover:text-blue-500">
              My Sessions
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="text-gray-700 hover:text-blue-500">
              My Clients
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="text-gray-700 hover:text-blue-500">
              Profile Settings
            </a>
          </li>
        </ul>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">My Sessions</h2>
        
        {showAddSession && (
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h3 className="text-xl font-bold mb-2">Add New Session</h3>
            <form onSubmit={handleAddSession}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newSession.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={newSession.date}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={newSession.time}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={newSession.duration}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    min="15"
                    step="15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={newSession.price}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={newSession.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddSession(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Session
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session) => (
            <div key={session.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold">{session.title}</h3>
              <p className="text-gray-600 mb-2">{session.description}</p>
              <div className="mb-2">
                <span className="font-medium">Date:</span> {session.date}
              </div>
              <div className="mb-2">
                <span className="font-medium">Time:</span> {session.time}
              </div>
              <div className="mb-2">
                <span className="font-medium">Duration:</span> {session.duration} minutes
              </div>
              <div className="mb-2">
                <span className="font-medium">Price:</span> ${session.price.toFixed(2)}
              </div>
              <div className="mb-2">
                <span className="font-medium">Status:</span> 
                <span className={`ml-1 px-2 py-1 rounded text-xs ${
                  session.status === 'available' ? 'bg-green-100 text-green-800' :
                  session.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                  session.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                </span>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleDeleteSession(session.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard; 