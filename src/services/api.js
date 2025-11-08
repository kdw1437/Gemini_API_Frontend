import axios from "axios";

// Backend URL
const API_URL = "http://localhost:8080/api/auth";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API functions
export const authService = {
  // Register new user
  register: async (email, password) => {
    const response = await api.post("/register", { email, password });
    return response.data;
  },

  // Login
  login: async (email, password) => {
    const response = await api.post("/login", { email, password });
    return response.data;
  },

  // Forgot password (send reset email)
  forgotPassword: async (email) => {
    const response = await api.post("/forgot-password", { email });
    return response.data;
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    const response = await api.post("/reset-password", { token, newPassword });
    return response.data;
  },
};

export default api;
