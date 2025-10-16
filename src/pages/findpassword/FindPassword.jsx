import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const FindPassword = () => {
  const navigate = useNavigate();

  // ------------------ Step 1: 인증 정보 입력 ------------------
  const [id, setId] = useState("");
  const [phone, setPhone] = useState("");
  const [authCode, setAuthCode] = useState("");

  // ------------------ Step 2: 비밀번호 재설정 ------------------
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  // ------------------ 상태 플래그 ------------------
  const [isIdPhoneVerified, setIsIdPhoneVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isAuthVerified, setIsAuthVerified] = useState(false);
  const [memberNotFound, setMemberNotFound] = useState(false);
  const [error, setError] = useState("");

  // 임시: 비밀번호 불일치 메시지
  const passwordMismatch =
    newPassword && confirmNewPassword && newPassword !== confirmNewPassword;

  // 1. 인증번호 전송 핸들러
  const handleSendCode = () => {
    if (!id || !phone) {
      setError("아이디와 이메일을 모두 입력해주세요.");
      return;
    }

    // 실제 API 호출 로직: 아이디/전화번호로 회원 정보 확인 및 인증번호 전송
    const memberExists = true; // 임시: 회원이 존재한다고 가정

    if (!memberExists) {
      setMemberNotFound(true); // 회원이 없으면 결과 화면으로 전환
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
      // 임시 인증번호 검증
      setIsAuthVerified(true);
      setIsIdPhoneVerified(true); // 다음 단계로 넘어갈 수 있도록 상태 변경
      setError("");
      alert("인증이 완료되었습니다! 이제 새 비밀번호를 설정할 수 있습니다.");
    } else {
      setError("인증번호가 일치하지 않습니다.");
      setIsAuthVerified(false);
    }
  };

  // 3. 비밀번호 변경 핸들러
  const handleChangePassword = () => {
    if (!isIdPhoneVerified) {
      setError("인증을 완료해주세요.");
      return;
    }
    if (!newPassword || !confirmNewPassword) {
      setError("새 비밀번호와 확인 비밀번호를 모두 입력해주세요.");
      return;
    }
    if (passwordMismatch) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 실제 API 호출 로직: 비밀번호 변경
    console.log(`비밀번호 변경 완료: ${newPassword}`);
    alert("비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동합니다.");
    navigate("/login");
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
      <div className="FindPassword_wrap">
        <div className="findpassword-box">
          <h1 className="findpassword-title">비밀번호 재설정</h1>
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
  if (isIdPhoneVerified) {
    return (
      <div className="FindPassword_wrap">
        <div className="findpassword-box">
          <h1 className="findpassword-title">비밀번호 재설정</h1>

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
                className="findpassword-input"
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
                className="findpassword-input"
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

            {/* 3. 비밀번호 변경 버튼 */}
            <button type="submit" className="findpassword-button">
              비밀번호 변경
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- 초기 인증 폼 화면 ---
  return (
    <div className="FindPassword_wrap">
      <div className="findpassword-box">
        <h1 className="findpassword-title">비밀번호 재설정</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault(); /* submit은 여기서 사용하지 않음 */
          }}
        >
          {/* 1. 아이디 입력 */}
          <div className="input-group">
            <input
              type="text"
              placeholder="아이디를 입력해주세요."
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="findpassword-input"
              disabled={isCodeSent}
            />
          </div>

          {/* 2. 전화번호 입력 및 인증번호 전송 */}
          <div className="input-group">
            <div className="input-container">
              <input
                type="tel"
                placeholder="이메일 입력"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="findpassword-input"
                disabled={isCodeSent}
              />
              <button
                type="button"
                className="send-button"
                onClick={handleSendCode}
                disabled={isCodeSent}
              >
                인증번호 전송
              </button>
            </div>
          </div>

          {/* 3. 인증번호 입력 (인증번호 전송 후 표시) */}
          {isCodeSent && !isAuthVerified && (
            <div className="input-group">
              <div className="input-container">
                <input
                  type="text"
                  placeholder="인증번호 입력"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  className="findpassword-input"
                />
                <button
                  type="button"
                  className="auth-button"
                  onClick={handleVerifyCode}
                >
                  인증 확인
                </button>
              </div>
            </div>
          )}

          {error && <p className="error-message">{error}</p>}

          {/* 4. 인증하기 버튼 (실제로는 인증 확인 버튼을 누름) */}
          <button
            type="button" // 실제 API를 사용한다면 submit을 사용
            className="findpassword-button"
            onClick={handleVerifyCode} // 인증하기 버튼은 인증 확인을 다시 실행 (디자인 일치 목적)
            disabled={!isCodeSent || isAuthVerified}
          >
            인증하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default FindPassword;
