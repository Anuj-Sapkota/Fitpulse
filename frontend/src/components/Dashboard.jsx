import React, { useState } from 'react';
import { Bar, Line, Pie } from 'recharts';
import { Card, CardContent } from '../components/ui/card.jsx';
import { Button } from '../components/ui/Button.jsx';

const Dashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const workoutsData = [
    { name: 'Mon', calories: 400 },
    { name: 'Tue', calories: 300 },
    { name: 'Wed', calories: 500 },
    { name: 'Thu', calories: 200 },
    { name: 'Fri', calories: 450 },
  ];

  const progressData = [
    { name: 'Jan', weight: 70 },
    { name: 'Feb', weight: 68 },
    { name: 'Mar', weight: 66 },
    { name: 'Apr', weight: 64 },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-red-600 text-white p-5">
        <h1 className="text-2xl font-bold">FitPulse Dashboard</h1>
        <ul className="mt-10">
          <li className="p-2 hover:bg-red-500 cursor-pointer" onClick={() => setActivePage('dashboard')}>Dashboard</li>
          <li className="p-2 hover:bg-red-500 cursor-pointer" onClick={() => setActivePage('workouts')}>Workouts</li>
          <li className="p-2 hover:bg-red-500 cursor-pointer" onClick={() => setActivePage('progress')}>Progress</li>
          <li className="p-2 hover:bg-red-500 cursor-pointer" onClick={() => setActivePage('profile')}>Profile</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gray-100">
        {activePage === 'dashboard' && (
          <div>
            <h2 className="text-3xl font-bold mb-5">Welcome Back!</h2>
            <div className="grid grid-cols-3 gap-5">
              <Card>
                <CardContent>Calories Burned: 1500 kcal</CardContent>
              </Card>
              <Card>
                <CardContent>Workouts Completed: 10</CardContent>
              </Card>
              <Card>
                <CardContent>Active Days: 5</CardContent>
              </Card>
            </div>
          </div>
        )}

        {activePage === 'workouts' && (
          <div>
            <h2 className="text-3xl font-bold mb-5">Workout History</h2>
            <Bar data={workoutsData} />
          </div>
        )}

        {activePage === 'progress' && (
          <div>
            <h2 className="text-3xl font-bold mb-5">Progress Tracker</h2>
            <Line data={progressData} />
          </div>
        )}

        {activePage === 'profile' && (
          <div>
            <h2 className="text-3xl font-bold mb-5">User Profile</h2>
            <Card>
              <CardContent>
                <p>Name: John Doe</p>
                <p>Email: johndoe@example.com</p>
                <Button>Edit Profile</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
