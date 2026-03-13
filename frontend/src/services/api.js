import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000"
});

// Attach the logged-in user's email as a custom header on every request.
// The backend uses this to isolate each user's data (resume, etc.).
API.interceptors.request.use((config) => {
  const email = localStorage.getItem("user_email");
  if (email) {
    config.headers["X-User-Email"] = email;
  }
  return config;
});

export default API;