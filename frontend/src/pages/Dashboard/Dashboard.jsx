import React from "react";
import { Link } from "react-router-dom";


const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user")); // We'll store this when logging in
  const token = localStorage.getItem("token");

  if (!user || !token) {
    return (
      <div className="dashboard-container">
        <p>You are not logged in.</p>
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
      <h2>Welcome, {user.name}</h2>
      <p>Role: {user.role}</p>

      <div className="dashboard-links">
        <Link to="/appointments">View Appointments</Link>
        <Link to="/notifications">View Notifications</Link>
        <Link to="/profile">My Profile</Link>
        <Link to="/meeting">Join Meeting</Link>
        <Link to="/doctors">Find & Book Appointment</Link>
      </div>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
