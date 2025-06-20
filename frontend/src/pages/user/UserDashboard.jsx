<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react'; // ✅ useAuth to get token
import { useNavigate, useParams } from 'react-router-dom';

function UserDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth(); // ✅ Clerk token
  const navigate = useNavigate();
  const { userId } = useParams();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoaded && isSignedIn && !userId) {
      navigate(`/dashboard/user/${user.id}`, { replace: true });
    }
  }, [isLoaded, isSignedIn, user, userId, navigate]);

  const idToUse = userId || user?.id;

  useEffect(() => {
    const fetchUserDonations = async () => {
      try {
        const token = await getToken(); // ✅ Get Clerk token

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

    if (isLoaded && isSignedIn) {
      fetchUserDonations();
    }
  }, [isLoaded, isSignedIn, getToken]);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome, User ID: {idToUse}</p>

      {loading ? (
        <p>Loading donation requests...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : donations.length === 0 ? (
        <p>You have not submitted any donation requests yet.</p>
      ) : (
        <div className="space-y-4 ">
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

              <div className='flex justify-between'>
                <p className="text-sm text-gray-400">
                Submitted on: {new Date(donation.createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">
                Updated at: {new Date(donation.updatedAt).toLocaleString()}
              </p>
              </div>
              
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
=======
import React from 'react'

function UserDashboard() {
  return (
    <div>UserDashboard</div>
  )
}

export default UserDashboard
>>>>>>> dfc13b7b59b82e6cae8d7d607ee736361cfb843b
