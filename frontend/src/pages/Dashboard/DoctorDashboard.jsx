import React, { useState } from "react";
import { Link } from "react-router-dom";
import DoctorProfileForm from "../../components/Profile/DoctorProfileForm";

const DoctorDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const [showProfile, setShowProfile] = useState(false);

  if (!user || !token || user.role !== "doctor") {
    return (
      <div className="dashboard-container">
        <p>Unauthorized: You are not allowed to view this page.</p>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome, Dr. {user.firstName}</h2>
      <p>Role: {user.role}</p>

      <div className="dashboard-links">
        <Link to="/appointments">View Appointments</Link>
        <Link to="/notifications">View Notifications</Link>
        <Link to="/patients">Patient Records (Coming Soon)</Link>
      </div>

      <button onClick={() => setShowProfile(!showProfile)}>
        {showProfile ? "Hide Doctor Profile" : "Edit Doctor Profile"}
      </button>

      {showProfile && (
        <div style={{ marginTop: "20px" }}>
          <DoctorProfileForm />
        </div>
      )}

      <button onClick={handleLogout} style={{ marginTop: "20px" }}>
        Logout
      </button>
    </div>
  );
};

export default DoctorDashboard;
