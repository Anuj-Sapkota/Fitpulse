import React, { useState } from 'react';
import axios from 'axios';

const TrainerFormModal = ({ profile, setProfile, closeModal }) => {
  // Initialize form data with current profile values
  const [formData, setFormData] = useState({
    bio: profile.bio || '',
    specialties: profile.specialties || '',
    certifications: profile.certifications || '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        'http://localhost:8000/api/profile/update/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        }
      );
      setProfile({ ...profile, ...response.data }); // Update parent profile state
      closeModal(); // Close the modal on success
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-[28rem]">
        <h3 className="text-2xl font-bold uppercase mb-4">Edit Profile</h3>
        <form onSubmit={handleSubmit}>
          {/* Bio Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-sm w-full h-24"
              aria-label="Edit your bio"
            />
          </div>

          {/* Specialties Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Specialties</label>
            <input
              type="text"
              name="specialties"
              value={formData.specialties}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-sm w-full"
              aria-label="Edit your specialties"
            />
          </div>

          {/* Certifications Field */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Certifications</label>
            <input
              type="text"
              name="certifications"
              value={formData.certifications}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-sm w-full"
              aria-label="Edit your certifications"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-600 text-white px-4 py-2 rounded-sm hover:bg-gray-700 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-orange-600 text-white px-4 py-2 rounded-sm hover:bg-orange-700 transition duration-300"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerFormModal;