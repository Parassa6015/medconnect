import React, { useState, useEffect } from "react";
import apiClient from "../../api/UserApiClient"; // Make sure this points to user-service
const user = JSON.parse(localStorage.getItem("user"));

const DoctorProfileForm = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get(`/doctor-profiles/by-user/${user.id}`);
        setProfile(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setProfile({
            specialization: "",
            qualifications: [],
            experience: "",
            clinicAddress: "",
            phone: "",
            bio: "",
          });
        } else {
          setError("Failed to load profile.");
        }
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: name === "qualifications" ? value.split(",") : value,
    }));
  };

  const handleSave = async () => {
    try {
      const res = await apiClient.put(`/doctor-profiles/${user.id}`, profile);
      setProfile(res.data);
      setMessage("Profile updated successfully.");
      setEditing(false);
    } catch (err) {
      setError("Error updating profile.",err);
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <h2>Doctor Profile</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={styles.field}>
        <label>Specialization:</label>
        {editing ? (
          <input name="specialization" value={profile.specialization} onChange={handleChange} />
        ) : (
          <p>{profile.specialization || "N/A"}</p>
        )}
      </div>

      <div style={styles.field}>
        <label>Qualifications (comma-separated):</label>
        {editing ? (
          <input name="qualifications" value={profile.qualifications.join(", ")} onChange={handleChange} />
        ) : (
          <ul>{(profile.qualifications || []).map((q, i) => <li key={i}>{q}</li>)}</ul>
        )}
      </div>

      <div style={styles.field}>
        <label>Experience (in years):</label>
        {editing ? (
          <input name="experience" type="number" value={profile.experience} onChange={handleChange} />
        ) : (
          <p>{profile.experience || "N/A"} years</p>
        )}
      </div>

      <div style={styles.field}>
        <label>Clinic Address:</label>
        {editing ? (
          <input name="clinicAddress" value={profile.clinicAddress} onChange={handleChange} />
        ) : (
          <p>{profile.clinicAddress || "N/A"}</p>
        )}
      </div>

      <div style={styles.field}>
        <label>Phone:</label>
        {editing ? (
          <input name="phone" value={profile.phone} onChange={handleChange} />
        ) : (
          <p>{profile.phone || "N/A"}</p>
        )}
      </div>

      <div style={styles.field}>
        <label>Bio:</label>
        {editing ? (
          <textarea name="bio" value={profile.bio} onChange={handleChange} />
        ) : (
          <p>{profile.bio || "N/A"}</p>
        )}
      </div>

      <div style={styles.buttons}>
        {editing ? (
          <>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </>
        ) : (
          <button onClick={() => setEditing(true)}>Edit</button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    padding: "20px",
    background: "#f9f9f9",
    borderRadius: "8px",
  },
  field: {
    marginBottom: "15px",
  },
  buttons: {
    marginTop: "20px",
  },
};

export default DoctorProfileForm;
