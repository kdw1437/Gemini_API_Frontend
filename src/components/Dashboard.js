import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { chatService } from "../services/api";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const loadConversations = async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(data);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    }
  };

  const handleNewChat = async () => {
    try {
      const newConv = await chatService.createConversation();
      setConversations([newConv, ...conversations]);
      setCurrentConversation(newConv);
      setMessages([]);
    } catch (err) {
      setError("새 대화 생성에 실패했습니다");
    }
  };

  const handleSelectConversation = async (conv) => {
    setCurrentConversation(conv);
    setLoading(true);
    try {
      const msgs = await chatService.getMessages(conv.id);
      setMessages(msgs);
    } catch (err) {
      setError("메시지를 불러오는데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (content) => {
    if (!currentConversation) {
      // Create new conversation if none exists
      try {
        const newConv = await chatService.createConversation();
        setConversations([newConv, ...conversations]);
        setCurrentConversation(newConv);

        // Send message to new conversation
        await sendMessageToConversation(newConv.id, content);
      } catch (err) {
        setError("메시지 전송에 실패했습니다");
      }
    } else {
      await sendMessageToConversation(currentConversation.id, content);
    }
  };

  const sendMessageToConversation = async (conversationId, content) => {
    // Add user message optimistically
    const userMsg = {
      id: Date.now(),
      conversationId,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      // Send to backend and get AI response
      const modelMsg = await chatService.sendMessage(conversationId, content);

      // Add model response
      setMessages((prev) => [...prev, modelMsg]);

      // Reload conversations to update title
      loadConversations();
    } catch (err) {
      setError("AI 응답을 받는데 실패했습니다");
      // Remove optimistic user message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== userMsg.id));
    }
  };

  const handleDeleteConversation = async (convId) => {
    try {
      await chatService.deleteConversation(convId);
      setConversations(conversations.filter((c) => c.id !== convId));
      if (currentConversation?.id === convId) {
        setCurrentConversation(null);
        setMessages([]);
      }
    } catch (err) {
      setError("대화 삭제에 실패했습니다");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className={`dashboard ${sidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        conversations={conversations}
        currentConversation={currentConversation}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        theme={theme}
        onToggleTheme={toggleTheme}
        email={email}
        onLogout={handleLogout}
      />

      <ChatArea
        conversation={currentConversation}
        messages={messages}
        loading={loading}
        error={error}
        onSendMessage={handleSendMessage}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
    </div>
  );
}

export default Dashboard;
