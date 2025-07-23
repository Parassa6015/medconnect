import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import appointmentApiClient from "../../api/AppointmentApiClient";
import "../Appointments/appointmentList.css";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        let res;
        if (user.role === "admin") {
          res = await appointmentApiClient.get("/appointment/allAppointments");
        } else {
          res = await appointmentApiClient.get(`/appointment/filter`, {
            params: { userId: user.id },
          });
        }
        setAppointments(res.data || []);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments.");
      }
    };

    fetchAppointments();
  }, [user.role, user.id]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleViewProfile = (authUserId) => {
    navigate(`/patients/${authUserId}`);
  };

  return (
    <div className="appointment-container">
      <h2>Appointments</h2>
      {error && <p className="error-message">{error}</p>}
      {appointments.length === 0 ? (
        <p className="empty-message">No appointments found.</p>
      ) : (
        <ul className="appointment-list">
          {appointments.map((appt) => (
            <li key={appt._id} className="appointment-item">
              <div>
                <strong>Date:</strong>{" "}
                {new Date(appt.date).toISOString().split("T")[0]} <br />
                <strong>Timeslot:</strong> {appt.timeslot} <br />
                <strong>Status:</strong> {appt.status}
              </div>
              <button
                onClick={() => toggleExpand(appt._id)}
                className="toggle-button"
              >
                {expandedId === appt._id ? "Hide Details" : "View Details"}
              </button>

              {expandedId === appt._id && (
                <div className="appointment-details">
                  {appt.reasonForVisit && (
                    <p>
                      <strong>Reason:</strong> {appt.reasonForVisit}
                    </p>
                  )}
                  {appt.notes && (
                    <p>
                      <strong>Notes:</strong> {appt.notes}
                    </p>
                  )}
                  <p>
                    <strong>First Visit:</strong>{" "}
                    {appt.isFirstTimeVisit ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Payment Status:</strong> {appt.paymentStatus}
                  </p>
                  <p>
                    <strong>Duration:</strong> {appt.durationMinutes} minutes
                  </p>

                  {appt.meetingLink && (
                    <a
                      href={appt.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="join-meeting-button"
                    >
                      Join Meeting
                    </a>
                  )}

                  {user.role === "doctor" && appt.patientId && (
                    <button
                      onClick={() => handleViewProfile(appt.patientId)}
                      className="view-profile-button"
                    >
                      View Patient Profile
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AppointmentList;
