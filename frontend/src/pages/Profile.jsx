import React, { useState, useEffect } from "react";
import apiClient from "../api/userApiClient";
import "../style.css";

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

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log("Loaded user from storage:", storedUser);

    if (!storedUser) {
      setError("No user data found.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await apiClient.get(`/users/by-auth/${storedUser.id}`);
        console.log("Fetched full profile:", res.data);
        setUser(res.data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);


  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setError("");
    setSaving(true);
    try {
      const res = await apiClient.put(`/users/${storedUser.id} `, {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
        dob: user.dob,
        address: user.address,
      });

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
