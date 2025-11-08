import React from "react";
import "./Sidebar.css";

function Sidebar({
  isOpen,
  onToggle,
  conversations,
  currentConversation,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  theme,
  onToggleTheme,
  email,
  onLogout,
}) {
  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={onNewChat}>
          <span className="icon">+</span>새 대화
        </button>
      </div>

      <div className="conversations-list">
        {conversations.length === 0 ? (
          <div className="empty-state">대화 내역이 없습니다</div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${
                currentConversation?.id === conv.id ? "active" : ""
              }`}
              onClick={() => onSelectConversation(conv)}
            >
              <div className="conversation-title">{conv.title}</div>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("이 대화를 삭제하시겠습니까?")) {
                    onDeleteConversation(conv.id);
                  }
                }}
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <div className="theme-toggle">
          <button onClick={onToggleTheme} className="theme-btn">
            {theme === "light" ? "🌙" : "☀️"}
            <span>{theme === "light" ? "다크 모드" : "라이트 모드"}</span>
          </button>
        </div>

        <div className="user-info">
          <div className="user-email">{email}</div>
          <button onClick={onLogout} className="logout-btn">
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
