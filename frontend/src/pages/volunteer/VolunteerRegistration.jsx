import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VolunteerRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      setError('');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            type: 'Point',
            coordinates: [longitude, latitude],
          });
          setLoading(false);
        },
        (err) => {
          setError(`Error getting location: ${err.message}`);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    // Automatically get location on component mount
    getLocation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.name || !formData.phone || !location) {
      setError('Please provide your name, phone number, and allow location access.');
      setLoading(false);
      return;
    }

    try {
      // In a real application, the userId would come from your auth context (e.g., useAuth from Clerk).
      // For demonstration purposes, we generate a unique ID for each registration to avoid conflicts.
      const userId = `volunteer-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // The deviceToken would come from a push notification service like Firebase Cloud Messaging (FCM).
      const deviceToken = 'placeholder-device-token'; // From FCM

      const volunteerData = {
        ...formData,
        userId,
        deviceToken,
        location,
        isActive: true,
      };
      
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/volunteers`, volunteerData);
      
      if (response.data.success) {
        setSuccess('You have been registered as a volunteer!');
        setFormData({ name: '', phone: '' });
      } else {
        // This case might not be hit if backend always throws errors for failures
        setError(response.data.message || 'An unknown error occurred.');
      }

    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Become a Volunteer</h2>
            <p className="mt-2 text-sm text-gray-600">Join our community and help save lives.</p>
        </div>

        {error && (
            <div className="p-4 text-sm text-red-700 bg-red-100 border-l-4 border-red-500" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
        )}

        {success && (
            <div className="p-4 text-sm text-green-700 bg-green-100 border-l-4 border-green-500" role="alert">
                <p className="font-bold">Success</p>
                <p>{success}</p>
            </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Phone Number"
              />
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-md">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-800">Location</p>
                    {location ? (
                        <p className="text-xs text-green-600">
                            Latitude: {location.coordinates[1].toFixed(4)}, Longitude: {location.coordinates[0].toFixed(4)}
                        </p>
                    ) : (
                        <p className="text-xs text-gray-500">Waiting for location permission...</p>
                    )}
                </div>
                <button type="button" onClick={getLocation} disabled={loading} className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                    {loading && !location ? 'Fetching...' : 'Refresh'}
                </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !location}
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              {loading ? 'Registering...' : 'Register as Volunteer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VolunteerRegistration;
