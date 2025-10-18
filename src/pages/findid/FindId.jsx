import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/scss/section/findid/_findid.scss";

const FindId = () => {
  const navigate = useNavigate();

  // 상태 변수 이름 수정: email -> phone
  const [phone, setPhone] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isAuthVerified, setIsAuthVerified] = useState(false);
  const [foundId, setFoundId] = useState(null);
  const [error, setError] = useState("");

  // 1. 전화번호 입력 핸들러 (수정: phone 상태 업데이트)
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    setError("");
    // 전화번호 변경 시 인증 상태 초기화
    setIsCodeSent(false);
    setIsAuthVerified(false);
    setFoundId(null);
  };

  // 2. 인증번호 전송 핸들러
  const handleSendCode = () => {
    if (!phone || phone.length < 10) {
      // 전화번호 길이 검증
      setError("유효한 전화번호를 입력해주세요.");
      return;
    }
    setError("");
    // 실제 API 호출 로직: 인증번호 전송
    console.log(`인증번호를 ${phone}으로 전송 시도`);
    // NOTE: alert()는 사용하지 않는 것이 좋지만, 현재 로직을 유지
    alert(`인증번호가 전송되었습니다. (임시 인증번호: 1234)`);
    setIsCodeSent(true);
  };

  // 3. 인증번호 입력 핸들러
  const handleVerifyCode = () => {
    if (authCode === "1234") {
      // 임시 인증번호 검증
      setIsAuthVerified(true);
      setError("");
      // NOTE: alert()는 사용하지 않는 것이 좋지만, 현재 로직을 유지
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

    setError("");
    // 실제 API 호출 로직: 아이디 조회 (전화번호로 DB 검색)
    // 현재는 임시로 찾았다고 가정
    const mockFoundId = "codenavi123";
    // const mockFoundId = null; // 아이디가 없다고 가정 시 주석 해제

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
      <div className="auth_wrap">
        {" "}
        {/* <--- 클래스 이름 통일 */}
        <div className="auth-box">
          {" "}
          {/* <--- 클래스 이름 통일 */}
          <h1 className="auth-title">아이디 찾기</h1>{" "}
          {/* <--- 클래스 이름 통일 */}
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
    <div className="auth_wrap">
      {" "}
      {/* <--- 클래스 이름 통일 */}
      <div className="auth-box">
        {" "}
        {/* <--- 클래스 이름 통일 */}
        <h1 className="auth-title">아이디 찾기</h1>{" "}
        {/* <--- 클래스 이름 통일 */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleFindId();
          }}
        >
          {/* 1. 전화번호 입력 및 인증번호 전송 */}
          <div className="input-group">
            <div className="input-container input-with-button">
              {" "}
              {/* <--- input-with-button 클래스 추가 */}
              <input
                type="tel"
                placeholder="등록된 전화번호 입력"
                value={phone}
                onChange={handlePhoneChange}
                className="auth-input" /* <--- 클래스 이름 통일 */
                disabled={isCodeSent && !isAuthVerified}
              />
              <button
                type="button"
                className="send-button"
                onClick={handleSendCode}
                disabled={isCodeSent || isAuthVerified}
              >
                {isCodeSent ? "재전송" : "인증번호 전송"}{" "}
                {/* <--- 전송 상태에 따라 텍스트 변경 */}
              </button>
            </div>
          </div>

          {/* 2. 인증번호 입력 (인증번호 전송 후 표시) */}
          {isCodeSent && !isAuthVerified && (
            <div className="input-group auth-code-input">
              <div className="input-container input-with-button">
                {" "}
                {/* <--- input-with-button 클래스 추가 */}
                <input
                  type="text"
                  placeholder="인증번호 입력"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  className="auth-input" /* <--- 클래스 이름 통일 */
                />
                <button
                  type="button"
                  className="auth-button"
                  onClick={handleVerifyCode}
                  disabled={authCode.length < 4} /* 4자리 이상 입력 시 활성화 */
                >
                  인증 확인
                </button>
              </div>
            </div>
          )}

          {/* 에러 메시지는 input-group 바로 아래에 표시되도록 위치 조정 (폼 중간) */}
          {error && <p className="error-message">{error}</p>}

          {/* 3. 아이디 찾기 버튼 (최종 버튼은 항상 아래쪽에) */}
          <button
            type="submit"
            className="findid-submit-button" /* <--- SCSS와 일치하도록 클래스 이름 변경 */
            disabled={!isAuthVerified}
          >
            아이디 찾기
          </button>
        </form>
      </div>
    </div>
  );
};

export default FindId;
