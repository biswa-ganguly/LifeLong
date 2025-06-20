import React, { useState } from "react";
import axios from "axios";

export default function PoliceStationRegistrationForm() {
  const [formData, setFormData] = useState({
    stationName: "",
    type: "",
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
    },
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle nested fields
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/police/register", formData);
      alert("Registration successful!");
      setFormData({
        stationName: "",
        type: "",
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
        },
        username: "",
        password: ""
      });
    } catch (err) {
      alert(err?.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Police Station Registration Form</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div>
          <label>Police Station Name</label>
          <input type="text" name="stationName" value={formData.stationName} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label>Type</label>
          <input type="text" name="type" value={formData.type} onChange={handleChange} required className="w-full p-2 border rounded" placeholder="e.g. City Police" />
        </div>
        <div>
          <label>Registration Number</label>
          <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label>Zone</label>
          <input type="text" name="zone" value={formData.zone} onChange={handleChange} required className="w-full p-2 border rounded" />
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
          <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} required className="w-full p-2 border rounded" placeholder="e.g. 100" />
        </div>
        <fieldset className="border p-2 rounded">
          <legend className="font-semibold">Address</legend>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" name="address.line" value={formData.address.line} onChange={handleChange} required placeholder="Address Line" className="p-2 border rounded" />
            <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} required placeholder="City" className="p-2 border rounded" />
            <input type="text" name="address.district" value={formData.address.district} onChange={handleChange} required placeholder="District" className="p-2 border rounded" />
            <input type="text" name="address.state" value={formData.address.state} onChange={handleChange} required placeholder="State" className="p-2 border rounded" />
            <input type="text" name="address.pincode" value={formData.address.pincode} onChange={handleChange} required placeholder="Pincode" className="p-2 border rounded" />
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
          <input type="text" name="jurisdiction" value={formData.jurisdiction} onChange={handleChange} required className="w-full p-2 border rounded" placeholder="Comma separated areas" />
        </div>
        <fieldset className="border p-2 rounded">
          <legend className="font-semibold">Documents (URLs)</legend>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" name="documents.registrationCertUrl" value={formData.documents.registrationCertUrl} onChange={handleChange} required placeholder="Registration Certificate URL" className="p-2 border rounded" />
            <input type="text" name="documents.officerIdUrl" value={formData.documents.officerIdUrl} onChange={handleChange} required placeholder="Officer ID URL" className="p-2 border rounded" />
          </div>
        </fieldset>
        <div>
          <label>Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Submit</button>
      </form>
    </div>
  );
}

