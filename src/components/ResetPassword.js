import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { authService } from "../services/api";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Get token from URL

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다");
      return;
    }

    // Validate password length
    if (newPassword.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다");
      return;
    }

    setLoading(true);

    try {
      const data = await authService.resetPassword(token, newPassword);
      setMessage(data.message || "비밀번호가 성공적으로 변경되었습니다");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "오류가 발생했습니다");
      } else {
        setError("네트워크 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // If no token in URL
  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>유효하지 않은 링크</h2>
          <p>비밀번호 재설정 링크가 유효하지 않습니다.</p>
          <Link to="/forgot-password" className="btn-primary">
            다시 요청하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>비밀번호 재설정</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>새 비밀번호 (최소 8자)</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength="8"
            />
          </div>

          <div className="form-group">
            <label>비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength="8"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "변경 중..." : "비밀번호 변경"}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/login">로그인으로 돌아가기</Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
