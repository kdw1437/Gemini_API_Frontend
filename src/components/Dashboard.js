import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>환영합니다! 🎉</h2>
        <p>로그인에 성공했습니다.</p>
        <p>
          <strong>이메일:</strong> {email}
        </p>

        <button onClick={handleLogout} className="btn-secondary">
          로그아웃
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
