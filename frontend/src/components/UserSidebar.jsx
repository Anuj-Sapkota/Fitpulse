import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/Images/Nav/logo2.png'; // Adjust path

const UserSidebar = ({ username }) => {
  const navigate = useNavigate();
  const userLinks = [
    { to: '/user/dashboard', label: 'Dashboard' },
    { to: '/user/dashboard/workouts', label: 'Workouts' },
    { to: '/user/dashboard/progress', label: 'Progress' },
    { to: '/user/dashboard/community', label: 'Community' },
    { to: '/user/dashboard/challenges', label: 'Challenges' },
    { to: '/user/dashboard/userProfile', label: 'Profile' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/');
  };

  return (
    <div className="w-64 bg-gradient-to-b from-black to-gray-900 text-white p-6 flex flex-col justify-between h-full">
      <div>
        <img src={logo} alt="FitPulse Logo" className="w-40 mb-6" />
        <h2 className="text-3xl font-bold uppercase mb-4">Welcome, {username}</h2>
        <nav>
          <ul className="space-y-6">
            {userLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `text-lg font-semibold transition duration-300 ${
                      isActive ? 'text-orange-600' : 'text-white hover:text-orange-600'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-400 mb-4">Your journey to a healthier life starts here</p>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white text-lg font-semibold px-4 py-2 rounded-sm hover:bg-red-700 transition duration-300 w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;