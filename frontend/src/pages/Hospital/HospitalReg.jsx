import React, { useState } from "react";
import axios from "axios";

const FACILITIES_OPTIONS = [
  "ICU", "Emergency", "Pharmacy", "Ambulance", "Laboratory", "Operation Theatre", "Blood Bank", "Cafeteria", "Parking", "MRI", "CT Scan", "X-Ray", "Dialysis", "Physiotherapy", "Burn Unit", "NICU", "PICU"
];
const DEPARTMENTS_OPTIONS = [
  "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Oncology", "Radiology",
  "Gastroenterology", "Dermatology", "ENT", "General Surgery", "Urology", "Nephrology", "Ophthalmology", "Psychiatry", "Pulmonology", "Obstetrics & Gynecology", "Dentistry", "Pathology", "Anesthesiology"
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

  // Helper for handling nested fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value }
      }));
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
    try {
      const res = await axios.post("http://localhost:3000/api/hospital/register", formData);
      alert("Registration successful!");
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
    } catch (err) {
      alert(err?.response?.data?.message || "Registration failed.");
    }
  };

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
          <div className="grid grid-cols-2 gap-2">
            <input type="text" name="address.line" value={formData.address.line} onChange={handleChange} required placeholder="Address Line" className="p-2 border rounded" />
            <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} required placeholder="City" className="p-2 border rounded" />
            <input type="text" name="address.state" value={formData.address.state} onChange={handleChange} required placeholder="State" className="p-2 border rounded" />
            <input type="text" name="address.pincode" value={formData.address.pincode} onChange={handleChange} required placeholder="Pincode" className="p-2 border rounded" />
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
        <fieldset className="border p-2 rounded">
          <legend className="font-semibold">Documents (URLs)</legend>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" name="documents.registrationCertUrl" value={formData.documents.registrationCertUrl} onChange={handleChange} placeholder="Registration Certificate URL" className="p-2 border rounded" />
            <input type="text" name="documents.nabhCertUrl" value={formData.documents.nabhCertUrl} onChange={handleChange} placeholder="NABH Certificate URL" className="p-2 border rounded" />
          </div>
        </fieldset>
        <div>
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Describe your hospital..." />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Submit</button>
      </form>
    </div>
  );
}

