// import React, { useState, useEffect } from "react";
// import apiClient from "../../api/AppointmentApiClient";

// const DoctorAvailabilityList = () => {
//   const [user, setUser] = useState(null);
//   const [availabilities, setAvailabilities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const stored = localStorage.getItem("user");
//     if (stored) {
//       const parsed = JSON.parse(stored);
//       setUser(parsed);
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (!user?.id) return;

//     const fetchData = async () => {
//       try {
//         const res = await apiClient.get(`/availability/doctor/${user.id}`);
//         setAvailabilities(res.data);
//       } catch (err) {
//         setError(err.response?.data?.message || err.message || "Failed to fetch");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [user]);

//   // UI logic
//   if (loading) return <p>Loading...</p>;
//   if (!user) return <p>You are not logged in.</p>;
//   if (error) return <p>{error}</p>;

//   const hasSlots = availabilities.some(a => a.timeSlots && a.timeSlots.length > 0);
//   if (!hasSlots) return <p>No availability slots found.</p>;

//   return (
//     <div style={styles.container}>
//       <h2>Your Availability</h2>
//       {availabilities.map((entry) => (
//         <div key={entry._id} style={styles.card}>
//           <strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}
//           <ul style={styles.list}>
//             {entry.timeSlots.map((slot, idx) => (
//               <li key={idx}>
//                 {slot.start} - {slot.end}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: "600px",
//     margin: "0 auto",
//     padding: "20px",
//   },
//   card: {
//     background: "#f9f9f9",
//     padding: "10px",
//     border: "1px solid #ddd",
//     marginBottom: "10px",
//     borderRadius: "4px",
//   },
//   list: {
//     listStyle: "none",
//     paddingLeft: 0,
//   },
// };

// export default DoctorAvailabilityList;


// import React, { useState, useEffect } from "react";
// import apiClient from "../../api/AppointmentApiClient";

// const DoctorAvailabilityList = () => {
//   const [user, setUser] = useState(null);
//   const [availabilities, setAvailabilities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [date, setDate] = useState("");
//   const [slots, setSlots] = useState([{ start: "", end: "" }]);
//   const [message, setMessage] = useState("");

//   // Load user from localStorage
//   useEffect(() => {
//     const stored = localStorage.getItem("user");
//     if (stored) {
//       const parsed = JSON.parse(stored);
//       setUser(parsed);
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   // Fetch doctor availability
//   useEffect(() => {
//     if (!user?.id) return;

