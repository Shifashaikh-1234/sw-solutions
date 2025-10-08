import axios from "axios";

const api = axios.create({
  baseURL: "https://sw-solutions.onrender.com/",
  timeout: 10000,
  // change this to your deployed backend URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
