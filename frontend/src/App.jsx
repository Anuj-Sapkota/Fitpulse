import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import TrainerDashboard from './components/TrainerDashboard';
import Workouts from './components/Workouts';
import Community from './components/Community';
import Challanges from './components/Challanges'; // Fix to Challenges if needed
import Progress from './components/Progress';
import TrainerProfile from './components/TrainerProfile';
import UserProfile from './components/UserProfile';
import ManageClients from './components/ManageClients';
import CreateWorkouts from './components/CreateWorkouts';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
        <Route path="/trainer/dashboard/workouts" element={<Workouts />} />
        <Route path="/trainer/dashboard/manage-clients" element={<ManageClients />} />
        <Route path="/trainer/dashboard/create-workouts" element={<CreateWorkouts />} />
        <Route path="/trainer/dashboard/trainerProfile" element={<TrainerProfile />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/dashboard/workouts" element={<Workouts />} />
        <Route path="/user/dashboard/community" element={<Community />} />
        <Route path="/user/dashboard/challenges" element={<Challanges />} />
        <Route path="/user/dashboard/progress" element={<Progress />} />
        <Route path="/user/dashboard/userProfile" element={<UserProfile />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;