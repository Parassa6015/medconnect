import React, { useEffect, useState } from "react";
import userApiClient from "../../api/UserApiClient";
import { useNavigate } from "react-router-dom";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await userApiClient.get("/users/doctors");
      console.log("Fetched doctors:", res.data);
      setDoctors(res.data);
    };
    fetchDoctors();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Doctors</h2>
      {doctors.map((doc) => (
        <div key={doc.authUserId} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
          <h4>Dr. {doc.firstName} {doc.lastName}</h4>
          <p>Specialty: {doc.specialty || "General"}</p><p>ID: {doc.authUserId}</p>
          <p>ID: {doc.authUserId}</p>
          <button onClick={() => navigate(`/book-appointment/${doc.authUserId}`)}>Book Appointment</button>
        </div>
      ))}
    </div>
  );
};

export default DoctorList;
