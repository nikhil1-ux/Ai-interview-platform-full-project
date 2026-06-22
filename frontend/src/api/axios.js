
import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-interview-platform-full-project.onrender.com/api/v1",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;