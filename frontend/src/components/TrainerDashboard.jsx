import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import TrainerSidebar from './TrainerSidebar';

const TrainerDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access');
  const decoded = token ? jwtDecode(token) : null;

  if (!decoded || decoded.role !== 'trainer') {
    navigate('/');
    return null;
  }

  const username = decoded.username || 'Trainer';
  const [dashboardData, setDashboardData] = useState({
    activeClients: 0,
    workoutsAssigned: 0,
    upcomingSessions: [],
    latestMessage: { sender: 'No messages yet', text: '', timestamp: '' },
    clientProgress: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/trainer/dashboard/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching trainer dashboard data:', error);
        setDashboardData({
          activeClients: 8,
          workoutsAssigned: 15,
          upcomingSessions: [
            { client: 'John Doe', date: 'Mar 19, 2025, 10:00 AM' },
            { client: 'Jane Smith', date: 'Mar 20, 2025, 2:00 PM' },
          ],
          latestMessage: {
            sender: 'John Doe',
            text: 'Can we adjust my next session?',
            timestamp: 'Mar 17, 2025, 3:45 PM',
          },
          clientProgress: 75,
        });
      }
    };
    fetchDashboardData();
  }, [token]);

  return (
    <div className="flex h-screen">
      <TrainerSidebar username={username} />
      <div className="flex-1 p-10 bg-gray-100">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-4xl font-bold uppercase text-gray-800">Trainer Dashboard</h2>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/trainer/dashboard/create-workouts')}
                className="bg-orange-600 text-white px-4 py-2 rounded-sm hover:bg-orange-700 transition duration-300"
              >
                Create Workout
              </button>
              <button
                onClick={() => navigate('/trainer/dashboard/manage-clients')}
                className="bg-gray-600 text-white px-4 py-2 rounded-sm hover:bg-gray-700 transition duration-300"
              >
                Message Clients
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-700">Active Clients</h3>
                <p className="text-4xl font-bold text-orange-600">{dashboardData.activeClients}</p>
                <p className="text-gray-600">Currently training</p>
              </div>
              <button
                onClick={() => navigate('/trainer/dashboard/manage-clients')}
                className="text-orange-600 hover:underline"
              >
                View All
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-700">Workouts Assigned</h3>
                <p className="text-4xl font-bold text-orange-600">{dashboardData.workoutsAssigned}</p>
                <p className="text-gray-600">This month</p>
              </div>
              <button
                onClick={() => navigate('/trainer/dashboard/workouts')}
                className="text-orange-600 hover:underline"
              >
                View All
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-700">Client Progress</h3>
                <p className="text-4xl font-bold text-orange-600">{dashboardData.clientProgress}%</p>
                <p className="text-gray-600">Average completion</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Upcoming Sessions</h3>
              <button
                onClick={() => navigate('/trainer/dashboard/manage-clients')}
                className="text-orange-600 hover:underline"
              >
                View Calendar
              </button>
            </div>
            {dashboardData.upcomingSessions.length > 0 ? (
              <ul className="space-y-4">
                {dashboardData.upcomingSessions.slice(0, 3).map((session, index) => (
                  <li key={index} className="flex justify-between items-center border-b pb-2">
                    <span className="text-gray-700">{session.client}</span>
                    <span className="text-gray-600">{session.date}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No sessions scheduled this week.</p>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Latest Client Message</h3>
              <button
                onClick={() => navigate('/trainer/dashboard/manage-clients')}
                className="text-orange-600 hover:underline"
              >
                View All
              </button>
            </div>
            <div className="bg-gray-100 p-4 rounded-sm">
              <p className="text-gray-700 font-semibold">{dashboardData.latestMessage.sender}</p>
              <p className="text-gray-600 italic">"{dashboardData.latestMessage.text}"</p>
              <p className="text-sm text-gray-500 mt-2">{dashboardData.latestMessage.timestamp}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;