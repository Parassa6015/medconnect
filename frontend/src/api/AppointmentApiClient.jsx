// src/api/appointmentApiClient.js
import axios from "axios";

const appointmentApiClient = axios.create({
  baseURL: "http://localhost:5003/api",  // APPOINTMENT SERVICE port
});

appointmentApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export default appointmentApiClient;

