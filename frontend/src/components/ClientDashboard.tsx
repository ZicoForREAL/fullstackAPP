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
  coach: {
    id: number;
    name: string;
  };
}

interface BookedSession extends Session {
  booking_id: number;
  booking_date: string;
}

const ClientDashboard = () => {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [availableSessions, setAvailableSessions] = useState<Session[]>([]);
  const [bookedSessions, setBookedSessions] = useState<BookedSession[]>([]);
  const [activeTab, setActiveTab] = useState<'available' | 'booked'>('available');
  const navigate = useNavigate();

  useEffect(() => {
    const checkClient = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await api.get('/client/check');
        setIsClient(response.data.isClient);
        
        if (response.data.isClient) {
          fetchSessions();
        }
      } catch (error: any) {
        console.error('Error checking client status:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkClient();
  }, [navigate]);

  const fetchSessions = async () => {
    try {
      const [availableResponse, bookedResponse] = await Promise.all([
        api.get('/client/available-sessions'),
        api.get('/client/booked-sessions')
      ]);
      
      setAvailableSessions(availableResponse.data.sessions);
      setBookedSessions(bookedResponse.data.sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleBookSession = async (sessionId: number) => {
    try {
      await api.post(`/client/book-session/${sessionId}`);
      fetchSessions();
    } catch (error) {
      console.error('Error booking session:', error);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.delete(`/client/cancel-booking/${bookingId}`);
        fetchSessions();
      } catch (error) {
        console.error('Error canceling booking:', error);
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

  if (!isClient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-red-600">You are not authorized to view this page.</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Client Dashboard</h2>
        <ul>
          <li className="mb-2">
            <button 
              onClick={() => setActiveTab('available')}
              className={`text-gray-700 hover:text-blue-500 ${activeTab === 'available' ? 'font-bold text-blue-600' : ''}`}
            >
              Available Sessions
            </button>
          </li>
          <li className="mb-2">
            <button 
              onClick={() => setActiveTab('booked')}
              className={`text-gray-700 hover:text-blue-500 ${activeTab === 'booked' ? 'font-bold text-blue-600' : ''}`}
            >
              My Bookings
            </button>
          </li>
          <li className="mb-2">
            <a href="#" className="text-gray-700 hover:text-blue-500">
              My Profile
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="text-gray-700 hover:text-blue-500">
              Payment History
            </a>
          </li>
        </ul>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">
          {activeTab === 'available' ? 'Available Sessions' : 'My Bookings'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTab === 'available' ? (
            availableSessions.map((session) => (
              <div key={session.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-bold">{session.title}</h3>
                <p className="text-gray-600 mb-2">{session.description}</p>
                <div className="mb-2">
                  <span className="font-medium">Coach:</span> {session.coach.name}
                </div>
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
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleBookSession(session.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            ))
          ) : (
            bookedSessions.map((session) => (
              <div key={session.booking_id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-bold">{session.title}</h3>
                <p className="text-gray-600 mb-2">{session.description}</p>
                <div className="mb-2">
                  <span className="font-medium">Coach:</span> {session.coach.name}
                </div>
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
                  <span className="font-medium">Booked on:</span> {session.booking_date}
                </div>
                <div className="mb-2">
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-1 px-2 py-1 rounded text-xs ${
                    session.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                    session.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </span>
                </div>
                {session.status === 'booked' && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleCancelBooking(session.booking_id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard; 