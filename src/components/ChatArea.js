import React, { useState, useRef, useEffect } from "react";
import "./ChatArea.css";

function ChatArea({
  conversation,
  messages,
  loading,
  error,
  onSendMessage,
  sidebarOpen,
  onToggleSidebar,
}) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    setSending(true);
    await onSendMessage(input);
    setInput("");
    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-area">
      <div className="chat-header">
        <button className="menu-btn" onClick={onToggleSidebar}>
          ☰
        </button>
        <h2>{conversation ? conversation.title : "Gemini Chat"}</h2>
      </div>

      <div className="messages-container">
        {messages.length === 0 && !loading ? (
          <div className="welcome-screen">
            <h1>안녕하세요! 무엇을 도와드릴까요?</h1>
            <p>질문을 입력하시면 AI가 답변해드립니다.</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === "user" ? "👤" : "🤖"}
                </div>
                <div className="message-content">
                  <div className="message-text">{msg.content}</div>
                </div>
              </div>
            ))}
            {sending && (
              <div className="message model">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="input-container">
        <form onSubmit={handleSubmit}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            disabled={sending}
            rows={1}
          />
          <button type="submit" disabled={!input.trim() || sending}>
            {sending ? "⏳" : "➤"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatArea;
