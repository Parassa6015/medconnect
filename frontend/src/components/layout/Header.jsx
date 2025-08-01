import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logo}>MedConnect</Link>
      <nav style={styles.nav}>
        {token ? (
          <div style={styles.dropdownContainer} ref={dropdownRef}>
            <button
              style={styles.dropdownToggle}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {user?.firstName || "Account"} ⏷
            </button>
            {dropdownOpen && (
                <div style={styles.dropdownMenu}>
                  <Link to="/dashboard" style={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>Dashboard</Link>
                  <Link to="/profile" style={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>Profile</Link>
                  <button onClick={() => { handleLogout(); setDropdownOpen(false); }} style={styles.dropdownItem}>Logout</button>
                </div>
              )}
          </div>
        ) : (
          <>
            <Link to="/login" style={styles.navLink}>Login</Link>
            <Link to="/register" style={styles.navLink}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: "#f5f5f5",
    borderBottom: "1px solid #ddd",
  },
  logo: {
    textDecoration: "none",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
  },
  nav: {
    display: "flex",
    alignItems: "center",
  },
  navLink: {
    marginLeft: "15px",
    textDecoration: "none",
    color: "#007bff",
  },
  dropdownContainer: {
    position: "relative",
  },
  dropdownToggle: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    color: "#007bff",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    right: 0,
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    zIndex: 10,
  },
  dropdownItem: {
    display: "block",
    padding: "8px 12px",
    textDecoration: "none",
    color: "#333",
    cursor: "pointer",
    textAlign: "left",
  },
};

export default Header;
