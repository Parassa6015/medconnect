import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import appointmentApiClient from "../../api/AppointmentApiClient";
import Calendar from "react-calendar";
import moment from "moment";
import 'react-calendar/dist/Calendar.css';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [date, setDate] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isFirstTimeVisit, setIsFirstTimeVisit] = useState(true);

  const [activeDate, setActiveDate] = useState(new Date());

  // 1. Fetch available dates for the month
  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const startDate = moment(activeDate).startOf('month').format('YYYY-MM-DD');
        const endDate = moment(activeDate).endOf('month').format('YYYY-MM-DD');

        const res = await appointmentApiClient.get(`/availability/doctor/${doctorId}/dates?startDate=${startDate}&endDate=${endDate}`);
        setAvailableDates(res.data.availableDates);
        setError("");
      } catch (err) {
        console.error("Failed to fetch available dates:", err);
        setError("Failed to fetch available dates for this month.");
      }
    };
    fetchAvailableDates();
  }, [doctorId, activeDate]);


  // 2. Fetch slots for a specific selected date
  useEffect(() => {
    const fetchAvailabilityForDate = async () => {
      if (!date) {
        setAvailability([]);
        return;
      }
      try {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        const res = await appointmentApiClient.get(`/availability/doctor/${doctorId}/date/${formattedDate}`);

        if (!res.data || !res.data.timeSlots || res.data.timeSlots.length === 0) {
          setAvailability([]);
        } else {
          const unbookedSlots = res.data.timeSlots.filter(slot => !slot.isBooked);
          setAvailability(unbookedSlots);
        }
        setError("");
      } catch (err) {
        if (err.response?.status === 404) {
          setAvailability([]);
          setError("No availability found for this date.");
        } else {
          console.error("Failed to fetch availability:", err);
          setError("Failed to fetch availability");
        }
      }
    };

    fetchAvailabilityForDate();
  }, [doctorId, date]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot || !date || !reason) {
      setError("Please fill all fields.");
      return;
    }
    try {
      await appointmentApiClient.post("/appointment", {
        doctorId,
        patientId: user.id,
        date: moment(date).format("YYYY-MM-DD"),
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

  return (
    <div style={styles.container}>
      {/* Updated inline styles to make the calendar look better */}
      <style>{`
        .react-calendar {
          width: 100% !important;
          border: 1px solid #ccc;
          font-family: Arial, Helvetica, sans-serif;
          line-height: 1.125em;
        }
        .react-calendar__tile.has-availability {
          background-color: #e6f7ff !important;
          color: #004085;
          border-radius: 50%;
          border: 1px solid #b3d9ff;
        }
        .react-calendar__tile.has-availability:hover {
          background-color: #cceeff !important;
        }
        .react-calendar__tile--active {
          background: #006edc !important;
          color: white;
        }
      `}</style>
      <h2>Book Appointment</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label>Select Date:</label>
          <Calendar
            onChange={setDate}
            value={date}
            tileClassName={({ date, view }) => {
              if (view === 'month' && availableDates.some(d => moment(d).isSame(date, 'day'))) {
                return 'has-availability';
              }
            }}
            onActiveStartDateChange={({ activeStartDate }) => setActiveDate(activeStartDate)}
          />
        </div>

        <div style={styles.field}>
          <label>Available Timeslots for {date ? moment(date).format("MMM Do YYYY") : '...'}:</label>
          {date ? (
            availability.length === 0 ? (
              <p>No slots available for this date.</p>
            ) : (
              <select
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  value={selectedSlot || ""}
                  required
                >
                  <option value="">-- Select a slot --</option>
                  {availability.map((slot, idx) => (
                    <option key={idx} value={`${slot.start}-${slot.end}`}>
                      {slot.start} - {slot.end}
                    </option>
                  ))}
                </select>
            )
          ) : (
            <p>Please select a date to see available slots.</p>
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