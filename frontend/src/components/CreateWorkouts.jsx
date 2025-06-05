import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import TrainerSidebar from './TrainerSidebar';

const CreateWorkouts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('access');
  const decoded = token ? jwtDecode(token) : null;

  if (!decoded || decoded.role !== 'trainer') {
    navigate('/');
    return null;
  }

  const username = decoded.username || 'Trainer';
  const workoutToEdit = location.state?.workout || null;
  const isEditMode = !!workoutToEdit;

  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([]);
  const [exercise, setExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    equipment: '',
    body_part: '',
  });
  const [error, setError] = useState('');

  const equipments = ['Barbell', 'Dumbbell', 'Body Weight', 'Machine', 'Kettlebell'];
  const bodyParts = ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core'];

  useEffect(() => {
    if (isEditMode && workoutToEdit) {
      setWorkoutName(workoutToEdit.name);
      setExercises(workoutToEdit.exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets.toString(),
        reps: ex.reps.toString(),
        equipment: ex.equipment || '',
        body_part: ex.body_part || ''
      })));
    }
  }, [isEditMode, workoutToEdit]);

  const addExercise = () => {
    if (!exercise.name || !exercise.sets || !exercise.reps || !exercise.equipment || !exercise.body_part) {
      setError('All fields are required.');
      return;
    }
    setExercises([...exercises, { ...exercise }]);
    setExercise({ name: '', sets: '', reps: '', equipment: '', body_part: '' });
    setError('');
  };

  const saveWorkout = async () => {
    if (!workoutName || exercises.length === 0) {
      setError('Workout name and at least one exercise are required.');
      return;
    }
    try {
      if (isEditMode) {
        const response = await axios.put(
          `http://localhost:8000/api/trainer/workouts/${workoutToEdit.id}/`,
          { name: workoutName, exercises },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Workout updated:', response.data);
      } else {
        const response = await axios.post(
          'http://localhost:8000/api/trainer/workouts/',
          { name: workoutName, exercises },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Workout saved:', response.data);
      }
      navigate('/trainer/dashboard/workouts');
    } catch (error) {
      console.error('Error saving/updating workout:', error.response ? error.response.data : error.message);
      setError('Failed to save/update workout: ' + (error.response ? error.response.data.detail || error.response.statusText : error.message));
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <TrainerSidebar username={username} />
      <div className="flex-1 p-8 overflow-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold uppercase text-gray-800">
            {isEditMode ? 'Edit Workout' : 'Create Workout'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditMode ? 'Update your workout plan.' : 'Build a new workout plan for your clients.'}
          </p>
        </header>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Workout Name</label>
              <input
                type="text"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="e.g., Upper Body Strength"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Exercise Name</label>
                <input
                  type="text"
                  value={exercise.name}
                  onChange={(e) => setExercise({ ...exercise, name: e.target.value })}
                  placeholder="e.g., Bench Press"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Sets</label>
                <input
                  type="number"
                  value={exercise.sets}
                  onChange={(e) => setExercise({ ...exercise, sets: e.target.value })}
                  placeholder="e.g., 3"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Reps</label>
                <input
                  type="number"
                  value={exercise.reps}
                  onChange={(e) => setExercise({ ...exercise, reps: e.target.value })}
                  placeholder="e.g., 10"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Equipment</label>
                <select
                  value={exercise.equipment}
                  onChange={(e) => setExercise({ ...exercise, equipment: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="">Select Equipment</option>
                  {equipments.map((equip) => (
                    <option key={equip} value={equip}>{equip}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Body Part</label>
                <select
                  value={exercise.body_part}
                  onChange={(e) => setExercise({ ...exercise, body_part: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="">Select Body Part</option>
                  {bodyParts.map((part) => (
                    <option key={part} value={part}>{part}</option>
                  ))}
                </select>
              </div>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              onClick={addExercise}
              className="w-full md:w-auto bg-red-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-red-700 transition-colors duration-300"
            >
              Add Exercise
            </button>
          </div>
        </div>
        {exercises.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Workout Preview</h2>
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-sm font-semibold text-gray-700">Name</th>
                  <th className="p-4 text-sm font-semibold text-gray-700">Sets</th>
                  <th className="p-4 text-sm font-semibold text-gray-700">Reps</th>
                  <th className="p-4 text-sm font-semibold text-gray-700">Equipment</th>
                  <th className="p-4 text-sm font-semibold text-gray-700">Body Part</th>
                </tr>
              </thead>
              <tbody>
                {exercises.map((ex, index) => (
                  <tr key={index} className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                    <td className="p-4 text-gray-800">{ex.name}</td>
                    <td className="p-4 text-gray-600">{ex.sets}</td>
                    <td className="p-4 text-gray-600">{ex.reps}</td>
                    <td className="p-4 text-gray-600">{ex.equipment}</td>
                    <td className="p-4 text-gray-600">{ex.body_part}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="text-center">
          <button
            onClick={saveWorkout}
            className="bg-red-600 text-white px-8 py-3 rounded-md shadow-md hover:bg-red-700 transition-colors duration-300"
          >
            {isEditMode ? 'Update Workout' : 'Save Workout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkouts;