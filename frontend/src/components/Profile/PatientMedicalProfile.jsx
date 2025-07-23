import React, { useState, useEffect } from "react";
import apiClient from "../../api/UserApiClient"; // Make sure this points to user-service (port 5002)

const PatientMedicalProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get(`/medical-profiles/${user.id}`);
        setProfile(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setProfile({
            authUserId: user.id,
            bloodType: "",
            allergies: "",
            medications: "",
            medicalConditions: "",
          });
        } else {
          setError("Error fetching profile.");
        }
      }
    };
    fetchProfile();
  }, [user.id]);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const res = await apiClient.put(`/medical-profiles/${user.id}`, profile);
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
      <h2>Medical Profile</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <div style={styles.field}>
        <label>Blood Type:</label>
        {editing ? (
          <input name="bloodType" value={profile.bloodType} onChange={handleChange} />
        ) : (
          <p>{profile.bloodType || "Not specified"}</p>
        )}
      </div>

      <div style={styles.field}>
        <label>Allergies:</label>
        {editing ? (
          <textarea name="allergies" value={profile.allergies} onChange={handleChange} />
        ) : (
          <p>{profile.allergies || "None"}</p>
        )}
      </div>

      <div style={styles.field}>
        <label>Medications:</label>
        {editing ? (
          <textarea name="medications" value={profile.medications} onChange={handleChange} />
        ) : (
          <p>{profile.medications || "None"}</p>
        )}
      </div>

      <div style={styles.field}>
        <label>Medical Conditions:</label>
        {editing ? (
          <textarea name="medicalConditions" value={profile.medicalConditions} onChange={handleChange} />
        ) : (
          <p>{profile.medicalConditions || "None"}</p>
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

export default PatientMedicalProfile;
