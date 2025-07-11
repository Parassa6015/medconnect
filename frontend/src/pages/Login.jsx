import React, { useState } from "react";
import apiClient from "../api/apiClient";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
        const res = await apiClient.post("/auth/login", { email, password });
        const { token, user } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
        localStorage.setItem("user", JSON.stringify(res.data.user));


        if (user.role === "admin") {
            window.location.href = "/admin-dashboard";
        } else if (user.role === "doctor") {
            window.location.href = "/doctor-dashboard";
        } else {
            window.location.href = "/dashboard";
        }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />

            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />

            <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
            </button>
        </form>
        </div>
  );
};

export default Login;
