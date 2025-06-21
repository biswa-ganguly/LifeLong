import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function PoliceAdminDashboard() {
  const { policeId } = useParams();
  const [emergencyFIRs, setEmergencyFIRs] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchEmergencyFIRs = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/emergency-firs/${policeId}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setEmergencyFIRs(data);
        setMessage('');
      } else if (data.message) {
        setEmergencyFIRs([]);
        setMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to fetch emergency FIRs');
      setEmergencyFIRs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencyFIRs();
  }, [policeId]);

  const updateApproval = async (id, isApproved) => {
    const action = isApproved ? 'approve' : 'reject';
    const note = prompt(`Enter a note for ${action.toUpperCase()}:`);

    if (note === null) return; // User cancelled

    try {
      const res = await fetch(`http://localhost:3000/api/emergency-firs/status/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, note }),
      });

      console.log(JSON.stringify({ action, note }));

      const result = await res.json();

      if (res.ok) {
        setEmergencyFIRs((prev) =>
          prev.map((fir) => (fir._id === result.fir._id ? result.fir : fir))
        );
      } else {
        console.error(result);
        setMessage(result.message || 'Failed to update FIR status');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error while updating FIR status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold mb-6">Police Emergency FIR Dashboard</h2>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2">Loading FIRs...</p>
        </div>
      ) : message ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg font-medium">{message}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {emergencyFIRs.map((fir) => (
            <div
              key={fir._id}
              className={`border rounded-lg shadow-lg p-6 bg-white hover:shadow-xl transition-shadow ${
                fir.isApprovedByPolice ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">

                {/* FIR Details */}
                <div className="flex-grow space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {fir.incidentType}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          fir.isApprovedByPolice
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {fir.isApprovedByPolice ? 'Approved' : 'Pending Review'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(fir.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Deceased Details */}
                  {fir.deceasedDetails && (
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-2">Deceased Information:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <p><strong>Name:</strong> {fir.deceasedDetails.name}</p>
                        {fir.deceasedDetails.gender && (
                          <p><strong>Gender:</strong> {fir.deceasedDetails.gender}</p>
                        )}
                        {fir.deceasedDetails.approximateAge && (
                          <p><strong>Age:</strong> {fir.deceasedDetails.approximateAge} years</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {fir.incidentLocation && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-2">Incident Location:</h4>
                      <div className="text-sm space-y-1">
                        {fir.incidentLocation.address && (
                          <p><strong>Address:</strong> {fir.incidentLocation.address}</p>
                        )}
                        {fir.incidentLocation.latitude && fir.incidentLocation.longitude && (
                          <p>
                            <strong>Coordinates:</strong> {fir.incidentLocation.latitude}, {fir.incidentLocation.longitude}
                            <a 
                              href={`https://maps.google.com/?q=${fir.incidentLocation.latitude},${fir.incidentLocation.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-blue-600 hover:text-blue-800 underline"
                            >
                              View on Map
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Observations */}
                  {fir.initialObservations && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-2">Initial Observations:</h4>
                      <p className="text-sm text-gray-700">{fir.initialObservations}</p>
                    </div>
                  )}

                  {/* Reporter Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Reporter Information:</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Status:</strong> {fir.reporter.isAnonymous ? 'Anonymous' : 'Identified'}</p>
                      {!fir.reporter.isAnonymous && fir.reporter.name && (
                        <p><strong>Name:</strong> {fir.reporter.name}</p>
                      )}
                      {!fir.reporter.isAnonymous && fir.reporter.phone && (
                        <p><strong>Phone:</strong> {fir.reporter.phone}</p>
                      )}
                      <p><strong>User ID:</strong> {fir.reporter.userId}</p>
                    </div>
                  </div>

                  {/* Photo */}
                  {fir.photoUrl && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-2">Evidence Photo:</h4>
                      <img 
                        src={fir.photoUrl} 
                        alt="Evidence" 
                        className="max-w-xs rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => window.open(fir.photoUrl, '_blank')}
                      />
                    </div>
                  )}
                </div>

                {/* Approve / Reject */}
                {!fir.isApprovedByPolice && (
                  <div className="flex flex-col gap-3 lg:min-w-[200px]">
                    <button
                      onClick={() => updateApproval(fir._id, true)}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      Approve FIR
                    </button>
                    {/* <button
                      onClick={() => updateApproval(fir._id, false)}
                      className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    >
                      Reject FIR
                    </button> */}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PoliceAdminDashboard;
