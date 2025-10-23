import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Seek from '../../assets/img/ic_seek.svg';
import Hide from '../../assets/img/ic_hide.svg';
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

      setAuth(accessToken, tokenType || "Bearer");

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
      <div className="login_container">
        <h1>LOGIN</h1>
        <form onSubmit={handleSubmit}>
          <div className="input_id">
            <input
              type="text"
              placeholder="아이디 입력"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div className="input_pw">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <img 
              className="pw_visible" 
              src={passwordVisible ? Seek : Hide} 
              alt="pw_visible"
              onClick={() => setPasswordVisible((prev) => !prev)}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login_btn">로그인</button>
        </form>
        <div className="not_member">
          <div className="text">아직 회원이 아니신가요?</div>
          <h4 onClick={() => navigate("/signup")}>회원가입하기</h4>
        </div>
        <div className="divider"></div>
        <div className="options">
          <div className="find_id" onClick={() => navigate("/find-id")}>아이디 찾기</div>
          <div className="reset_pw" onClick={() => navigate("/passwordreset")}>임시 비밀번호 발급</div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
