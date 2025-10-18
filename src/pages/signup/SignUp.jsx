import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../assets/scss/section/signup/_signup.scss";

const SignUp = () => {
  const navigate = useNavigate();

  // 입력 필드 상태 관리
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    confirmPassword: "",
    email: "",
    agreedService: false,
    agreedTerms: false,
    agreedOptional: false,
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // 입력 시 에러 메시지 초기화
    setError((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxClick = (name) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const validateForm = () => {
    const newError = {};
    if (!formData.id) newError.id = "아이디를 입력해 주세요.";
    if (!formData.password) newError.password = "비밀번호를 입력해 주세요.";
    if (formData.password.length < 8 || formData.password.length > 30) {
      // 비밀번호 길이 유효성 검사 추가
      newError.password = "비밀번호는 8~30자 이내여야 합니다.";
    }
    if (formData.password !== formData.confirmPassword) {
      newError.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }
    if (!formData.email) newError.email = "이메일을 입력해 주세요.";
    if (!formData.agreedService || !formData.agreedTerms) {
      newError.agreement = "필수 약관에 동의해 주세요.";
    }
    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const handleIdCheck = () => {
    alert("아이디 중복 확인 기능 구현 예정");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("회원가입 시도:", formData);
      // API 호출 로직 (현재는 임시로 메인 페이지로 이동)
      alert("회원가입이 완료되었습니다!");
      navigate("/login");
    }
  };

  return (
    <div className="signup_wrap">
      <div className="signup-box">
        {" "}
        {/* <--- signup-box 추가 */}
        <h1 className="signup-title">회원가입</h1>
        <form onSubmit={handleSubmit}>
          {/* 1. 아이디 입력 */}
          <div className="input-group">
            <label className="input-label" htmlFor="id">
              아이디
            </label>
            <div className="input-container">
              <input
                type="text"
                id="id"
                name="id"
                className="signup-input"
                placeholder="아이디를 입력해 주세요."
                value={formData.id}
                onChange={handleChange}
              />
              <button
                type="button"
                className="check-button"
                onClick={handleIdCheck}
              >
                중복 확인
              </button>
            </div>
            {error.id && <p className="error-message">{error.id}</p>}
            {/* 임시 메시지: ID 사용 불가 메시지 */}
            {/* {error.id === "이미 사용 중인 아이디입니다." && <p className="error-message">이미 사용 중인 아이디입니다.</p>} */}
          </div>

          {/* 2. 비밀번호 입력 */}
          <div className="input-group">
            {" "}
            {/* <--- style={{ position: "relative" }} 제거, input-container에 적용 */}
            <label className="input-label" htmlFor="password">
              비밀번호
            </label>
            <div className="input-container">
              {" "}
              {/* <--- input-container 추가 */}
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                className="signup-input"
                placeholder="비밀번호를 입력해 주세요. (8~30자)" // <--- 플레이스홀더 텍스트 수정
                value={formData.password}
                onChange={handleChange}
              />
              <span
                className="password-toggle"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            {error.password && (
              <p className="error-message">{error.password}</p>
            )}
          </div>

          {/* 3. 비밀번호 확인 */}
          <div className="input-group">
            {" "}
            {/* <--- style={{ position: "relative" }} 제거, input-container에 적용 */}
            {/* 비밀번호 확인 라벨이 없으므로 추가하지 않음 (디자인에 따라 다름) */}
            <div className="input-container">
              {" "}
              {/* <--- input-container 추가 */}
              <input
                type={confirmVisible ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className="signup-input"
                placeholder="비밀번호를 다시 입력해 주세요." // <--- 플레이스홀더 텍스트 수정
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <span
                className="password-toggle"
                onClick={() => setConfirmVisible(!confirmVisible)}
              >
                {confirmVisible ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            {error.confirmPassword && (
              <p className="error-message">{error.confirmPassword}</p>
            )}
          </div>

          {/* 4. 이메일 입력 */}
          <div className="input-group">
            <label className="input-label" htmlFor="email">
              이메일
            </label>
            <div className="input-container">
              {" "}
              {/* <--- input-container 추가 */}
              <input
                type="email" // <--- type="tel" 에서 type="email"로 변경
                id="email"
                name="email"
                className="signup-input"
                placeholder="이메일을 입력해 주세요."
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {error.email && <p className="error-message">{error.email}</p>}
          </div>

          {/* 5. 약관 동의 섹션 */}
          <div className="agreement-section">
            {error.agreement && (
              <p className="error-message" style={{ marginBottom: "15px" }}>
                {error.agreement}
              </p>
            )}

            {/* 서비스 약관 (필수) */}
            <div
              className="agreement-item"
              onClick={() => handleCheckboxClick("agreedService")}
            >
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="agreedService"
                  name="agreedService"
                  checked={formData.agreedService}
                  onChange={() => {}} // 부모 div에서 상태를 처리하므로 dummy function
                />
                <span className="agreement-text">
                  [필수] CODENAVI 서비스 이용약관에 동의합니다
                </span>
              </div>
              <span className="detail-link">&gt;</span>
            </div>

            {/* 개인정보 처리 (필수) */}
            <div
              className="agreement-item"
              onClick={() => handleCheckboxClick("agreedTerms")}
            >
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="agreedTerms"
                  name="agreedTerms"
                  checked={formData.agreedTerms}
                  onChange={() => {}}
                />
                <span className="agreement-text">
                  [필수] 개인정보 취급방침 및 이용안내에 동의합니다
                </span>
              </div>
              <span className="detail-link">&gt;</span>
            </div>

            {/* 선택 약관 */}
            <div
              className="agreement-item"
              onClick={() => handleCheckboxClick("agreedOptional")}
            >
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="agreedOptional"
                  name="agreedOptional"
                  checked={formData.agreedOptional}
                  onChange={() => {}}
                />
                <span className="agreement-text">
                  [선택] 마케팅 정보 수신에 동의합니다
                </span>
              </div>
              <span className="detail-link">&gt;</span>
            </div>
          </div>

          {/* 6. 가입하기 버튼 */}
          <button type="submit" className="submit-button">
            {" "}
            {/* <--- class name 수정 */}
            가입하기
          </button>
        </form>
      </div>{" "}
      {/* <--- signup-box 닫기 */}
    </div>
  );
};

export default SignUp;
