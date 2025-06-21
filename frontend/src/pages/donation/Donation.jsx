import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Search } from 'lucide-react';

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
  const [showHospitalSuggestions, setShowHospitalSuggestions] = useState(false);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const hospitalSearchRef = useRef(null);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (hospitalSearchRef.current && !hospitalSearchRef.current.contains(event.target)) {
        setShowHospitalSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search hospitals by name
  const searchHospitals = debounce(async (query) => {
    if (!query || query.length < 2) {
      setHospitals([]);
      return;
    }

    try {
      setLoadingHospitals(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/hospital/search?name=${encodeURIComponent(query)}`);
      const data = await response.json();
      setHospitals(data);
    } catch (error) {
      console.error("Error searching hospitals:", error);
      setHospitals([]);
    } finally {
      setLoadingHospitals(false);
    }
  }, 300);

  const handleHospitalSearchChange = (e) => {
    const query = e.target.value;
    setHospitalName(query);
    setHospitalId('');
    searchHospitals(query);
  };

  const selectHospital = (hospital) => {
    setHospitalId(hospital.id);
    setHospitalName(hospital.name);
    setShowHospitalSuggestions(false);
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
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/donations`, {
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
      setHospitals([]);
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  return (
    <div className="max-w-xl mx-auto mt-12 px-6 py-8 bg-white shadow-xl rounded-xl border">
      <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#0052CC' }}>Submit a Donation Request</h2>

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
        <div className="relative" ref={hospitalSearchRef}>
          <label className="block mb-1 font-medium text-gray-700">Search & Select Hospital *</label>
          <div className="flex items-center border rounded">
            <input
              type="text"
              placeholder="Search hospital by name..."
              value={hospitalName}
              onChange={handleHospitalSearchChange}
              onFocus={() => setShowHospitalSuggestions(true)}
              className="flex-1 p-2 outline-none"
              required
            />
            <Search className="w-5 h-5 mx-2 text-gray-400" />
          </div>
          
          {showHospitalSuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
              {loadingHospitals ? (
                <div className="p-2 text-gray-500">Loading hospitals...</div>
              ) : hospitals.length > 0 ? (
                hospitals.map((hospital) => (
                  <div
                    key={hospital._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectHospital(hospital)}
                  >
                    <div className="font-medium">🏥 {hospital.name}</div>
                    <div className="text-sm text-gray-600">{hospital.location || hospital.address}</div>
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500">
                  {hospitalName.length > 1 ? "No hospitals found" : "Type at least 2 characters"}
                </div>
              )}
            </div>
          )}

          {hospitalId && (
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
            className={`font-semibold py-3 px-8 rounded-md transition-colors text-white ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'hover:opacity-90'
            }`}
            style={{ backgroundColor: loading ? '' : '#0052CC' }}
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
                : 'text-white border'
            }`}
            style={{ 
              backgroundColor: message.includes('✅') ? '' : '#DC2625',
              borderColor: message.includes('✅') ? '' : '#DC2625'
            }}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default Donation;