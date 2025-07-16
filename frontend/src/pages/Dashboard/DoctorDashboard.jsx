import React from "react";
import { Link } from "react-router-dom";

const DoctorDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

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
        <Link to="/profile">My Profile</Link>
        <Link to="/patients">Patient Records (Coming Soon)</Link>
      </div>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DoctorDashboard;
