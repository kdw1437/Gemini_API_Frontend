import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const data = await authService.forgotPassword(email);
      setMessage(data.message || "비밀번호 재설정 링크가 전송되었습니다.");
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

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>비밀번호 찾기</h2>
        <p className="subtitle">
          가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "전송 중..." : "재설정 링크 전송"}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/login">로그인으로 돌아가기</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
