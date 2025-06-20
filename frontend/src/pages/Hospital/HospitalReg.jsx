import React, { useState } from "react";
import axios from "axios";

export default function HospitalRegistrationForm() {
  const [formData, setFormData] = useState({ 
    name: "", 
    address: "", 
    phone: "", 
    email: "", 
    username: "", 
    password: "" 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('About to submit form with data!', formData);

    try {
      // Send a POST request to your backend API
      const res = await axios.post("http://localhost:3000/api/hospital/register", formData);
      console.log("Registration successful!", res.data);
      alert("Registration successful!");
      // Clear form after submission
      setFormData({ 
        name: "", 
        address: "", 
        phone: "", 
        email: "", 
        username: "", 
        password: "" 
      });
    } catch (err) {
      console.error("Registration failed.", err?.response?.data?.message);
      alert(err?.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 shadow-xl">
      <div>
        <h2 className="text-2xl font-bold mb-6">Hospital Registration Form</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <label>Hospital Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

