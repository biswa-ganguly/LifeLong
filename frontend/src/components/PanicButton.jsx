import React, { useState } from "react";
import axios from "axios";

const PanicButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handlePanicTap = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get user's location
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      // Send emergency alert to backend
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/emergency/panic-tap`, {
        location: {
          latitude,
          longitude,
        },
      });

      setSuccess(true);
      console.log("Response:", response.data);
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={handlePanicTap} 
        disabled={isLoading}
        style={{ padding: "10px 20px", background: "red", color: "white" }}
      >
        {isLoading ? "Sending Alert..." : "EMERGENCY HELP!"}
      </button>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {success && <p style={{ color: "green" }}>Alert sent! Help is on the way.</p>}
    </div>
  );
};

export default PanicButton;