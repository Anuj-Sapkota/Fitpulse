import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import UserSidebar from './UserSidebar'; 

const UserDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access');
  const decoded = token ? jwtDecode(token) : null;

  // Redirect if not a user or not logged in
  if (!decoded || decoded.role !== 'user') {
    navigate('/');
    return null;
  }

  const username = decoded.username || 'User';
  const [dashboardData, setDashboardData] = useState({
    workoutsDone: 0,
    trainer: 'None',
    trainerMessage: 'No messages yet',
    caloriesBurned: 0,
    weeklyStreak: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user/dashboard/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData({
          workoutsDone: 12,
          trainer: 'Sarah Johnson',
          trainerMessage: 'Great job on your last workout! Keep it up!',
          caloriesBurned: 2450,
          weeklyStreak: 3,
        });
      }
    };
    fetchDashboardData();
  }, [token]);

  return (
    <div className="flex h-screen">
      <UserSidebar username={username} /> 
      <div className="flex-1 p-10 bg-gray-100">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold uppercase mb-4">Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700">Workouts Done</h3>
              <p className="text-3xl font-bold text-orange-600">{dashboardData.workoutsDone}</p>
              <p className="text-gray-600">Total this month</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700">Trainer Selected</h3>
              <p className="text-2xl font-bold text-orange-600">{dashboardData.trainer}</p>
              <p className="text-gray-600">Your current coach</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700">Trainer Message</h3>
              <p className="text-lg text-gray-700 italic">"{dashboardData.trainerMessage}"</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700">Calories Burned</h3>
              <p className="text-3xl font-bold text-orange-600">{dashboardData.caloriesBurned}</p>
              <p className="text-gray-600">This month</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700">Weekly Streak</h3>
              <p className="text-3xl font-bold text-orange-600">{dashboardData.weeklyStreak}</p>
              <p className="text-gray-600">Weeks in a row</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;