// src/api/serviceApiClient.js
import axios from "axios";

const serviceAuthApicClient = axios.create({
  baseURL: "http://localhost:5002/api", // Use the base URL for your user service
});

export default serviceAuthApicClient;