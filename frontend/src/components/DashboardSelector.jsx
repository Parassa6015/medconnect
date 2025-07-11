// src/components/DashboardSelector.jsx
import React from "react";
import Dashboard from "../pages/Dashboard/Dashboard";
import DoctorDashboard from "../pages/Dashboard/DoctorDashboard";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";

const DashboardSelector = () => {
  // Get saved user info from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // If no user, render nothing or a fallback
  if (!user) return <p>User not found.</p>;

  // Decide which dashboard to show
  if (user.role === "doctor") return <DoctorDashboard />;
  if (user.role === "admin") return <AdminDashboard />;
  return <Dashboard />;
};

export default DashboardSelector;
