// src/components/layout/Header.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../api/apiClient";

const Header = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        const res = await apiClient.get(`/notifications/user/${user.id}`);
        setNotifications(res.data);
        const unread = res.data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.brand}>🏥 MedConnect</Link>

      <div style={styles.right}>
        {/* Notification Button */}
        <div style={styles.notificationWrapper}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={styles.notificationButton}
          >
            🔔
            {unreadCount > 0 && (
              <span style={styles.badge}>{unreadCount}</span>
            )}
          </button>
          {dropdownOpen && (
            <div style={styles.dropdown}>
              {notifications.length === 0 ? (
                <p>No notifications</p>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <div key={n._id} style={styles.notificationItem}>
                    {n.message}
                  </div>
                ))
              )}
              <Link to="/notifications">View Notifications</Link>
            </div>
          )}
        </div>

        <Link to="/dashboard">Dashboard</Link>
      </div>
    </header>
  );
};

const styles = {
  header: {
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f2f2f2",
  },
  brand: {
    fontWeight: "bold",
    textDecoration: "none",
    color: "#333",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  notificationWrapper: {
    position: "relative",
  },
  notificationButton: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    background: "red",
    color: "white",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "12px",
  },
  dropdown: {
    position: "absolute",
    top: "30px",
    right: "0",
    background: "white",
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "10px",
    width: "200px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    zIndex: 10,
  },
  notificationItem: {
    fontSize: "14px",
    marginBottom: "5px",
  },
  viewAll: {
    display: "block",
    marginTop: "5px",
    textAlign: "center",
    fontWeight: "bold",
  },
};

export default Header;
