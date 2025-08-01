import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import appointmentApiClient from "../../api/AppointmentApiClient";

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [date, setDate] = useState("");
  const [availability, setAvailability] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isFirstTimeVisit, setIsFirstTimeVisit] = useState(true); // default to true


  useEffect(() => {
  const fetchAvailability = async () => {
    if (!date) return; // wait for date to be selected
    try {
      const res = await appointmentApiClient.get(`/availability/doctor/${doctorId}/date/${date}`);
      setAvailability(res.data?.timeSlots || []);
      console.log("Received availability:", res.data);
    } catch (err) {
      console.error("Failed to fetch availability:", err);
      setError("Failed to fetch availability");
    }
  };
  fetchAvailability();
}, [doctorId, date]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!selectedSlot || !date || !reason) {
        setError("Please fill all fields.");
        return;
      }
      console.log(date);

      try {
        await appointmentApiClient.post("/appointment", {
          doctorId,
          patientId: user.id,
          date,
          timeslot: selectedSlot, 
          reasonForVisit: reason,
          isFirstTimeVisit 
        });

        setMessage("Appointment booked successfully!");
        navigate("/appointments");
      } catch (err) {
        setError(err.response?.data?.message || "Booking failed");
      }
    };



    const availableSlots = availability.find(
  (a) => new Date(a.date).toISOString().slice(0, 10) === date
)?.timeSlots || [];

    console.log("Looking for date:", date);
    availability.forEach((a) =>
          console.log("Checking:", a.date.slice(0, 10), "vs", date)
    );

  return (
    <div style={styles.container}>
      <h2>Book Appointment</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label>Select Date:</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => {
              setDate(e.target.value);
              console.log("Selected Date:", e.target.value); // <--- Add this line
            }} 
            required 
          />
        </div>

        <div style={styles.field}>
          <label>Available Timeslots:</label>
          {availableSlots.length === 0 ? (
            <p>No slots available for this date.</p>
          ) : (
            <select
                onChange={(e) => setSelectedSlot(e.target.value)}
                value={selectedSlot || ""}
                required
              >
                <option value="">-- Select a slot --</option>
                {availableSlots.map((slot, idx) => (
                  <option key={idx} value={`${slot.start}-${slot.end}`}>
                    {slot.start} - {slot.end}
                  </option>
                ))}
              </select>

          )}
        </div>

        <div style={styles.field}>
          <label>Reason for Visit:</label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} required />
        </div>

        <div style={styles.field}>
          <label>Is this your first visit?</label>
          <select value={isFirstTimeVisit} onChange={(e) => setIsFirstTimeVisit(e.target.value === "true")}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>


        <button type="submit" style={styles.button}>Book</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
  },
  field: {
    marginBottom: "15px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default BookAppointment;
