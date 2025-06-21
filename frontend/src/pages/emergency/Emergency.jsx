import React, { useState, useRef } from 'react';
import { useUser } from "@clerk/clerk-react";
import { Upload, Video, X } from "lucide-react";
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
    reporterName: ''
  });

  const { user } = useUser();
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const webcamRef = useRef(null);
  const isDesktop = window.innerWidth > 768;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const fetchLocation = () => {
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          const data = await response.json();
          setFormData((prev) => ({
            ...prev,
            address: data.display_name || '',
            latitude: lat.toString(),
            longitude: lon.toString()
          }));
        } catch {
          alert('Failed to fetch address');
        } finally {
          setLoadingLocation(false);
        }
      },
      () => {
        alert('Location access denied');
        setLoadingLocation(false);
      }
    );
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
    data.append("upload_preset", "emergency_fir"); // Replace with your preset
    data.append("cloud_name", "dm5tuztuv");        // Replace with your Cloudinary cloud name

    const res = await fetch("https://api.cloudinary.com/v1_1/dm5tuztuv/image/upload", {
      method: "POST",
      body: data
    });

    const imgData = await res.json();
    return imgData.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      alert(data.message || 'FIR submitted successfully!');

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
        reporterName: ''
      });
      setLocalPreview(null);
      setImageFile(null);
    } catch (err) {
      alert('Error submitting FIR');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Emergency FIR Submission</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label>Incident Type:</label>
          <input type="text" name="incidentType" value={formData.incidentType} onChange={handleChange} className="w-full border p-2" />
        </div>

        <div>
          <label>Deceased Name (if known):</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border p-2" />
        </div>

        <div>
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border p-2">
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label>Approximate Age:</label>
          <input type="number" name="approximateAge" value={formData.approximateAge} onChange={handleChange} className="w-full border p-2" />
        </div>

        <div>
          <label>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border p-2" placeholder="Enter or use current location" />
          <button type="button" onClick={fetchLocation} className="mt-2 text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300" disabled={loadingLocation}>
            {loadingLocation ? 'Detecting Location...' : 'Use My Current Location'}
          </button>
        </div>

        <div className="flex gap-2">
          <input type="text" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleChange} className="w-1/2 border p-2" />
          <input type="text" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleChange} className="w-1/2 border p-2" />
        </div>

        <div>
          <label>Initial Observations:</label>
          <textarea name="initialObservations" value={formData.initialObservations} onChange={handleChange} className="w-full border p-2" />
        </div>

        {/* Upload or Webcam */}
        <div>
          <label className="block mb-1 font-medium">Photo of Incident:</label>
          <div className="flex gap-3 flex-wrap items-center">
            <label className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300">
              <Upload className="w-5 h-5" />
              <span>Choose File</span>
              <input type="file" accept="image/*" onChange={(e) => handlePhotoSelection(e.target.files[0])} className="hidden" />
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
              <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-full rounded border" />
              <button
                type="button"
                onClick={captureWebcamImage}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Capture Photo
              </button>
            </div>
          )}

          {localPreview && (
            <div className="relative mt-3 w-32 h-32">
              <img src={localPreview} alt="Preview" className="w-full h-full object-cover border rounded" />
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
            <input type="checkbox" name="isAnonymous" checked={formData.isAnonymous} onChange={handleChange} />
            Report Anonymously
          </label>
        </div>

        {!formData.isAnonymous && (
          <div>
            <label>Your Name:</label>
            <input type="text" name="reporterName" value={formData.reporterName} onChange={handleChange} className="w-full border p-2" />
          </div>
        )}

        <button type="submit" disabled={uploading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {uploading ? 'Submitting...' : 'Submit FIR'}
        </button>
      </form>
    </div>
  );
}

export default Emergency;
