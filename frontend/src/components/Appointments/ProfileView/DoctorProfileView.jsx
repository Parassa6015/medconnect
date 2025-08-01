import React, { useEffect, useState } from "react";
import userApiClient from "../../api/UserApiClient";
import { useNavigate } from "react-router-dom";

const DoctorSelection = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await userApiClient.get("/users?role=doctor");
        setDoctors(res.data);
      } catch (err) {
        setError("Failed to load doctors.",err);
      }
    };
    fetchDoctors();
  }, []);

  const handleBook = (doctorId) => {
    navigate(`/book/${doctorId}`);
  };

  return (
    <div style={styles.container}>
      <h2>Select a Doctor to Book</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul style={styles.list}>
        {doctors.map((doc) => (
          <li key={doc._id} style={styles.card}>
            <p><strong>Dr. {doc.firstName} {doc.lastName}</strong></p>
            <p>Specialty: {doc.specialty || "N/A"}</p>
            <Link to={handleBook}> <button style={{ marginTop: "10px" }}>Book Appointment</button> </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "700px",
    margin: "auto",
    padding: "20px",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "10px",
  },
};

export default DoctorSelection;
