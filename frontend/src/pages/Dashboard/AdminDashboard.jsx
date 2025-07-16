import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!user || !token || user.role !== "admin") {
    return (
      <div className="dashboard-container">
        <p>Unauthorized: Admin access only.</p>
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
      <h2>Welcome, {user.firstName}</h2>
      <p>Role: {user.role}</p>

      <div className="dashboard-links">
        <Link to="/appointments">Manage All Appointments</Link>
        <Link to="/notifications">System Notifications</Link>
        <Link to="/profile">My Profile</Link>
        <Link to="/admin/users">Manage Users (Coming Soon)</Link>
      </div>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
