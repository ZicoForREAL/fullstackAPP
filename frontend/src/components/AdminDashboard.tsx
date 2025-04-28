import React, { useState, useEffect } from 'react';
import api from '../axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await api.get('/admin/check');
        setIsAdmin(response.data.isAdmin);
      } catch (error: any) {
        console.error('Error checking admin status:', error);
        // If there's an authentication error, clear the token and redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-red-600">You are not authorized to view this page.</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
        <ul>
          <li className="mb-2">
            <a href="#" className="text-gray-700 hover:text-blue-500">
              Manage Users
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="text-gray-700 hover:text-blue-500">
              View Analytics
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="text-gray-700 hover:text-blue-500">
              Settings
            </a>
          </li>
        </ul>
      </div>
      <div className="flex-1 p-4">
        <h2>Welcome to the Admin Dashboard!</h2>
        <p>Select an option from the left sidebar to manage the application.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
