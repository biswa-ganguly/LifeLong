import React, { useState, useRef, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import { Upload, Video, X, Search, MapPin } from "lucide-react";
import Webcam from "react-webcam";

function Emergency() {
  const [formData, setFormData] = useState({
    incidentType: 'Accident',
    name: '',
    gender: '',
    approximateAge: '',
    address: '',
    latitude: '',
    longitude: '',
    initialObservations: '',
    photoUrl: '',
    isAnonymous: false,
    reporterName: '',
    policeStationId: '',
    policeStationName: ''
  });

  const { user } = useUser();
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

  const webcamRef = useRef(null);
  const stationSearchRef = useRef(null);
  const isDesktop = window.innerWidth > 768;

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (stationSearchRef.current && !stationSearchRef.current.contains(event.target)) {
        setShowStationSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search police stations by name only
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
    setFormData((prev) => ({
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
    
    if (!validateForm()) {
      return;
    }

    setUploading(true);

    try {
      let uploadedImageUrl = '';
      if (imageFile) {
        uploadedImageUrl = await uploadToCloudinary(imageFile);
      }

      const payload = {
        incidentType: formData.incidentType,
        deceasedDetails: {
          name: formData.name || 'Unknown',
          gender: formData.gender,
          approximateAge: parseInt(formData.approximateAge)
        },
        incidentLocation: {
          address: formData.address,
          latitude: formData.latitude,
          longitude: formData.longitude
        },
        initialObservations: formData.initialObservations,
        photoUrl: uploadedImageUrl,
        policeStation: {
          id: formData.policeStationId,
          name: formData.policeStationName
        },
        reporter: {
          isAnonymous: formData.isAnonymous,
          name: formData.isAnonymous ? '' : formData.reporterName,
          phone: user?.phoneNumbers?.[0]?.phoneNumber || '',
          userId: user?.id || 'anonymous'
        }
      };

      const res = await fetch('http://localhost:3000/api/emergency-fir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit FIR');
      }

      alert('FIR submitted successfully!');

      // Reset form
      setFormData({
        incidentType: 'Accident',
        name: '',
        gender: '',
        approximateAge: '',
        address: '',
        latitude: '',
        longitude: '',
        initialObservations: '',
        photoUrl: '',
        isAnonymous: false,
        reporterName: '',
        policeStationId: '',
        policeStationName: ''
      });
      setLocalPreview(null);
      setImageFile(null);
      setSearchQuery('');
    } catch (err) {
      alert(err.message || 'Error submitting FIR');
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
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Emergency FIR Submission</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label>Incident Type: *</label>
          <input 
            type="text" 
            name="incidentType" 
            value={formData.incidentType} 
            onChange={handleChange} 
            className="w-full border p-2" 
            required 
          />
          {formErrors.incidentType && (
            <p className="text-red-500 text-sm mt-1">{formErrors.incidentType}</p>
          )}
        </div>

        <div>
          <label>Deceased Name (if known):</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            className="w-full border p-2" 
          />
        </div>

        <div>
          <label>Gender:</label>
          <select 
            name="gender" 
            value={formData.gender} 
            onChange={handleChange} 
            className="w-full border p-2"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label>Approximate Age:</label>
          <input 
            type="number" 
            name="approximateAge" 
            value={formData.approximateAge} 
            onChange={handleChange} 
            className="w-full border p-2" 
          />
        </div>

        {/* Police Station Search */}
        <div className="relative" ref={stationSearchRef}>
          <label>Police Station: *</label>
          <div className="flex items-center border rounded">
            <input
              type="text"
              value={searchQuery}
              onChange={handleStationSearchChange}
              onFocus={() => setShowStationSuggestions(true)}
              placeholder="Search police station by name..."
              className="flex-1 p-2 outline-none"
              required
            />
            <Search className="w-5 h-5 mx-2 text-gray-400" />
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
          <label>Incident Address: *</label>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              className="flex-1 border p-2" 
              placeholder="Enter incident location" 
              required 
            />
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
            className="w-1/2 border p-2" 
            readOnly 
          />
          <input 
            type="text" 
            name="longitude" 
            placeholder="Longitude" 
            value={formData.longitude} 
            onChange={handleChange} 
            className="w-1/2 border p-2" 
            readOnly 
          />
        </div>

        <div>
          <label>Initial Observations: *</label>
          <textarea 
            name="initialObservations" 
            value={formData.initialObservations} 
            onChange={handleChange} 
            className="w-full border p-2" 
            required 
          />
          {formErrors.initialObservations && (
            <p className="text-red-500 text-sm mt-1">{formErrors.initialObservations}</p>
          )}
        </div>

        {/* Upload or Webcam */}
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

        {/* Anonymity & Name */}
        <div>
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              name="isAnonymous" 
              checked={formData.isAnonymous} 
              onChange={handleChange} 
            />
            Report Anonymously
          </label>
        </div>

        {!formData.isAnonymous && (
          <div>
            <label>Your Name: *</label>
            <input 
              type="text" 
              name="reporterName" 
              value={formData.reporterName} 
              onChange={handleChange} 
              className="w-full border p-2" 
              required={!formData.isAnonymous} 
            />
            {formErrors.reporterName && (
              <p className="text-red-500 text-sm mt-1">{formErrors.reporterName}</p>
            )}
          </div>
        )}

        <button 
          type="submit" 
          disabled={uploading}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {uploading ? 'Submitting...' : 'Submit FIR'}
        </button>
      </form>
    </div>
  );
}

export default Emergency;