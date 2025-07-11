import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AppointmentsPage from "./pages/AppointmentPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardSelector from "./components/DashboardSelector";
import DoctorDashboard from "./pages/Dashboard/DoctorDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import NotificationList from "./components/Notifications/NotificationList.jsx"


const App = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/notifications" element={<NotificationList />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route
            path="/dashboard"
            element={isAuthenticated ? <DashboardSelector /> : <Navigate to="/login" />}
        />
        <Route
          path="/doctor-dashboard"
          element={
            isAuthenticated ? <DoctorDashboard /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
