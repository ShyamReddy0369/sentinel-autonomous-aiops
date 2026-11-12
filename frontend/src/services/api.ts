import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";
const normalizedBaseURL = rawApiUrl.endsWith("/api")
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/+$/, "")}/api`;

const api = axios.create({
  baseURL: normalizedBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
