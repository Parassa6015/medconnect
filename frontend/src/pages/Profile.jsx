import React, { useState, useEffect } from "react";
import apiClient from "../api/userApiClient";
import "../style.css";
import serviceApiClient from "../api/serviceAuthApicClient";

const Profile = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    gender: "",
    dob: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fix 1: Ensure you are using the correct environment variable
  const serviceApiKey = import.meta.env.VITE_SERVICE_API_KEY;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      setError("No user data found.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const headers = { 
          'Authorization': `Bearer ${serviceApiKey}` 
        };
        const res = await serviceApiClient.get(`/users/by-auth/${storedUser.id}`, { headers });
        setUser(res.data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [serviceApiKey]);

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setError("");
    setSaving(true);
    try {
      const headers = {
        'Authorization': `Bearer ${serviceApiKey}`
      };

      // Corrected URL and added headers
      const res = await apiClient.put(`/users/by-auth/${storedUser.id}`, {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
        dob: user.dob,
        address: user.address,
      }, { headers });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      {error && <p className="error">{error}</p>}
      <div className="profile-form">
        {/* ... form fields ... */}
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Gender:
          <select
            name="gender"
            value={user.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Date of Birth:
          <input
            type="date"
            name="dob"
            value={user.dob ? user.dob.slice(0, 10) : ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={user.address}
            onChange={handleChange}
          />
        </label>
        <label>
          Role:
          <input type="text" value={user.role} readOnly />
        </label>

        <button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default Profile;