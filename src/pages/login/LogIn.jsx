import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LogIn = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!id || !password) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    console.log("로그인 시도:", { id, password });

    // 임시: 로그인 성공했다고 가정하고 홈으로 이동 (경로 설정)
    navigate("/"); // 홈 경로로 이동하도록 수정했습니다.
  };

  return (
    <div className="Login_wrap">
      <div className="Login-box">
        <h1 className="Login-title">Login</h1>{" "}
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

            {/* 5. 아이콘 컴포넌트를 사용하고 onClick 핸들러를 올바르게 연결합니다. */}
            <span
              className="password-toggle"
              onClick={() => setPasswordVisible((v) => !v)}
            >
              {passwordVisible ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {/* 에러 메시지 표시 */}
          {error && <p className="error-message">{error}</p>}

          <button id="Login-button" type="submit" className="Login-button">
            로그인
          </button>
        </form>
        <div className="login-prompt">
          <span className="prompt-text">아직 회원이 아니신가요?</span>
          <Link to="/login" className="login-link">
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
