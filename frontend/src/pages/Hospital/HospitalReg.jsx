import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { Upload, X } from "lucide-react";

const FACILITIES_OPTIONS = [
  "ICU", "Emergency", "Pharmacy", "Ambulance", "Laboratory", "Operation Theatre", 
  "Blood Bank", "Cafeteria", "Parking", "MRI", "CT Scan", "X-Ray", "Dialysis", 
  "Physiotherapy", "Burn Unit", "NICU", "PICU"
];

const DEPARTMENTS_OPTIONS = [
  "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Oncology", "Radiology",
  "Gastroenterology", "Dermatology", "ENT", "General Surgery", "Urology", 
  "Nephrology", "Ophthalmology", "Psychiatry", "Pulmonology", "Obstetrics & Gynecology", 
  "Dentistry", "Pathology", "Anesthesiology"
];

export default function HospitalRegistrationForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    type: "",
    registrationNumber: "",
    nabhNumber: "",
    email: "",
    phone: "",
    emergencyContact: "",
    address: {
      line: "",
      city: "",
      state: "",
      pincode: ""
    },
    admin: {
      name: "",
      email: "",
      phone: ""
    },
    facilities: [],
    departments: [],
    documents: {
      registrationCertUrl: "",
      nabhCertUrl: ""
    },
    description: ""
  });

  const [otherFacilityChecked, setOtherFacilityChecked] = useState(false);
  const [otherFacility, setOtherFacility] = useState("");
  const [otherDepartmentChecked, setOtherDepartmentChecked] = useState(false);
  const [otherDepartment, setOtherDepartment] = useState("");
  const [detectingAddress, setDetectingAddress] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [uploadingRegistrationCert, setUploadingRegistrationCert] = useState(false);
  const [uploadingNabhCert, setUploadingNabhCert] = useState(false);
  const [registrationCertPreview, setRegistrationCertPreview] = useState(null);
  const [nabhCertPreview, setNabhCertPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const addressInputRef = useRef(null);
  const registrationCertRef = useRef(null);
  const nabhCertRef = useRef(null);

  // Cloudinary upload function
  const uploadToCloudinary = async (file, type) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "emergency_fir"); // Replace with your preset
    data.append("cloud_name", "dm5tuztuv");  // Replace with your Cloudinary cloud name

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
        setUploadingNabhCert(true);
        setNabhCertPreview(URL.createObjectURL(file));
        const url = await uploadToCloudinary(file, "nabh");
        setFormData(prev => ({
          ...prev,
          documents: { ...prev.documents, nabhCertUrl: url }
        }));
      }
    } catch (error) {
      alert(`Failed to upload ${type} document`);
    } finally {
      if (type === "registration") {
        setUploadingRegistrationCert(false);
      } else {
        setUploadingNabhCert(false);
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
      setNabhCertPreview(null);
      setFormData(prev => ({
        ...prev,
        documents: { ...prev.documents, nabhCertUrl: "" }
      }));
      if (nabhCertRef.current) {
        nabhCertRef.current.value = "";
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

  // Helper for handling nested fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  // Handle checkbox for facilities and departments
  const handleCheckboxChange = (e, group) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const arr = prev[group] || [];
      if (checked) {
        return { ...prev, [group]: [...arr, value] };
      } else {
        return { ...prev, [group]: arr.filter((item) => item !== value) };
      }
    });
  };

  // Handle 'Other' checkbox for facilities
  const handleOtherFacilityCheckbox = (e) => {
    setOtherFacilityChecked(e.target.checked);
    if (!e.target.checked) {
      setOtherFacility("");
      setFormData((prev) => ({
        ...prev,
        facilities: prev.facilities.filter((item) => item !== otherFacility)
      }));
    }
  };

  // Handle 'Other' input for facilities
  const handleOtherFacilityInput = (e) => {
    const value = e.target.value;
    setOtherFacility(value);
    setFormData((prev) => {
      // Remove previous otherFacility if present
      const filtered = prev.facilities.filter((item) => item !== otherFacility);
      return {
        ...prev,
        facilities: value ? [...filtered, value] : filtered
      };
    });
  };

  // Handle 'Other' checkbox for departments
  const handleOtherDepartmentCheckbox = (e) => {
    setOtherDepartmentChecked(e.target.checked);
    if (!e.target.checked) {
      setOtherDepartment("");
      setFormData((prev) => ({
        ...prev,
        departments: prev.departments.filter((item) => item !== otherDepartment)
      }));
    }
  };

  // Handle 'Other' input for departments
  const handleOtherDepartmentInput = (e) => {
    const value = e.target.value;
    setOtherDepartment(value);
    setFormData((prev) => {
      // Remove previous otherDepartment if present
      const filtered = prev.departments.filter((item) => item !== otherDepartment);
      return {
        ...prev,
        departments: value ? [...filtered, value] : filtered
      };
    });
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
            line: data.display_name || "",
            city: address.city || address.town || address.village || "",
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
      const res = await axios.post("http://localhost:3000/api/hospital/register", formData);
      alert("Registration successful!");
      
      // Reset form
      setFormData({
        username: "",
        password: "",
        name: "",
        type: "",
        registrationNumber: "",
        nabhNumber: "",
        email: "",
        phone: "",
        emergencyContact: "",
        address: {
          line: "",
          city: "",
          state: "",
          pincode: ""
        },
        admin: {
          name: "",
          email: "",
          phone: ""
        },
        facilities: [],
        departments: [],
        documents: {
          registrationCertUrl: "",
          nabhCertUrl: ""
        },
        description: ""
      });
      
      setOtherFacilityChecked(false);
      setOtherFacility("");
      setOtherDepartmentChecked(false);
      setOtherDepartment("");
      setRegistrationCertPreview(null);
      setNabhCertPreview(null);
      
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
          <label className="block mb-2">NABH Certificate:</label>
          <input
            type="file"
            ref={nabhCertRef}
            onChange={(e) => handleDocumentSelection(e, "nabh")}
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
          />
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => nabhCertRef.current.click()}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300"
              disabled={uploadingNabhCert}
            >
              <Upload className="w-5 h-5" />
              {uploadingNabhCert ? "Uploading..." : "Choose File"}
            </button>
            {nabhCertPreview && (
              <div className="relative">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Document selected</span>
                  <button
                    type="button"
                    onClick={() => removeDocument("nabh")}
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
      <h2 className="text-2xl font-bold mb-6">Hospital Registration Form</h2>
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
          <label>Hospital Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label>Type</label>
          <select name="type" value={formData.type} onChange={handleChange} required className="w-full p-2 border rounded">
            <option value="">-- Select Type --</option>
            <option value="Private">Private</option>
            <option value="Government">Government</option>
          </select>
        </div>
        <div>
          <label>Registration Number</label>
          <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label>NABH Number</label>
          <input type="text" name="nabhNumber" value={formData.nabhNumber} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label>Phone Number</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label>Emergency Contact</label>
          <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="w-full p-2 border rounded" />
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
            <input type="email" name="admin.email" value={formData.admin.email} onChange={handleChange} required placeholder="Admin Email" className="p-2 border rounded" />
            <input type="tel" name="admin.phone" value={formData.admin.phone} onChange={handleChange} required placeholder="Admin Phone" className="p-2 border rounded" />
          </div>
        </fieldset>
        <fieldset className="border p-2 rounded">
          <legend className="font-semibold">Facilities</legend>
          <div className="flex flex-wrap gap-4">
            {FACILITIES_OPTIONS.map((facility) => (
              <label key={facility} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="facilities"
                  value={facility}
                  checked={formData.facilities.includes(facility)}
                  onChange={(e) => handleCheckboxChange(e, "facilities")}
                />
                {facility}
              </label>
            ))}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="facilitiesOther"
                checked={otherFacilityChecked}
                onChange={handleOtherFacilityCheckbox}
              />
              Other
            </label>
            {otherFacilityChecked && (
              <input
                type="text"
                className="border rounded p-1"
                placeholder="Other facility"
                value={otherFacility}
                onChange={handleOtherFacilityInput}
              />
            )}
          </div>
        </fieldset>
        <fieldset className="border p-2 rounded">
          <legend className="font-semibold">Departments</legend>
          <div className="flex flex-wrap gap-4">
            {DEPARTMENTS_OPTIONS.map((dept) => (
              <label key={dept} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="departments"
                  value={dept}
                  checked={formData.departments.includes(dept)}
                  onChange={(e) => handleCheckboxChange(e, "departments")}
                />
                {dept}
              </label>
            ))}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="departmentsOther"
                checked={otherDepartmentChecked}
                onChange={handleOtherDepartmentCheckbox}
              />
              Other
            </label>
            {otherDepartmentChecked && (
              <input
                type="text"
                className="border rounded p-1"
                placeholder="Other department"
                value={otherDepartment}
                onChange={handleOtherDepartmentInput}
              />
            )}
          </div>
        </fieldset>

        {renderDocumentsFieldset()}

        <div>
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Describe your hospital..." />
        </div>
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