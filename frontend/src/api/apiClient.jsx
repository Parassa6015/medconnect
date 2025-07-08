import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5001/api", // adjust as needed
});

// Attach token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
