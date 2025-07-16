import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Welcome to MedConnect</h1>
      <p>Your platform for telemedicine services.</p>

      {isAuthenticated ? (
        <>
          <p>You are already logged in.</p>
          <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
        </>
      ) : (
        <>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")} style={{ marginLeft: "10px" }}>
            Register
          </button>
        </>
      )}
    </div>
  );
};

export default Home;