//     const fetchData = async () => {
//       try {
//         const res = await apiClient.get(`/availability/doctor/${user.id}`);
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         const futureAvailabilities = res.data.filter((a) => {
//           const slotDate = new Date(a.date);
//           slotDate.setHours(0, 0, 0, 0);
//           return slotDate >= today;
//         });
//         setAvailabilities(futureAvailabilities);
//       } catch (err) {
//         setError(err.response?.data?.message || err.message || "Failed to fetch");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [user]);

//   // Add time slot row
//   const addSlot = () => {
//     setSlots([...slots, { start: "", end: "" }]);
//   };

//   const removeSlot = (index) => {
//     const updated = [...slots];
//     updated.splice(index, 1);
//     setSlots(updated);
//   };

//   const handleSlotChange = (index, field, value) => {
//     const updated = [...slots];
//     updated[index][field] = value;
//     setSlots(updated);
//   };

//   // Submit new availability
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     try {
//       await apiClient.post("/availability", {
//         doctorId: user.id,
//         date,
//         timeSlots: slots,
//       });

//       setMessage("Availability created!");
//       setDate("");
//       setSlots([{ start: "", end: "" }]);

//       // Refresh availability
//       const refreshed = await apiClient.get(`/availability/doctor/${user.id}`);
//       const today = new Date().toISOString().split("T")[0];
//       const future = refreshed.data.filter((a) => new Date(a.date) >= new Date(today));
//       setAvailabilities(future);
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Failed to create availability");
//     }
//   };

//   // Conditional UI
//   if (loading) return <p>Loading...</p>;
//   if (!user) return <p>You are not logged in.</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div style={styles.container}>
//       <h2>Create Availability</h2>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Date:
//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             required
//           />
//         </label>

//         {slots.map((slot, idx) => (
//           <div key={idx} style={styles.slotRow}>
//             <input
//               type="time"
//               value={slot.start}
//               onChange={(e) => handleSlotChange(idx, "start", e.target.value)}
//               required
//             />
//             <span>to</span>
//             <input
//               type="time"
//               value={slot.end}
//               onChange={(e) => handleSlotChange(idx, "end", e.target.value)}
//               required
//             />
//             {slots.length > 1 && (
//               <button type="button" onClick={() => removeSlot(idx)}>❌</button>
//             )}
//           </div>
//         ))}

//         <button type="button" onClick={addSlot} style={styles.button}>
//           + Add Slot
//         </button>
//         <br />
//         <button type="submit" style={styles.button}>
//           Submit
//         </button>
//       </form>

//       {message && <p>{message}</p>}

//       <h2 style={{ marginTop: "40px" }}>Your Upcoming Availabilities</h2>
//       {availabilities.length === 0 ? (
//         <p>No availability slots found.</p>
//       ) : (
//         availabilities.map((entry) => (
//           <div key={entry._id} style={styles.card}>
//             <strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}
//             <ul style={styles.list}>
//               {entry.timeSlots.map((slot, idx) => (
//                 <li key={idx}>
//                   {slot.start} - {slot.end}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: "600px",
//     margin: "0 auto",
//     padding: "20px",
//   },
//   slotRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//     marginBottom: "10px",
//   },
//   button: {
//     padding: "6px 12px",
//     marginTop: "10px",
//     cursor: "pointer",
//   },
//   card: {
//     background: "#f9f9f9",
//     padding: "10px",
//     border: "1px solid #ddd",
//     marginBottom: "10px",
//     borderRadius: "4px",
//   },
//   list: {
//     listStyle: "none",
//     paddingLeft: 0,
//   },
// };

// export default DoctorAvailabilityList;

import React, { useState, useEffect } from "react";
import apiClient from "../../api/AppointmentApiClient";

const DoctorAvailabilityList = () => {
  const [user, setUser] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([{ start: "", end: "" }]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const res = await apiClient.get(`/availability/doctor/${user.id}`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const futureAvailabilities = res.data.filter((a) => {
          const slotDate = new Date(a.date);
          slotDate.setHours(0, 0, 0, 0);
          return slotDate >= today;
        });
        setAvailabilities(futureAvailabilities);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const addSlot = () => {
    setSlots([...slots, { start: "", end: "" }]);
  };

  const removeSlot = (index) => {
    const updated = [...slots];
    updated.splice(index, 1);
    setSlots(updated);
  };

  const handleSlotChange = (index, field, value) => {
    const updated = [...slots];
    updated[index][field] = value;
    setSlots(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      console.log(date);
      await apiClient.post("/availability", {
        doctorId: user.id,
        date,
        timeSlots: slots,
      });

      setMessage("Availability created!");
      setDate("");
      setSlots([{ start: "", end: "" }]);

      const refreshed = await apiClient.get(`/availability/doctor/${user.id}`);
      const today = new Date();
      console.log(today);
      today.setHours(0, 0, 0, 0);
      const future = refreshed.data.filter((a) => {
        const slotDate = new Date(a.date);
        slotDate.setHours(0, 0, 0, 0);
        return slotDate >= today;
      });
      setAvailabilities(future);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create availability");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>You are not logged in.</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      <h2>Create Availability</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        {slots.map((slot, idx) => (
          <div key={idx} style={styles.slotRow}>
            <input
              type="time"
              value={slot.start}
              onChange={(e) => handleSlotChange(idx, "start", e.target.value)}
              required
            />
            <span>to</span>
            <input
              type="time"
              value={slot.end}
              onChange={(e) => handleSlotChange(idx, "end", e.target.value)}
              required
            />
            {slots.length > 1 && (
              <button type="button" onClick={() => removeSlot(idx)}>❌</button>
            )}
          </div>
        ))}

        <button type="button" onClick={addSlot} style={styles.button}>
          + Add Slot
        </button>
        <br />
        <button type="submit" style={styles.button}>
          Submit
        </button>
      </form>

      {message && <p>{message}</p>}

      <h2 style={{ marginTop: "40px" }}>Your Upcoming Availabilities</h2>
      {availabilities.length === 0 ? (
        <p>No availability slots found.</p>
      ) : (
        availabilities.map((entry) => (
          <div key={entry._id} style={styles.card}>
            <strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}
            <ul style={styles.list}>
              {entry.timeSlots.map((slot, idx) => (
                <li key={idx}>
                  {slot.start} - {slot.end}
                </li>
              ))}
            </ul>
          </div>
        ))
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
  slotRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  button: {
    padding: "6px 12px",
    marginTop: "10px",
    cursor: "pointer",
  },
  card: {
    background: "#f9f9f9",
    padding: "10px",
    border: "1px solid #ddd",
    marginBottom: "10px",
    borderRadius: "4px",
  },
  list: {
    listStyle: "none",
    paddingLeft: 0,
  },
};

export default DoctorAvailabilityList;
