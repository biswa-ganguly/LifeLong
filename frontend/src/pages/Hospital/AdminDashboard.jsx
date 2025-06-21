import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function HospitalAdminDashboard() {
  const { hospitalId } = useParams();
  const [donations, setDonations] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/donations/${hospitalId}`);
      const data = await res.json();

      console.log("Fetched donations:", data); // Debug

      if (Array.isArray(data)) {
        setDonations(data);
        setMessage('');
      } else if (data.message) {
        setDonations([]);
        setMessage(data.message); // Use backend's message
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to fetch donation requests');
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [hospitalId]);

  const updateStatus = async (id, status) => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/donations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const updated = await res.json();
      setDonations((prev) =>
        prev.map((donation) => (donation._id === updated._id ? updated : donation))
      );
    } catch (err) {
      console.error(err);
      setMessage('Failed to update status');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Donation Dashboard</h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : message ? (
        <p className="text-gray-600 text-center text-lg font-medium">{message}</p>
      ) : (
        <div className="space-y-4">
          {donations.map((donation) => (
            <div
              key={donation._id}
              className="border p-4 rounded shadow flex flex-col sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <p><strong>Type:</strong> {donation.type}</p>
                <p><strong>Details:</strong> {donation.details}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    className={`font-semibold ${
                      donation.status === 'pending'
                        ? 'text-yellow-600'
                        : donation.status === 'accepted'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {donation.status}
                  </span>
                </p>
                <p><strong>User ID:</strong> {donation.userId}</p>
              </div>

              {donation.status === 'pending' && (
                <div className="flex gap-2 mt-4 sm:mt-0">
                  <button
                    onClick={() => updateStatus(donation._id, 'accepted')}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(donation._id, 'rejected')}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HospitalAdminDashboard;
