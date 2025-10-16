import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// SCSS는 전역 로딩을 가정하고 주석 처리합니다.
// import '../../assets/scss/section/findid/_findid.scss';

const FindId = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isAuthVerified, setIsAuthVerified] = useState(false);
  const [foundId, setFoundId] = useState(null);
  const [error, setError] = useState("");

  // 1. 전화번호 입력 핸들러
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    setError("");
    setIsCodeSent(false);
    setIsAuthVerified(false);
    setFoundId(null);
  };

  // 2. 인증번호 전송 핸들러
  const handleSendCode = () => {
    if (!phone || phone.length < 10) {
      setError("유효한 전화번호를 입력해주세요.");
      return;
    }
    setError("");
    // 실제 API 호출 로직: 인증번호 전송
    console.log(`인증번호를 ${phone}으로 전송 시도`);
    alert(`인증번호가 전송되었습니다. (임시 인증번호: 1234)`);
    setIsCodeSent(true);
    // isAuthVerified는 아직 false 유지
  };

  // 3. 인증번호 입력 핸들러
  const handleVerifyCode = () => {
    if (authCode === "1234") {
      // 임시 인증번호 검증
      setIsAuthVerified(true);
      setError("");
      alert("인증이 완료되었습니다!");
    } else {
      setError("인증번호가 일치하지 않습니다.");
      setIsAuthVerified(false);
    }
  };

  // 4. 아이디 찾기 버튼 핸들러 (최종 제출)
  const handleFindId = () => {
    if (!isAuthVerified) {
      setError("전화번호 인증을 완료해주세요.");
      return;
    }

    // 실제 API 호출 로직: 아이디 조회 (전화번호로 DB 검색)
    const mockFoundId = "codenavi123"; // 임시로 찾았다고 가정
    // const mockFoundId = null; // 임시로 아이디가 없다고 가정

    if (mockFoundId) {
      setFoundId(mockFoundId);
    } else {
      setFoundId("NOT_FOUND");
    }
  };

  // 5. 로그인 페이지로 이동
  const goToLogin = () => {
    navigate("/login");
  };

  // 6. 회원가입 페이지로 이동
  const goToSignup = () => {
    navigate("/signup");
  };

  // --- 아이디 찾기 결과 화면 ---
  if (foundId) {
    return (
      <div className="FindId_wrap">
        <div className="findid-box">
          <h1 className="findid-title">아이디 찾기</h1>
          <div className="result-box">
            {foundId !== "NOT_FOUND" ? (
              <>
                <p className="result-message">회원님의 아이디는</p>
                <p className="found-id">{foundId}</p>
                <p className="result-message">입니다.</p>
                <button className="action-button" onClick={goToLogin}>
                  로그인 페이지로 이동
                </button>
              </>
            ) : (
              <>
                <p className="result-message go-signup-text">
                  입력하신 정보로 등록된 아이디가 없습니다.
                </p>
                <button className="action-button" onClick={goToSignup}>
                  회원가입 하러가기
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- 아이디 찾기 입력 폼 화면 ---
  return (
    <div className="FindId_wrap">
      <div className="findid-box">
        <h1 className="findid-title">아이디 찾기</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleFindId();
          }}
        >
          {/* 1. 전화번호 입력 */}
          <div className="input-group">
            <div className="input-container">
              <input
                type="tel"
                placeholder="등록된 전화번호 입력"
                value={phone}
                onChange={handlePhoneChange}
                className="findid-input"
                disabled={isCodeSent && !isAuthVerified} // 인증번호 전송 후에는 비활성화
              />
              <button
                type="button"
                className="send-button"
                onClick={handleSendCode}
                disabled={isCodeSent || isAuthVerified} // 이미 전송했거나 인증 완료 시 비활성화
              >
                인증번호 전송
              </button>
            </div>
          </div>

          {/* 2. 인증번호 입력 (인증번호 전송 후 표시) */}
          {isCodeSent && !isAuthVerified && (
            <div className="input-group auth-code-input">
              <div className="input-container">
                <input
                  type="text"
                  placeholder="인증번호 입력"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  className="findid-input"
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

          {/* 3. 아이디 찾기 버튼 */}
          <button
            type="submit"
            className="findid-button"
            disabled={!isAuthVerified} // 인증 완료되어야 활성화
          >
            아이디 찾기
          </button>
        </form>
      </div>
    </div>
  );
};

export default FindId;
