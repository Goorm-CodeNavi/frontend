import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../assets/scss/section/passwordreset/_passwordreset.scss";

const PasswordReset = () => {
  const navigate = useNavigate();

  // ------------------ Step 1: 인증 정보 입력 ------------------
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");

  // ------------------ Step 2: 비밀번호 재설정 ------------------
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  // ------------------ 상태 플래그 ------------------
  const [isIdEmailVerified, setIsIdEmailVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isAuthVerified, setIsAuthVerified] = useState(false);
  const [memberNotFound, setMemberNotFound] = useState(false);
  const [error, setError] = useState("");

  // 비밀번호 불일치 체크
  const passwordMismatch =
    newPassword && confirmNewPassword && newPassword !== confirmNewPassword;

  // ✅ 추가: 초기 폼에서 submit 시 실행되는 함수
  const handleSubmit = (e) => {
    e.preventDefault(); // 새로고침 방지
    handleSendCode(); // 기존 인증번호 발송 로직 실행
  };

  // 1. 인증번호 전송 핸들러
  const handleSendCode = () => {
    if (!id || !email) {
      setError("아이디와 이메일을 모두 입력해 주세요.");
      return;
    }

    // 실제 API 호출 로직 (임시: 회원 존재한다고 가정)
    const memberExists = true;

    if (!memberExists) {
      setMemberNotFound(true);
      setError("");
      return;
    }

    setError("");
    alert(`인증번호가 전송되었습니다. (임시 인증번호: 1234)`);
    setIsCodeSent(true);
    setMemberNotFound(false);
  };

  // 2. 인증 확인 핸들러
  const handleVerifyCode = () => {
    if (authCode === "1234") {
      setIsAuthVerified(true);
      setIsIdEmailVerified(true);
      setError("");
      alert("인증이 완료되었습니다! 이제 새 비밀번호를 설정할 수 있습니다.");
    } else {
      setError("인증번호가 일치하지 않습니다.");
      setIsAuthVerified(false);
    }
  };

  // 3. 비밀번호 변경 핸들러
  const handleChangePassword = () => {
    if (!isIdEmailVerified) {
      setError("인증을 완료해주세요.");
      return;
    }
    // 이후 실제 비밀번호 변경 API 호출 로직 작성 예정
  };

  // 4. 로그인 페이지로 이동
  const goToLogin = () => {
    navigate("/login");
  };

  // 5. 회원가입 페이지로 이동 (회원 정보 없을 때)
  const goToSignup = () => {
    navigate("/signup");
  };

  // --- 회원 정보 없음 결과 화면 ---
  if (memberNotFound) {
    return (
      <div className="PasswordReset_wrap">
        <div className="passwordreset-box">
          <h1 className="passwordreset-title">비밀번호 재설정</h1>
          <div className="result-box">
            <p className="result-message">
              입력하신 아이디로 등록된 회원 정보가 없습니다.
            </p>
            <p className="result-message">회원가입 후 이용해주시기 바랍니다.</p>
            <button className="action-button" onClick={goToSignup}>
              회원가입 하러가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- 비밀번호 재설정 화면 (인증 완료 후) ---
  if (isIdEmailVerified) {
    return (
      <div className="PasswordReset_wrap">
        <div className="passwordreset-box">
          <h1 className="passwordreset-title">비밀번호 재설정</h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleChangePassword();
            }}
          >
            {/* 1. 새 비밀번호 입력 */}
            <div className="input-group" style={{ position: "relative" }}>
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="새 비밀번호를 입력해주세요."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="passwordreset-input"
              />
              <span
                className="password-toggle"
                onClick={() => setPasswordVisible((v) => !v)}
              >
                {passwordVisible ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            {/* 2. 새 비밀번호 확인 입력 */}
            <div className="input-group" style={{ position: "relative" }}>
              <input
                type={confirmVisible ? "text" : "password"}
                placeholder="새 비밀번호를 다시 입력해주세요."
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="passwordreset-input"
              />
              <span
                className="password-toggle"
                onClick={() => setConfirmVisible((v) => !v)}
              >
                {confirmVisible ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            {passwordMismatch && (
              <p className="password-mismatch">비밀번호가 일치하지 않습니다.</p>
            )}

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="passwordreset-button">
              비밀번호 변경
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- 초기 인증 폼 화면 ---
  return (
    <div className="Passwordreset_wrap">
      <div className="passwordreset-box">
        <h1 className="passwordreset-title">비밀번호 재설정</h1>

        <form onSubmit={handleSubmit} className="Passwordreset-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="아이디 입력"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="id-input"
              disabled={isCodeSent}
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
              disabled={isCodeSent}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <hr className="divider" />

          <button
            id="passwordreset-button"
            type="submit"
            className="passwordreset-button"
            disabled={isCodeSent}
          >
            임시 비밀번호 발급
          </button>

          {isCodeSent && !isAuthVerified && (
            <>
              <div className="input-group" style={{ marginTop: "20px" }}>
                <input
                  type="text"
                  placeholder="인증번호 입력"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  className="passwordreset-input"
                />
              </div>
              <button
                type="button"
                className="passwordreset-button"
                onClick={handleVerifyCode}
                disabled={isAuthVerified}
              >
                인증 확인
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
