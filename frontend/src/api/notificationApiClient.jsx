import axios from "axios";

const notificationApiClient = axios.create({
  baseURL: "http://localhost:5004/api", // adjust as needed
});

// Attach token to every request
notificationApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default notificationApiClient;
