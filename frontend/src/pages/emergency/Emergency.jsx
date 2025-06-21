import React, { useState, useRef, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import { Upload, Video, X, Search, MapPin, Mic, MicOff } from "lucide-react";
import Webcam from "react-webcam";

// IP Address Hook
const useIPTracker = () => {
  const [ipData, setIpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getIPAddress = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return data;
    } catch (err) {
      try {
        const fallbackResponse = await fetch('https://api.ipify.org?format=json');
        const fallbackData = await fallbackResponse.json();
        return { ip: fallbackData.ip };
      } catch (fallbackErr) {
        throw new Error('Failed to fetch IP address');
      }
    }
  };

  useEffect(() => {
    const trackIP = async () => {
      try {
        setLoading(true);
        const ipInfo = await getIPAddress();
        setIpData(ipInfo);
      } catch (err) {
        setError(err.message);
        console.error('IP tracking error:', err);
      } finally {
        setLoading(false);
      }
    };

    trackIP();
  }, []);

  return { ipData, loading, error };
};

function Emergency() {
  const [formData, setFormData] = useState({
    incidentType: '',
    name: '',
    gender: '',
    approximateAge: '',
    address: '',
    latitude: '',
    longitude: '',
    initialObservations: '',
    photoUrl: '',
    isAnonymous: true,
    reporterName: '',
    reporterRelation: '',
    policeStationId: '',
    policeStationName: ''
  });

  const { user } = useUser();
  const { ipData, loading: ipLoading, error: ipError } = useIPTracker();
  const [uploading, setUploading] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [policeStations, setPoliceStations] = useState([]);
  const [showStationSuggestions, setShowStationSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingStations, setLoadingStations] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isListening, setIsListening] = useState({});
  const [recognition, setRecognition] = useState(null);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);

  const webcamRef = useRef(null);
  const stationSearchRef = useRef(null);
  const isDesktop = window.innerWidth > 768;

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      setRecognition(recognitionInstance);
      setIsVoiceSupported(true);
    } else {
      setIsVoiceSupported(false);
    }
  }, []);

  const startVoiceRecognition = (fieldName) => {
    if (!recognition || !isVoiceSupported) {
      alert('Voice recognition is not supported in your browser');
      return;
    }

    setIsListening(prev => ({ ...prev, [fieldName]: true }));

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      
      if (fieldName === 'policeStationSearch') {
        setSearchQuery(transcript);
        searchPoliceStations(transcript);
      } else {
        setFormData(prev => ({
          ...prev,
          [fieldName]: prev[fieldName] ? prev[fieldName] + ' ' + transcript : transcript
        }));
      }
      
      setIsListening(prev => ({ ...prev, [fieldName]: false }));
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(prev => ({ ...prev, [fieldName]: false }));
    };

    recognition.start();
  };

  const stopVoiceRecognition = (fieldName) => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(prev => ({ ...prev, [fieldName]: false }));
  };

  const VoiceInputButton = ({ fieldName }) => {
    if (!isVoiceSupported) return null;

    const isCurrentlyListening = isListening[fieldName];

    return (
      <button
        type="button"
        onClick={() => isCurrentlyListening ? stopVoiceRecognition(fieldName) : startVoiceRecognition(fieldName)}
        className={`flex items-center justify-center w-8 h-8 rounded border ${
          isCurrentlyListening 
            ? 'bg-red-500 text-white border-red-500' 
            : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
        } transition-colors`}
        title={isCurrentlyListening ? 'Stop recording' : 'Start voice input'}
      >
        {isCurrentlyListening ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (stationSearchRef.current && !stationSearchRef.current.contains(event.target)) {
        setShowStationSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchPoliceStations = debounce(async (query) => {
    if (!query || query.length < 2) {
      setPoliceStations([]);
      return;
    }

    try {
      setLoadingStations(true);
      const response = await fetch(`http://localhost:3000/api/police/search?name=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      const transformedStations = data.map(station => ({
        _id: station.id,
        stationName: station.name,
        address: {
          line: `${station.name}, ${station.district}, ${station.city}`
        }
      }));
      
      setPoliceStations(transformedStations);
    } catch (error) {
      console.error("Error searching police stations:", error);
      setPoliceStations([]);
    } finally {
      setLoadingStations(false);
    }
  }, 300);

  const handleStationSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchPoliceStations(query);
  };

  const selectPoliceStation = (station) => {
    setFormData(prev => ({
      ...prev,
      policeStationId: station._id,
      policeStationName: station.stationName
    }));
    setSearchQuery(station.stationName);
    setShowStationSuggestions(false);
    setFormErrors(prev => ({ ...prev, policeStation: undefined }));
  };

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          setFormData(prev => ({
            ...prev,
            address: data.display_name || "",
            latitude: latitude.toString(),
            longitude: longitude.toString()
          }));
        } catch (error) {
          alert("Failed to fetch address details");
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        alert("Location access denied or failed");
        setLoadingLocation(false);
      }
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhotoSelection = (file) => {
    if (!file) return;
    setLocalPreview(URL.createObjectURL(file));
    setImageFile(file);
  };

  const captureWebcamImage = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await (await fetch(imageSrc)).blob();
    const file = new File([blob], 'webcam.jpg', { type: 'image/jpeg' });
    handlePhotoSelection(file);
    setShowWebcam(false);
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "emergency_fir");
    data.append("cloud_name", "dm5tuztuv");

    const res = await fetch("https://api.cloudinary.com/v1_1/dm5tuztuv/image/upload", {
      method: "POST",
      body: data
    });

    const imgData = await res.json();
    return imgData.secure_url;
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.policeStationId || !formData.policeStationName) {
      errors.policeStation = "Please select a police station";
    }
    
    if (!formData.incidentType) {
      errors.incidentType = "Incident type is required";
    }
    
    if (!formData.address) {
      errors.address = "Address is required";
    }
    
    if (!formData.initialObservations) {
      errors.initialObservations = "Initial observations are required";
    }
    
    if (!formData.isAnonymous && !formData.reporterName) {
      errors.reporterName = "Your name is required when not reporting anonymously";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setUploading(true);

    try {
      let uploadedImageUrl = '';
      if (imageFile) {
        uploadedImageUrl = await uploadToCloudinary(imageFile);
      }

      const payload = {
        incidentType: formData.incidentType,
        name: formData.name || 'Unknown',
        gender: formData.gender,
        approximateAge: parseInt(formData.approximateAge) || null,
        address: formData.address,
        latitude: parseFloat(formData.latitude) || null,
        longitude: parseFloat(formData.longitude) || null,
        initialObservations: formData.initialObservations,
        photoUrl: uploadedImageUrl || null,
        isAnonymous: formData.isAnonymous,
        reporterName: formData.isAnonymous ? 'Anonymous' : formData.reporterName,
        reporterRelation: formData.isAnonymous ? 'Witness' : formData.reporterRelation,
        policeStationId: formData.policeStationId,
        policeStationName: formData.policeStationName,
        ipAddress: ipData?.ip || null,
        userId: user?.id || 'anonymous'
      };

      console.log('Submitting payload:', JSON.stringify(payload, null, 2));

      const response = await fetch('http://localhost:3000/api/emergency-fir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit FIR');
      }

      alert(`FIR submitted successfully! ID: ${result.firId}`);
      
      // Reset form
      setFormData({
        incidentType: '',
        name: '',
        gender: '',
        approximateAge: '',
        address: '',
        latitude: '',
        longitude: '',
        initialObservations: '',
        photoUrl: '',
        isAnonymous: true,
        reporterName: '',
        reporterRelation: '',
        policeStationId: '',
        policeStationName: ''
      });
      setLocalPreview(null);
      setImageFile(null);
      setSearchQuery('');
      
    } catch (error) {
      console.error('Submission error:', error);
      alert(error.message || 'Error submitting FIR. Please try again.');
    } finally {
      setUploading(false);
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
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Emergency FIR Submission</h2>
        {isVoiceSupported && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
            <Mic className="w-4 h-4" />
            <span>Voice input is available for quick reporting</span>
          </div>
        )}
        
        {ipLoading && (
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded mt-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Initializing security tracking...</span>
          </div>
        )}
        
        {ipError && (
          <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded mt-2">
            <span>⚠️ Security tracking unavailable (form still functional)</span>
          </div>
        )}
        
        {ipData && !ipLoading && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded mt-2">
            <span>🔒 Security tracking active - Your submission will be verified</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Incident Type: *</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              name="incidentType" 
              value={formData.incidentType} 
              onChange={handleChange} 
              className="flex-1 border p-2 rounded" 
              required 
            />
            <VoiceInputButton fieldName="incidentType" />
          </div>
          {formErrors.incidentType && (
            <p className="text-red-500 text-sm mt-1">{formErrors.incidentType}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Deceased Name (if known):</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className="flex-1 border p-2 rounded" 
            />
            <VoiceInputButton fieldName="name" />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Gender:</label>
          <select 
            name="gender" 
            value={formData.gender} 
            onChange={handleChange} 
            className="w-full border p-2 rounded"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Approximate Age:</label>
          <input 
            type="number" 
            name="approximateAge" 
            value={formData.approximateAge} 
            onChange={handleChange} 
            className="w-full border p-2 rounded" 
          />
        </div>

        <div className="relative" ref={stationSearchRef}>
          <label className="block mb-1 font-medium">Police Station: *</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <div className="flex items-center border rounded">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleStationSearchChange}
                  onFocus={() => setShowStationSuggestions(true)}
                  placeholder="Search police station by name..."
                  className="flex-1 p-2 outline-none rounded-l"
                  required
                />
                <Search className="w-5 h-5 mx-2 text-gray-400" />
              </div>
            </div>
            <VoiceInputButton fieldName="policeStationSearch" />
          </div>
          {formErrors.policeStation && (
            <p className="text-red-500 text-sm mt-1">{formErrors.policeStation}</p>
          )}
          {showStationSuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
              {loadingStations ? (
                <div className="p-2 text-gray-500">Loading stations...</div>
              ) : policeStations.length > 0 ? (
                policeStations.map((station) => (
                  <div
                    key={station._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectPoliceStation(station)}
                  >
                    <div className="font-medium">{station.stationName}</div>
                    <div className="text-sm text-gray-600">{station.address.line}</div>
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500">
                  {searchQuery.length > 1 ? "No stations found" : "Type at least 2 characters"}
                </div>
              )}
            </div>
          )}
          <input type="hidden" name="policeStationId" value={formData.policeStationId} />
        </div>

        <div>
          <label className="block mb-1 font-medium">Incident Address: *</label>
          <div className="flex gap-2 mb-2">
            <input 
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              className="flex-1 border p-2 rounded" 
              placeholder="Enter incident location" 
              required 
            />
            <VoiceInputButton fieldName="address" />
            <button
              type="button"
              onClick={fetchCurrentLocation}
              disabled={loadingLocation}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded border border-gray-300"
            >
              <MapPin className="w-4 h-4" />
              {loadingLocation ? "Detecting..." : "Current"}
            </button>
          </div>
          {formErrors.address && (
            <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
          )}
        </div>

        <div className="flex gap-2">
          <input 
            type="text" 
            name="latitude" 
            placeholder="Latitude" 
            value={formData.latitude} 
            onChange={handleChange} 
            className="w-1/2 border p-2 rounded" 
            readOnly 
          />
          <input 
            type="text" 
            name="longitude" 
            placeholder="Longitude" 
            value={formData.longitude} 
            onChange={handleChange} 
            className="w-1/2 border p-2 rounded" 
            readOnly 
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Initial Observations: *</label>
          <div className="flex gap-2">
            <textarea 
              name="initialObservations" 
              value={formData.initialObservations} 
              onChange={handleChange} 
              className="flex-1 border p-2 rounded" 
              rows="4"
              placeholder="Describe what you observed at the scene...(Minimum 25 characters)"
              required 
            />
            <div className="flex flex-col">
              <VoiceInputButton fieldName="initialObservations" />
            </div>
          </div>
          {isListening.initialObservations && (
            <p className="text-sm text-blue-600 mt-1">🎤 Recording... Speak now</p>
          )}
          {formErrors.initialObservations && (
            <p className="text-red-500 text-sm mt-1">{formErrors.initialObservations}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Photo of Incident:</label>
          <div className="flex gap-3 flex-wrap items-center">
            <label className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300">
              <Upload className="w-5 h-5" />
              <span>Choose File</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handlePhotoSelection(e.target.files[0])} 
                className="hidden" 
              />
            </label>

            {isDesktop && (
              <button
                type="button"
                onClick={() => setShowWebcam(true)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300"
              >
                <Video className="w-5 h-5" />
                Use Webcam
              </button>
            )}
          </div>

          {showWebcam && (
            <div className="mt-4">
              <Webcam 
                ref={webcamRef} 
                screenshotFormat="image/jpeg" 
                className="w-full rounded border" 
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={captureWebcamImage}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Capture Photo
                </button>
                <button
                  type="button"
                  onClick={() => setShowWebcam(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {localPreview && (
            <div className="relative mt-3 w-32 h-32">
              <img 
                src={localPreview} 
                alt="Preview" 
                className="w-full h-full object-cover border rounded" 
              />
              <button
                type="button"
                onClick={() => {
                  setLocalPreview(null);
                  setImageFile(null);
                }}
                className="absolute top-1 right-1 bg-white p-1 rounded-full shadow hover:bg-red-200"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>
          )}
        </div>

        <fieldset className="border border-gray-300 p-4 rounded-md">
          <legend className="text-lg font-semibold text-gray-800 px-2">Reporter Details</legend>
          <div className="mt-4 space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="isAnonymous"
                  name="isAnonymous"
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={handleChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isAnonymous" className="font-medium text-gray-700">
                  I want to report anonymously
                </label>
                <p className="text-gray-500">Your name and relation will not be recorded.</p>
              </div>
            </div>

            {!formData.isAnonymous && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                <div>
                  <label htmlFor="reporterName" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                     <input
                       type="text"
                       id="reporterName"
                       name="reporterName"
                       value={formData.reporterName}
                       onChange={handleChange}
                       required={!formData.isAnonymous}
                       className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                       placeholder="Enter your name..."
                     />
                     <VoiceInputButton fieldName="reporterName" />
                  </div>
                </div>
                <div>
                  <label htmlFor="reporterRelation" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Relation to Victim <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      id="reporterRelation"
                      name="reporterRelation"
                      value={formData.reporterRelation}
                      onChange={handleChange}
                      required={!formData.isAnonymous}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Father, Friend, Sibling..."
                    />
                    <VoiceInputButton fieldName="reporterRelation" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </fieldset>

        <button 
          type="submit" 
          disabled={uploading}
          className={`w-full bg-red-600 text-white px-4 py-3 rounded hover:bg-red-700 font-medium ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {uploading ? 'Submitting Emergency FIR...' : 'Submit Emergency FIR'}
        </button>
      </div>
    </form>
  );
}

export default Emergency;