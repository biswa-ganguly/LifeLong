import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

function Donation() {
  const { user, isSignedIn } = useUser();

  const [type, setType] = useState('blood');
  const [details, setDetails] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [hasDisease, setHasDisease] = useState(false);
  const [diseaseDetails, setDiseaseDetails] = useState('');
  const [organType, setOrganType] = useState('');
  const [isLivingDonor, setIsLivingDonor] = useState(false);
  const [relationToRecipient, setRelationToRecipient] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [hasSelectedHospital, setHasSelectedHospital] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const delay = setTimeout(() => {
      if (hospitalName.trim() === '') {
        fetchAllHospitals();
      } else if (!hasSelectedHospital) {
        fetchHospitalsByName(hospitalName);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [hospitalName, hasSelectedHospital]);

  const fetchAllHospitals = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/hospital/all`);
      const data = await res.json();
      setHospitals(data);
    } catch (err) {
      console.error('Error fetching all hospitals:', err);
      setHospitals([]);
    }
  };

  const fetchHospitalsByName = async (query) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/hospital/search?name=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setHospitals(data);
    } catch (err) {
      console.error('Error searching hospitals:', err);
      setHospitals([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSignedIn) {
      setMessage('❌ You must be signed in to submit a donation.');
      return;
    }

    if (!hospitalId || !hospitalName) {
      setMessage('❌ Please select a hospital.');
      return;
    }

    setLoading(true);

    const body = {
      type,
      details,
      userId: user.id,
      hospitalId,
      hospitalName,
    };

    if (type === 'blood') {
      body.bloodGroup = bloodGroup;
      body.hasDisease = hasDisease;
      if (hasDisease) {
        body.diseaseDetails = diseaseDetails;
      }
    }

    if (type === 'organ') {
      body.organType = organType;
      body.isLivingDonor = isLivingDonor;
      if (isLivingDonor) {
        body.relationToRecipient = relationToRecipient;
      }
    }

    try {
      const res = await fetch('http://localhost:3000/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setMessage('✅ Donation request submitted successfully!');
      // Reset form
      setType('blood');
      setDetails('');
      setBloodGroup('');
      setHasDisease(false);
      setDiseaseDetails('');
      setOrganType('');
      setIsLivingDonor(false);
      setRelationToRecipient('');
      setHospitalId('');
      setHospitalName('');
      setHasSelectedHospital(false);
      setHospitals([]);
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 px-6 py-8 bg-white shadow-xl rounded-xl border">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Submit a Donation Request</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Donation Type */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Donation Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            <option value="blood">🩸 Blood</option>
            <option value="organ">🫀 Organ</option>
          </select>
        </div>

        {/* Hospital Search */}
        <div className="relative">
          <label className="block mb-1 font-medium text-gray-700">Search & Select Hospital *</label>
          <input
            type="text"
            placeholder="Search hospital by name..."
            value={hospitalName}
            onChange={(e) => {
              setHospitalName(e.target.value);
              setHospitalId('');
              setHasSelectedHospital(false);
            }}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />

          {/* Dropdown */}
          {hospitalName !== '' && hospitals.length > 0 && !hasSelectedHospital && (
            <div className="absolute w-full border border-gray-300 rounded-md bg-white shadow z-10 max-h-60 overflow-y-auto">
              {hospitals.map((hospital) => (
                <div
                  key={hospital._id}
                  onClick={() => {
                    setHospitalId(hospital.id);
                    setHospitalName(hospital.name);
                    setHasSelectedHospital(true);
                    setHospitals([]);
                  }}
                  className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                >
                  🏥 {hospital.name} - {hospital.location || hospital.address}
                </div>
              ))}
            </div>
          )}
          {hospitalName && hospitals.length === 0 && !hasSelectedHospital && (
            <div className="absolute w-full border border-gray-300 rounded-md bg-white shadow z-10">
              <div className="px-3 py-2 text-gray-500">❌ No Hospitals Found</div>
            </div>
          )}

          {hasSelectedHospital && hospitalName && (
            <p className="text-green-700 text-sm mt-1">✅ Selected: {hospitalName}</p>
          )}
        </div>

        {/* Blood Donation Fields */}
        {type === 'blood' && (
          <>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Blood Group *</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">-- Select Blood Group --</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                  <option key={group} value={group}>
                    🩸 {group}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Do you have any diseases? *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hasDisease"
                    checked={hasDisease === true}
                    onChange={() => setHasDisease(true)}
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hasDisease"
                    checked={hasDisease === false}
                    onChange={() => setHasDisease(false)}
                  />
                  No
                </label>
              </div>
            </div>

            {hasDisease && (
              <div>
                <label className="block mb-1 font-medium text-gray-700">Disease Details *</label>
                <input
                  type="text"
                  value={diseaseDetails}
                  onChange={(e) => setDiseaseDetails(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Describe the disease"
                  required
                />
              </div>
            )}
          </>
        )}

        {/* Organ Donation Fields */}
        {type === 'organ' && (
          <>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Organ Type *</label>
              <select
                value={organType}
                onChange={(e) => setOrganType(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">-- Select Organ --</option>
                {[
                  { value: 'kidney', label: '🫘 Kidney' },
                  { value: 'liver', label: '🫁 Liver' },
                  { value: 'heart', label: '❤️ Heart' },
                  { value: 'lungs', label: '🫁 Lungs' },
                  { value: 'pancreas', label: '🥞 Pancreas' },
                  { value: 'intestine', label: '🧠 Intestine' },
                  { value: 'other', label: '🔬 Other' },
                ].map((organ) => (
                  <option key={organ.value} value={organ.value}>
                    {organ.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Are you a living donor? *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isLivingDonor"
                    checked={isLivingDonor === true}
                    onChange={() => setIsLivingDonor(true)}
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isLivingDonor"
                    checked={isLivingDonor === false}
                    onChange={() => setIsLivingDonor(false)}
                  />
                  No
                </label>
              </div>
            </div>

            {isLivingDonor && (
              <div>
                <label className="block mb-1 font-medium text-gray-700">Relation to Recipient *</label>
                <input
                  type="text"
                  value={relationToRecipient}
                  onChange={(e) => setRelationToRecipient(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="e.g., Father, Friend, Stranger"
                  required
                />
              </div>
            )}
          </>
        )}

        {/* Additional Details */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Additional Details</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 h-32"
            placeholder="Mention urgency, special needs, contact preferences..."
            required
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className={`font-semibold py-3 px-8 rounded-md transition-colors ${
              loading ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? 'Submitting...' : 'Submit Donation Request'}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`text-center mt-4 text-sm rounded-md p-3 ${
              message.includes('✅')
                ? 'text-green-800 bg-green-100 border border-green-200'
                : 'text-red-800 bg-red-100 border border-red-200'
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default Donation;
