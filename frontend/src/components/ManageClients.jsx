import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import TrainerSidebar from './TrainerSidebar'; // Import TrainerSidebar
import { Button } from '../components/ui/Button'; // Custom Button component
import Input from '../components/ui/Input'; // Custom Input component

const ManageClients = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access');
  const decoded = token ? jwtDecode(token) : null;

  // Redirect if not a trainer or not logged in
  if (!decoded || decoded.role !== 'trainer') {
    navigate('/');
    return null;
  }

  const username = decoded.username || 'Trainer';
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch client data (dummy for now, replace with API)
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/trainer/clients/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
        // Dummy data fallback
        setClients([
          { id: 1, name: 'John Doe', email: 'john@example.com', progress: 75, lastSession: 'Mar 17, 2025' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', progress: 60, lastSession: 'Mar 16, 2025' },
          { id: 3, name: 'Mike Johnson', email: 'mike@example.com', progress: 85, lastSession: 'Mar 18, 2025' },
          { id: 4, name: 'Emily Davis', email: 'emily@example.com', progress: 45, lastSession: 'Mar 15, 2025' },
        ]);
      }
    };
    fetchClients();
  }, [token]);

  // Filter clients based on search term
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open modal with selected client details
  const openClientModal = (client) => {
    setSelectedClient(client);
    setModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <TrainerSidebar username={username} />

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold uppercase text-gray-800">Manage Clients</h1>
          <p className="text-gray-600 mt-2">View and manage your clients’ progress and communication.</p>
        </header>

        {/* Search Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <Input
            type="text"
            placeholder="Search clients by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-2/3 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
          <Button
            className="w-full sm:w-auto bg-red-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-red-700 transition-colors duration-300"
          >
            Add New Client
          </Button>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-700">Name</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Progress</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Last Session</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr key={client.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                    <td className="p-4 text-gray-800">{client.name}</td>
                    <td className="p-4 text-gray-600">{client.email}</td>
                    <td className="p-4">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${client.progress}%` }}
                        />
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{client.lastSession}</td>
                    <td className="p-4 flex gap-2">
                      <Button
                        onClick={() => openClientModal(client)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-colors duration-300"
                      >
                        View
                      </Button>
                      <Button
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm hover:bg-gray-300 transition-colors duration-300"
                      >
                        Message
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No clients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Client Details Modal */}
        {modalOpen && selectedClient && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-red-600">{selectedClient.name}</h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span> {selectedClient.email}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Progress:</span> {selectedClient.progress}%
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Last Session:</span> {selectedClient.lastSession}
                </p>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Send Message</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    rows="4"
                    placeholder="Type your message here..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <Button
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors duration-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Add messaging logic here
                    setModalOpen(false);
                  }}
                  className="bg-red-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-red-700 transition-colors duration-300"
                >
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageClients;