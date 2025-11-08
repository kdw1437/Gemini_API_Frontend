import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authService.login(email, password);
      console.log("Login successful:", data);

      // ✅ UPDATED: Only store token and email (userId is in JWT)
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(
          err.response.data.message ||
            "이메일 또는 비밀번호가 일치하지 않습니다"
        );
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
        <h2>로그인</h2>
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

          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/forgot-password">비밀번호를 잊으셨나요?</Link>
          <p>
            계정이 없으신가요? <Link to="/register">회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
