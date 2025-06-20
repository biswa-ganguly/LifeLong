import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HospitalRegistrationForm from "../pages/Hospital/HospitalReg";
import PoliceStationRegistrationForm from "../pages/Police/PoliceReg";

export default function CommonAuthForm() {
  const [role, setRole] = useState(""); // 'police' or 'hospital'
  const [authType, setAuthType] = useState("register"); // 'register' or 'login'

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
          onChange={e => setRole(e.target.value)}
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
          onClick={() => setAuthType("register")}
        >
          Register
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded ${
            authType === "login" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setAuthType("login")}
        >
          Login
        </button>
      </div>

      {/* Render the appropriate registration form */}
      {authType === "register" && role === "police" && <PoliceStationRegistrationForm />}
      {authType === "register" && role === "hospital" && <HospitalRegistrationForm />}
      {authType === "login" && (
        <div className="text-center text-gray-600 mt-8">
          Login form not implemented here. Please use the dedicated login page.
        </div>
      )}
    </div>
  );
}
