import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import TrainerSidebar from './TrainerSidebar';

const Workouts = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access');
  const decoded = token ? jwtDecode(token) : null;

  if (!decoded || decoded.role !== 'trainer') {
    navigate('/');
    return null;
  }

  const username = decoded.username || 'Trainer';
  const [workouts, setWorkouts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editWorkout, setEditWorkout] = useState(null);
  const [editName, setEditName] = useState('');
  const [editExercises, setEditExercises] = useState([]);
  const [newExercise, setNewExercise] = useState({
    name: '', sets: '', reps: '', equipment: '', body_part: ''
  });
  const [error, setError] = useState('');

  const equipments = ['Barbell', 'Dumbbell', 'Body Weight', 'Machine', 'Kettlebell'];
  const bodyParts = ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core'];

  useEffect(() => {
    fetchWorkouts();
  }, [token]);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/trainer/workouts/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error.response ? error.response.data : error.message);
      setWorkouts([]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await axios.delete(`http://localhost:8000/api/trainer/workouts/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkouts(workouts.filter((workout) => workout.id !== id));
      } catch (error) {
        console.error('Error deleting workout:', error.response ? error.response.data : error.message);
        alert('Failed to delete workout.');
      }
    }
  };

  const handleEdit = (workout) => {
    setEditWorkout(workout);
    setEditName(workout.name);
    setEditExercises(workout.exercises.map(ex => ({
      name: ex.name,
      sets: ex.sets.toString(),
      reps: ex.reps.toString(),
      equipment: ex.equipment || '',
      body_part: ex.body_part || ''
    })));
  };

  const addExerciseToEdit = () => {
    if (!newExercise.name || !newExercise.sets || !newExercise.reps || !newExercise.equipment || !newExercise.body_part) {
      setError('All fields are required.');
      return;
    }
    setEditExercises([...editExercises, { ...newExercise }]);
    setNewExercise({ name: '', sets: '', reps: '', equipment: '', body_part: '' });
    setError('');
  };

  const updateExercise = (index, field, value) => {
    const updatedExercises = [...editExercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setEditExercises(updatedExercises);
  };

  const removeExercise = (index) => {
    setEditExercises(editExercises.filter((_, i) => i !== index));
  };

  const updateWorkout = async () => {
    if (!editName || editExercises.length === 0) {
      setError('Workout name and at least one exercise are required.');
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:8000/api/trainer/workouts/${editWorkout.id}/`,
        { name: editName, exercises: editExercises },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWorkouts(workouts.map(w => (w.id === editWorkout.id ? response.data : w)));
      setEditWorkout(null);
      setEditName('');
      setEditExercises([]);
      setError('');
    } catch (error) {
      console.error('Error updating workout:', error.response ? error.response.data : error.message);
      setError('Failed to update workout: ' + (error.response ? error.response.data.detail || error.response.statusText : error.message));
    }
  };

  const closeModal = () => {
    setEditWorkout(null);
    setEditName('');
    setEditExercises([]);
    setError('');
  };

  const filteredWorkouts = workouts.filter((workout) =>
    workout.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <TrainerSidebar username={username} />
      <div className="flex-1 p-8 overflow-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold uppercase text-gray-800">Workouts</h1>
            <p className="text-gray-600 mt-2">Manage and explore your workout plans.</p>
          </div>
          <button
            onClick={() => navigate('/trainer/dashboard/create-workouts')}
            className="bg-red-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-red-700 transition-colors duration-300"
          >
            Create New Workout
          </button>
        </header>
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Search workouts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-2/3 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {filteredWorkouts.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-sm font-semibold text-gray-700">Name</th>
                  <th className="p-4 text-sm font-semibold text-gray-700">Exercises</th>
                  <th className="p-4 text-sm font-semibold text-gray-700">Created</th>
                  <th className="p-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkouts.map((workout) => (
                  <tr key={workout.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                    <td className="p-4 text-gray-800">{workout.name}</td>
                    <td className="p-4 text-gray-600">{workout.exercises.length}</td>
                    <td className="p-4 text-gray-600">{new Date(workout.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-gray-600">
                      <button
                        onClick={() => handleEdit(workout)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-700 transition-colors duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(workout.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600 text-center">No workouts found. Create one to get started!</p>
          )}
        </div>

        {/* Edit Modal */}
        {editWorkout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Workout</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Workout Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g., Upper Body Strength"
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Exercise Name</label>
                    <input
                      type="text"
                      value={newExercise.name}
                      onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                      placeholder="e.g., Bench Press"
                      className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Sets</label>
                    <input
                      type="number"
                      value={newExercise.sets}
                      onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
                      placeholder="e.g., 3"
                      className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Reps</label>
                    <input
                      type="number"
                      value={newExercise.reps}
                      onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                      placeholder="e.g., 10"
                      className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Equipment</label>
                    <select
                      value={newExercise.equipment}
                      onChange={(e) => setNewExercise({ ...newExercise, equipment: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
                      value={newExercise.body_part}
                      onChange={(e) => setNewExercise({ ...newExercise, body_part: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
                  onClick={addExerciseToEdit}
                  className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  Add Exercise
                </button>
                {editExercises.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Exercises</h3>
                    <table className="w-full text-left">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-2 text-sm font-semibold text-gray-700">Name</th>
                          <th className="p-2 text-sm font-semibold text-gray-700">Sets</th>
                          <th className="p-2 text-sm font-semibold text-gray-700">Reps</th>
                          <th className="p-2 text-sm font-semibold text-gray-700">Equipment</th>
                          <th className="p-2 text-sm font-semibold text-gray-700">Body Part</th>
                          <th className="p-2 text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editExercises.map((ex, index) => (
                          <tr key={index} className="border-t border-gray-200">
                            <td className="p-2">
                              <input
                                type="text"
                                value={ex.name}
                                onChange={(e) => updateExercise(index, 'name', e.target.value)}
                                className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                value={ex.sets}
                                onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                                className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                value={ex.reps}
                                onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                                className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                              />
                            </td>
                            <td className="p-2">
                              <select
                                value={ex.equipment}
                                onChange={(e) => updateExercise(index, 'equipment', e.target.value)}
                                className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                              >
                                <option value="">Select Equipment</option>
                                {equipments.map((equip) => (
                                  <option key={equip} value={equip}>{equip}</option>
                                ))}
                              </select>
                            </td>
                            <td className="p-2">
                              <select
                                value={ex.body_part}
                                onChange={(e) => updateExercise(index, 'body_part', e.target.value)}
                                className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                              >
                                <option value="">Select Body Part</option>
                                {bodyParts.map((part) => (
                                  <option key={part} value={part}>{part}</option>
                                ))}
                              </select>
                            </td>
                            <td className="p-2">
                              <button
                                onClick={() => removeExercise(index)}
                                className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 transition-colors duration-300"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={closeModal}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateWorkout}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                  >
                    Update Workout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workouts;