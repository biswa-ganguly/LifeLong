import React, { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate, useParams } from 'react-router-dom';

function UserDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();

  const [donations, setDonations] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [emergencyError, setEmergencyError] = useState('');

  useEffect(() => {
    if (isLoaded && isSignedIn && !userId) {
      navigate(`/dashboard/user/${user.id}`, { replace: true });
    }
  }, [isLoaded, isSignedIn, user, userId, navigate]);

  const idToUse = userId || user?.id;

  useEffect(() => {
    const fetchUserDonations = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`http://localhost:3000/api/donations/mine?userId=${user.id}`);
        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          setDonations(data);
        } else {
          setError(data?.error || 'Unexpected server response');
        }
      } catch (err) {
        setError('Failed to fetch donation status');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserEmergencies = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`http://localhost:3000/api/emergency/mine/${user.id}`);
        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          setEmergencies(data);
        } else {
          setEmergencyError(data?.error || 'Unexpected server response');
        }
      } catch (err) {
        setEmergencyError('Failed to fetch emergency requests');
      }
    };

    if (isLoaded && isSignedIn) {
      fetchUserDonations();
      fetchUserEmergencies();
    }
  }, [isLoaded, isSignedIn, getToken]);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 space-y-12">
      <div>
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-6">Welcome, User ID: {idToUse}</p>
      </div>

      {/* 🩸 Donation Requests */}
      <div>
        <h2 className="text-xl font-bold mb-4">🩸 Donation Requests</h2>
        {loading ? (
          <p>Loading donation requests...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : donations.length === 0 ? (
          <p>You have not submitted any donation requests yet.</p>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => (
              <div
                key={donation._id}
                className="border p-4 rounded flex flex-col shadow-sm bg-white"
              >
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
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <p>Submitted: {new Date(donation.createdAt).toLocaleString()}</p>
                  <p>Updated: {new Date(donation.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🚨 Emergency Requests */}
      <div>
        <h2 className="text-xl font-bold mb-4">🚨 Emergency Requests</h2>
        {emergencyError ? (
          <p className="text-red-600">{emergencyError}</p>
        ) : emergencies.length === 0 ? (
          <p>You have not submitted any emergency requests yet.</p>
        ) : (
          <div className="space-y-4">
            {emergencies.map((emergency) => (
              <div
                key={emergency._id}
                className="border p-4 rounded flex flex-col shadow-sm bg-red-50"
              >
                <p><strong>Type:</strong> {emergency.incidentType}</p>
                <p><strong>Location:</strong> {emergency?.incidentLocation?.address}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    className={`font-semibold ${
                      emergency.status === 'Pending'
                        ? 'text-yellow-600'
                        : emergency.status === 'Approved'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {emergency.status}
                  </span>
                </p>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <p>Submitted: {new Date(emergency.createdAt).toLocaleString()}</p>
                  <p>Updated: {new Date(emergency.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;