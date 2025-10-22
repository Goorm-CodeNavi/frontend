import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { login as loginApi } from "../../api/userApi";
import { useAuth } from "../../contexts/AuthContext";

const LogIn = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!id || !password) {
      setError("아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }

    try {
      const data = await loginApi({ username: id, password });

      if (!data?.isSuccess) {
        throw new Error(data?.message || "로그인 실패");
      }

      const { accessToken, tokenType } = data.result || {};
      if (!accessToken) throw new Error("액세스 토큰이 없습니다.");

      // Context를 통해 상태 + localStorage 동시 관리
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("tokenType", tokenType || "Bearer");

      navigate("/"); // 홈으로 이동
    } catch (err) {
      console.error("로그인 실패:", err);

      // 에러 처리
      setError(
        err?.response?.data?.result ||
        err?.response?.data?.message ||
        "아이디 또는 비밀번호를 확인해주세요."
      );
    }
  };

  return (
    <div className="Login_wrap">
      <div className="Login-box">
        <h1 className="Login-title">LOGIN</h1>
        <form onSubmit={handleSubmit} className="Login-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="아이디 입력"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="Login-input"
            />
          </div>

          <div
            className="input-group password-group"
            style={{ position: "relative" }}
          >
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="Login-input"
            />
            <span
              className="password-toggle"
              onClick={() => setPasswordVisible((v) => !v)}
            >
              {passwordVisible ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button id="Login-button" type="submit" className="Login-button">
            로그인
          </button>
        </form>

        <div className="login-prompt">
          <span className="prompt-text">아직 회원이 아니신가요?</span>
          <Link to="/signup" className="signup-link">
            회원가입하기
          </Link>
        </div>

        <hr className="divider" />

        <div className="find-links">
          <Link to="/findid" className="find-link">
            아이디 찾기
          </Link>
          <span className="link-divider">|</span>
          <Link to="/passwordreset" className="reset-link">
            비밀번호 재설정
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
