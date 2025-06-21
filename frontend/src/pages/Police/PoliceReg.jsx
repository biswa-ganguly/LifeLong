import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { Upload, X } from "lucide-react";

export default function PoliceStationRegistrationForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    stationName: "",
    registrationNumber: "",
    zone: "",
    email: "",
    phone: "",
    emergencyContact: "",
    address: {
      line: "",
      city: "",
      district: "",
      state: "",
      pincode: ""
    },
    admin: {
      name: "",
      designation: "",
      phone: "",
      email: ""
    },
    jurisdiction: "",
    documents: {
      registrationCertUrl: "",
      officerIdUrl: ""
    }
  });

  const [detectingAddress, setDetectingAddress] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [uploadingRegistrationCert, setUploadingRegistrationCert] = useState(false);
  const [uploadingOfficerId, setUploadingOfficerId] = useState(false);
  const [registrationCertPreview, setRegistrationCertPreview] = useState(null);
  const [officerIdPreview, setOfficerIdPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const addressInputRef = useRef(null);
  const registrationCertRef = useRef(null);
  const officerIdRef = useRef(null);

  // Kolkata Police Jurisdiction by Zone
  const jurisdictionOptions = {
    "North": [
      "Amherst Street", "Bowbazar", "Burrabazar", "Chitpur", "Cossipore",
      "Girish Park", "Jorabagan", "Jorasanko", "Manicktala", "Narkeldanga",
      "Shyampukur", "Sinthee", "Tala", "Taltala", "Ultadanga", "Posta",
      "Muchipara", "Phoolbagan"
    ],
    "South": [
      "Alipore", "Ballygunge", "Bhowanipore", "Chetla", "Gariahat",
      "Kalighat", "Lake", "New Alipore", "Park Street", "Shakespeare Sarani",
      "Tollygunge", "Jadavpur", "Charu Market", "Parnasree", "Rabindra Sarobar"
    ],
    "West": [
      "Garden Reach", "Ekbalpur", "Watgunge", "West Port", "South Port",
      "Metiabruz", "Taratala", "Hastings", "Maidan", "Topsia", "Entally", "Tangra"
    ],
    "East": [
      "Beleghata", "Narkeldanga", "Phoolbagan", "Ultadanga", "Manicktala",
      "Taltala", "Bowbazar", "Burrabazar", "Posta", "Muchipara"
    ],
    "Central": [
      "Lalbazar", "Bowbazar", "Burrabazar", "Posta", "Muchipara",
      "Jorasanko", "Girish Park", "Shyampukur", "Amherst Street"
    ]
  };

  // Cloudinary upload function
  const uploadToCloudinary = async (file, type) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "emergency_fir"); // Replace with your preset
    data.append("cloud_name", "dm5tuztuv"); // Replace with your Cloudinary cloud name

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dm5tuztuv/upload", {
        method: "POST",
        body: data
      });
      const imgData = await res.json();
      return imgData.secure_url;
    } catch (error) {
      console.error(`Error uploading ${type} document:`, error);
      throw error;
    }
  };

  // Handle document selection
  const handleDocumentSelection = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      if (type === "registration") {
        setUploadingRegistrationCert(true);
        setRegistrationCertPreview(URL.createObjectURL(file));
        const url = await uploadToCloudinary(file, "registration");
        setFormData(prev => ({
          ...prev,
          documents: { ...prev.documents, registrationCertUrl: url }
        }));
      } else {
        setUploadingOfficerId(true);
        setOfficerIdPreview(URL.createObjectURL(file));
        const url = await uploadToCloudinary(file, "officerId");
        setFormData(prev => ({
          ...prev,
          documents: { ...prev.documents, officerIdUrl: url }
        }));
      }
    } catch (error) {
      alert(`Failed to upload ${type} document`);
    } finally {
      if (type === "registration") {
        setUploadingRegistrationCert(false);
      } else {
        setUploadingOfficerId(false);
      }
    }
  };

  // Remove document
  const removeDocument = (type) => {
    if (type === "registration") {
      setRegistrationCertPreview(null);
      setFormData(prev => ({
        ...prev,
        documents: { ...prev.documents, registrationCertUrl: "" }
      }));
      if (registrationCertRef.current) {
        registrationCertRef.current.value = "";
      }
    } else {
      setOfficerIdPreview(null);
      setFormData(prev => ({
        ...prev,
        documents: { ...prev.documents, officerIdUrl: "" }
      }));
      if (officerIdRef.current) {
        officerIdRef.current.value = "";
      }
    }
  };

  // Debounce the address search to avoid too many API calls
  const fetchAddressSuggestions = debounce(async (query) => {
    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    try {
      setIsFetchingSuggestions(true);
      const response = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      setAddressSuggestions(data.features || []);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setAddressSuggestions([]);
    } finally {
      setIsFetchingSuggestions(false);
    }
  }, 300);

  // Handle address input changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const key = name.split(".")[1];
    
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [key]: value }
    }));

    // Only fetch suggestions for the address line field
    if (name === "address.line") {
      fetchAddressSuggestions(value);
    }
  };

  // Handle address suggestion selection
  const handleSelectSuggestion = (suggestion) => {
    const props = suggestion.properties;
    const address = {
      line: props.name || props.street || "",
      city: props.city || props.town || props.village || "",
      district: props.county || props.state_district || "",
      state: props.state || "",
      pincode: props.postcode || ""
    };

    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        ...address
      }
    }));

    setAddressSuggestions([]);
    setShowSuggestions(false);
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addressInputRef.current && !addressInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested fields
    if (name.startsWith("address.")) {
      handleAddressChange(e);
    } else if (name.startsWith("admin.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        admin: { ...prev.admin, [key]: value }
      }));
    } else if (name.startsWith("documents.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        documents: { ...prev.documents, [key]: value }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
      
      // Reset jurisdiction when zone changes
      if (name === "zone") {
        setFormData((prev) => ({
          ...prev,
          jurisdiction: ""
        }));
      }
    }
  };

  // Address auto-detect handler
  const handleDetectAddress = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setDetectingAddress(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        const address = data.address || {};
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            line: data.display_name || "",
            city: address.city || address.town || address.village || "",
            district: address.county || address.state_district || "",
            state: address.state || "",
            pincode: address.postcode || ""
          }
        }));
      } catch (err) {
        alert("Failed to detect address. Please fill manually.");
      } finally {
        setDetectingAddress(false);
      }
    }, (err) => {
      alert("Failed to get your location. Please allow location access or fill manually.");
      setDetectingAddress(false);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await axios.post("http://localhost:3000/api/police/register", formData);
      alert("Registration successful!");
      
      // Reset form
      setFormData({
        username: "",
        password: "",
        stationName: "",
        registrationNumber: "",
        zone: "",
        email: "",
        phone: "",
        emergencyContact: "",
        address: {
          line: "",
          city: "",
          district: "",
          state: "",
          pincode: ""
        },
        admin: {
          name: "",
          designation: "",
          phone: "",
          email: ""
        },
        jurisdiction: "",
        documents: {
          registrationCertUrl: "",
          officerIdUrl: ""
        }
      });
      
      setRegistrationCertPreview(null);
      setOfficerIdPreview(null);
      
    } catch (err) {
      alert(err?.response?.data?.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render documents fieldset
  const renderDocumentsFieldset = () => (
    <fieldset className="border p-2 rounded">
      <legend className="font-semibold">Documents</legend>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block mb-2">Registration Certificate:</label>
          <input
            type="file"
            ref={registrationCertRef}
            onChange={(e) => handleDocumentSelection(e, "registration")}
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
          />
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => registrationCertRef.current.click()}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300"
              disabled={uploadingRegistrationCert}
            >
              <Upload className="w-5 h-5" />
              {uploadingRegistrationCert ? "Uploading..." : "Choose File"}
            </button>
            {registrationCertPreview && (
              <div className="relative">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Document selected</span>
                  <button
                    type="button"
                    onClick={() => removeDocument("registration")}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-2">Officer ID Proof:</label>
          <input
            type="file"
            ref={officerIdRef}
            onChange={(e) => handleDocumentSelection(e, "officerId")}
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
          />
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => officerIdRef.current.click()}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300"
              disabled={uploadingOfficerId}
            >
              <Upload className="w-5 h-5" />
              {uploadingOfficerId ? "Uploading..." : "Choose File"}
            </button>
            {officerIdPreview && (
              <div className="relative">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Document selected</span>
                  <button
                    type="button"
                    onClick={() => removeDocument("officerId")}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </fieldset>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Police Station Registration Form</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div>
          <label>Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label>Station Name</label>
          <input type="text" name="stationName" value={formData.stationName} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label>Registration Number</label>
          <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label>Zone</label>
          <select name="zone" value={formData.zone} onChange={handleChange} required className="w-full p-2 border rounded">
            <option value="">-- Select Zone --</option>
            <option value="North">North Kolkata Zone</option>
            <option value="South">South Kolkata Zone</option>
            <option value="West">West Kolkata Zone</option>
            <option value="East">East Kolkata Zone</option>
            <option value="Central">Central Kolkata Zone</option>
          </select>
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label>Phone</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label>Emergency Contact</label>
          <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} required className="w-full p-2 border rounded" placeholder="e.g. 100" />
        </div>
        
        <fieldset className="border p-2 rounded">
          <legend className="font-semibold">Address</legend>
          <button
            type="button"
            className="mb-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            onClick={handleDetectAddress}
            disabled={detectingAddress}
          >
            {detectingAddress ? "Detecting..." : "Detect Address"}
          </button>
          <div className="grid grid-cols-2 gap-2 relative" ref={addressInputRef}>
            <div className="relative col-span-2">
              <input
                type="text"
                name="address.line"
                value={formData.address.line}
                onChange={handleAddressChange}
                onFocus={() => setShowSuggestions(true)}
                required
                placeholder="Start typing address..."
                className="w-full p-2 border rounded"
                autoComplete="off"
              />
              {showSuggestions && formData.address.line.length > 2 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
                  {isFetchingSuggestions ? (
                    <div className="p-2 text-gray-500">Loading suggestions...</div>
                  ) : addressSuggestions.length > 0 ? (
                    addressSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectSuggestion(suggestion)}
                      >
                        <div className="font-medium">
                          {suggestion.properties.name || suggestion.properties.street}
                        </div>
                        <div className="text-sm text-gray-600">
                          {[
                            suggestion.properties.city,
                            suggestion.properties.state,
                            suggestion.properties.country
                          ].filter(Boolean).join(", ")}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">No suggestions found</div>
                  )}
                </div>
              )}
            </div>
            <input
              type="text"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              required
              placeholder="City"
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="address.district"
              value={formData.address.district}
              onChange={handleChange}
              required
              placeholder="District"
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="address.state"
              value={formData.address.state}
              onChange={handleChange}
              required
              placeholder="State"
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="address.pincode"
              value={formData.address.pincode}
              onChange={handleChange}
              required
              placeholder="Pincode"
              className="p-2 border rounded"
            />
          </div>
        </fieldset>

        <fieldset className="border p-2 rounded">
          <legend className="font-semibold">Admin Details</legend>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" name="admin.name" value={formData.admin.name} onChange={handleChange} required placeholder="Admin Name" className="p-2 border rounded" />
            <input type="text" name="admin.designation" value={formData.admin.designation} onChange={handleChange} required placeholder="Designation" className="p-2 border rounded" />
            <input type="text" name="admin.phone" value={formData.admin.phone} onChange={handleChange} required placeholder="Admin Phone" className="p-2 border rounded" />
            <input type="email" name="admin.email" value={formData.admin.email} onChange={handleChange} required placeholder="Admin Email" className="p-2 border rounded" />
          </div>
        </fieldset>
        
        <div>
          <label>Jurisdiction</label>
          <select 
            name="jurisdiction" 
            value={formData.jurisdiction} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border rounded"
            disabled={!formData.zone}
          >
            <option value="">
              {formData.zone ? `-- Select ${formData.zone} Kolkata Jurisdiction --` : "-- Please select a zone first --"}
            </option>
            {formData.zone && jurisdictionOptions[formData.zone]?.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {renderDocumentsFieldset()}

        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}