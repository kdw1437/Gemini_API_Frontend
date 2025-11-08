import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include userId in headers
api.interceptors.request.use(
  (config) => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      config.headers["X-User-Id"] = userId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  register: async (email, password) => {
    const response = await api.post("/auth/register", { email, password });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await api.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  },
};

// Chat Service
export const chatService = {
  // Create new conversation
  createConversation: async () => {
    const response = await api.post("/chat/conversations");
    return response.data;
  },

  // Get all user conversations
  getConversations: async () => {
    const response = await api.get("/chat/conversations");
    return response.data;
  },

  // Get messages for a conversation
  getMessages: async (conversationId) => {
    const response = await api.get(
      `/chat/conversations/${conversationId}/messages`
    );
    return response.data;
  },

  // Send a message
  sendMessage: async (conversationId, content) => {
    const response = await api.post("/chat/messages", {
      conversationId,
      content,
    });
    return response.data;
  },

  // Delete a conversation
  deleteConversation: async (conversationId) => {
    await api.delete(`/chat/conversations/${conversationId}`);
  },
};

export default api;
