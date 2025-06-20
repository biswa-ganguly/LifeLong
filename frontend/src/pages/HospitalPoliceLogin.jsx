import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function HospitalPoliceLogin({ role: propRole }) {
  const [role, setRole] = useState(propRole || "");
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let res;
      if (role === "hospital") {
        res = await axios.post("http://localhost:3000/api/hospital/login", {
          username: form.username,
          password: form.password,
        });
        localStorage.setItem("hospital_token", res.data.token);
        navigate(`/hospital/admin/${res.data?.hospitalId || ''}`);
      } else if (role === "police") {
        res = await axios.post("http://localhost:3000/api/police/login", {
          username: form.username,
          password: form.password,
        });
        localStorage.setItem("police_token", res.data.token);
        navigate("/police/admin");
      } else {
        setError("Please select a role.");
        setLoading(false);
        return;
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  // Only show role selection if not provided as prop
  const showRoleSelect = !propRole;

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Hospital / Police Login</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {showRoleSelect && (
          <div>
            <label className="block mb-2 font-semibold">Select Role:</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">-- Select --</option>
              <option value="hospital">Hospital</option>
              <option value="police">Police Station</option>
            </select>
          </div>
        )}
        {(role === "hospital" || role === "police") && (
          <>
            <div>
              <label className="block mb-2 font-semibold">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </>
        )}
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded text-white font-semibold ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <div className="text-red-600 text-center mt-2">{error}</div>}
      </form>
    </div>
  );
} 