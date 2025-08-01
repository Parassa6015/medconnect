import React, { useEffect, useState } from "react";
import userApiClient from "../../../api/UserApiClient";
import { useParams } from "react-router-dom";

const PatientProfileView = () => {
  const { patientId } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  // const user = JSON.parse(localStorage.getItem("user"));
  console.log(patientId);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userApiClient.get(`/medical-profiles/by-user/${patientId}`);
        setProfile(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Failed to fetch profile"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [patientId]);

  console.log(profile);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!profile) return <p>No profile data found.</p>;

  return (
    <div style={styles.container}>
      <h2>Patient Medical Profile</h2>
      <p><strong>Medical Conditions:</strong> {(profile.medicalConditions || []).join(", ") || "N/A"}</p>
      <p><strong>Medications:</strong> {profile.medications || "N/A"}</p>
      <p><strong>Allergies:</strong> {profile.allergies || "N/A"}</p>
      <p><strong>Blood Type:</strong> {profile.bloodType || "N/A"}</p>
      <p><strong>Notes:</strong> {profile.notes || "N/A"}</p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
};

export default PatientProfileView;
