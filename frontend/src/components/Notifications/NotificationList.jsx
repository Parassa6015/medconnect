import React, { useEffect, useState } from "react";
import notificationApiClient from "../../api/notificationApiClient";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          setError("User not logged in");
          return;
        }
        const res = await notificationApiClient.get(`http://localhost:5004/api/notification/user/${user.id}`);
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to fetch notifications");
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await notificationApiClient.put(`http://localhost:5004/api/notification/${id}/read`);
      // Refresh notifications
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  return (
    <div className="notification-container">
      <h2>Notifications</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul className="notification-list">
        {notifications.map((n) => (
          <li
            key={n._id}
            className="notification-item"
            style={{ background: n.isRead ? "#eee" : "#fff" }}
          >
            {n.message}
            {!n.isRead && (
              <button
                className="mark-read-button"
                onClick={() => markAsRead(n._id)}
              >
                Mark as Read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
