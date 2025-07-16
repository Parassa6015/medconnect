import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardSelector from "./components/DashboardSelector";
import DoctorDashboard from "./pages/Dashboard/DoctorDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import NotificationList from "./components/Notifications/NotificationList.jsx";
import AppointmentList from "./components/Appointments/AppointmentList";
import MeetingDashboard from "./pages/MeetingDashboard";
import Profile from "./pages/Profile";
import DoctorAvailability from "./pages/DoctorAvailability";
import Home from "./pages/Home";

import Header from "./components/layout/Header.jsx";

const App = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/appointments" element={isAuthenticated ? <AppointmentList /> : <Navigate to="/login" />} />
        <Route path="/notifications" element={isAuthenticated ? <NotificationList /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={isAuthenticated ? <DashboardSelector /> : <Navigate to="/login" />} />
        <Route path="/doctor-dashboard" element={isAuthenticated ? <DoctorDashboard /> : <Navigate to="/login" />} />
        <Route path="/admin-dashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/meeting" element={isAuthenticated ? <MeetingDashboard /> : <Navigate to="/login" />} />
        <Route path="/doctor-availability" element={isAuthenticated ? <DoctorAvailability /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
