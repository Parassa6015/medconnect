import React, { useEffect, useState } from "react";
import apiClient from "../../src/api/AppointmentApiClient";

const DoctorAvailability = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [date, setDate] = useState("");
  const [timeSlots, setTimeSlots] = useState([{ start: "", end: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    if (!user) return;
    try {
      const res = await apiClient.get(`/availability/doctor/${user._id}`);
      setAvailabilities(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load availability.");
    }
  };

  const handleTimeSlotChange = (index, field, value) => {
    const updated = [...timeSlots];
    updated[index][field] = value;
    setTimeSlots(updated);
  };

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { start: "", end: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiClient.post("/availability", {
        doctorId: user._id,
        date,
        timeSlots,
      });
      setDate("");
      setTimeSlots([{ start: "", end: "" }]);
      fetchAvailability();
      alert("Availability saved!");
    } catch (err) {
      console.error(err);
      setError("Failed to save availability.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Manage Availability</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        <div>
          <strong>Time Slots:</strong>
          {timeSlots.map((slot, idx) => (
            <div key={idx} style={styles.slotRow}>
              <input
                type="time"
                value={slot.start}
                onChange={(e) =>
                  handleTimeSlotChange(idx, "start", e.target.value)
                }
                required
              />
              <span> to </span>
              <input
                type="time"
                value={slot.end}
                onChange={(e) =>
                  handleTimeSlotChange(idx, "end", e.target.value)
                }
                required
              />
            </div>
          ))}
          <button type="button" onClick={addTimeSlot} style={styles.addButton}>
            + Add Slot
          </button>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Availability"}
        </button>
      </form>

      <h3>Your Availability</h3>
      {availabilities.length === 0 ? (
        <p>No availability set.</p>
      ) : (
        <ul>
          {availabilities.map((item) => (
            <li key={item._id}>
              <strong>{item.date.slice(0, 10)}</strong>:{" "}
              {item.timeSlots
                .map((slot) => `${slot.start} - ${slot.end}`)
                .join(", ")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
  },
  form: {
    marginBottom: "30px",
  },
  slotRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "5px",
  },
  addButton: {
    marginTop: "5px",
  },
};

export default DoctorAvailability;
