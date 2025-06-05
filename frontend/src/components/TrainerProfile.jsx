import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import TrainerSidebar from './TrainerSidebar'; // Import TrainerSidebar
import { Button } from '../components/ui/Button'; // Custom Button component
import Input from '../components/ui/Input'; // Custom Input component

const TrainerProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access');
  const decoded = token ? jwtDecode(token) : null;

  // Redirect if not a trainer or not logged in
  if (!decoded || decoded.role !== 'trainer') {
    navigate('/');
    return null;
  }

  const username = decoded.username || 'Trainer';
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    bio: '',
    experience: 0,
    specialties: [],
    certifications: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({ clients: 0, workoutsCreated: 0, avgClientProgress: 0 });
  const [feedback, setFeedback] = useState([]);
  const [error, setError] = useState('');

  // Fetch profile data (dummy for now, replace with API)
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/trainer/profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile({
          fullName: 'Alex Carter',
          email: 'alex.carter@example.com',
          bio: 'Passionate trainer with a focus on strength and endurance. Let’s crush your goals together!',
          experience: 5,
          specialties: ['Strength Training', 'HIIT', 'Nutrition Coaching'],
          certifications: ['NASM Certified', 'CPR/AED', 'Level 2 Fitness Instructor'],
        });
        setStats({ clients: 12, workoutsCreated: 45, avgClientProgress: 78 });
        setFeedback([
          { client: 'John Doe', rating: 5, comment: 'Alex is motivating and knowledgeable!' },
          { client: 'Jane Smith', rating: 4, comment: 'Great workouts, but scheduling can be tricky.' },
        ]);
      }
    };
    fetchProfileData();
  }, [token]);

  // Handle profile save
  const saveProfile = async () => {
    try {
      await axios.put('http://localhost:8000/api/trainer/profile/', profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsEditing(false);
      setError('');
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile. Try again.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <TrainerSidebar username={username} />

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold uppercase text-gray-800">Trainer Profile</h1>
            <p className="text-gray-600 mt-2">Your professional hub to showcase your expertise.</p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-red-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-red-700 transition-colors duration-300"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </header>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Placeholder */}
            <div className="w-32 h-32 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-gray-600 text-2xl font-bold">
              {profile.fullName ? profile.fullName[0] : 'A'}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <>
                  <Input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    placeholder="Full Name"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="Email"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Tell your clients about yourself..."
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    rows="4"
                  />
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-semibold text-gray-800">{profile.fullName}</h2>
                  <p className="text-gray-600 mt-1">{profile.email}</p>
                  <p className="text-gray-700 mt-4 leading-relaxed">{profile.bio}</p>
                </>
              )}
            </div>
          </div>
          {isEditing && (
            <div className="mt-6 flex justify-end">
              <Button
                onClick={saveProfile}
                className="bg-red-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-red-700 transition-colors duration-300"
              >
                Save Changes
              </Button>
            </div>
          )}
          {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-700">Active Clients</h3>
            <p className="text-4xl font-bold text-red-600 mt-2">{stats.clients}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-700">Workouts Created</h3>
            <p className="text-4xl font-bold text-red-600 mt-2">{stats.workoutsCreated}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-700">Avg. Client Progress</h3>
            <p className="text-4xl font-bold text-red-600 mt-2">{stats.avgClientProgress}%</p>
          </div>
        </div>

        {/* Specialties & Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Specialties</h3>
            {isEditing ? (
              <Input
                type="text"
                value={profile.specialties.join(', ')}
                onChange={(e) => setProfile({ ...profile, specialties: e.target.value.split(', ') })}
                placeholder="e.g., Strength Training, HIIT"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            ) : (
              <ul className="list-disc list-inside text-gray-700">
                {profile.specialties.map((spec, index) => (
                  <li key={index}>{spec}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Certifications</h3>
            {isEditing ? (
              <Input
                type="text"
                value={profile.certifications.join(', ')}
                onChange={(e) => setProfile({ ...profile, certifications: e.target.value.split(', ') })}
                placeholder="e.g., NASM Certified, CPR/AED"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            ) : (
              <ul className="list-disc list-inside text-gray-700">
                {profile.certifications.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Client Feedback */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Client Feedback</h3>
          {feedback.length > 0 ? (
            <div className="space-y-4">
              {feedback.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-800 font-medium">{item.client}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{item.comment}"</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No feedback yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;