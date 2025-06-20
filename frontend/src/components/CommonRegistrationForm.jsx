import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CommonAuthForm() {
  const navigate = useNavigate();

  const [role, setRole] = useState(""); // 'police' or 'hospital'
  const [authType, setAuthType] = useState("register"); // 'register' or 'login'
  const [formData, setFormData] = useState({ 
    name: "", 
    address: "", 
    phone: "", 
    email: "", 
    username: "", 
    password: "" 
  });

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setFormData({ 
      name: "", 
      address: "", 
      phone: "", 
      email: "", 
      username: "", 
      password: "" 
    });
  };

  const handleAuthTypeChange = (type) => {
    setAuthType(type);
    setFormData({ 
      name: "", 
      address: "", 
      phone: "", 
      email: "", 
      username: "", 
      password: "" 
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select Police or Hospital.");
      return;
    }
  
    const endpointBase = `http://localhost:3000/api/${role}`;

    // If registering, we send all formData; if logging in, we send only credentials
    const endpoint = authType === "register" 
      ? `${endpointBase}/register` 
      : `${endpointBase}/login`;

    const payload = 
      authType === "register" ? formData : {
        username: formData.username,
        password: formData.password,
      };

    try {
      const res = await axios.post(endpoint, payload);
      alert(`${authType === "register" ? "Registration" : "Login"} successful!`);

      if (authType === "login") {
        // Only navigate after login
        navigate(`/${role}/admin`);
      } else {
        // After registration, clear form or show a message
        setFormData({ 
          name: "", 
          address: "", 
          phone: "", 
          email: "", 
          username: "", 
          password: "" 
        });
      }
    } catch (err) {
      console.error("Auth failed:", err?.response?.data?.message);
      alert(err?.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 shadow-xl bg-white mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Police / Hospital Portal
      </h2>

      {/* Role selection */}
      <div className="mb-4">
        <label className="font-semibold block mb-2">
          Select Role:
        </label>
        <select
          value={role}
          onChange={handleRoleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Select --</option>
          <option value="police">Police Station</option>
          <option value="hospital">Hospital</option>
        </select>
      </div>

      {/* Auth Type Selection */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          type="button"
          className={`px-4 py-2 rounded ${
            authType === "register" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleAuthTypeChange("register")}
        >
          Register
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded ${
            authType === "login" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleAuthTypeChange("login")}
        >
          Login
        </button>
      </div>

      {/* Form */}
      {role && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {authType === "register" && (
            <>
              <div>
                <label>{role === "police" ? "Police Station Name" : "Hospital Name"}</label>
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
                <label>Phone</label>
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
            </>
          )}

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
            className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {authType === "register" ? "Register" : "Login"}
          </button>
        </form>
      )}

    </div>
  )
}
