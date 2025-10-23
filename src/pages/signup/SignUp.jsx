import React, { useState, useEffect } from "react";
import Hide from '../../assets/img/ic_hide.svg';
import Seek from '../../assets/img/ic_seek.svg';
import Agree from '../../assets/img/ic_agree.svg';
import Disagree from '../../assets/img/ic_disagree.svg';
import Checked from '../../assets/img/ic_checked.svg';
import Unchecked from '../../assets/img/ic_unchecked.svg';
import GotoDetail from '../../assets/img/ic_goto_detail.svg';
import { useNavigate } from "react-router-dom";
// API 함수 import (경로 수정)
import { checkId, signUp } from '../../api/userApi';

const SignUp = () => {
    const navigate = useNavigate();

    // --- 기존 UI 상태 ---
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeService, setAgreeService] = useState(false);
    const [agreeUserInfo, setAgreeUserInfo] = useState(false);
    const [agreeEmail, setAgreeEmail] = useState(false);
    const [agreeSMS, setAgreeSMS] = useState(false);

    // --- API 연동 및 유효성 검사를 위한 상태 ---
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");

    // 유효성 검사 및 API 응답 메시지
    const [idMessage, setIdMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [confirmPasswordMessage, setConfirmPasswordMessage] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [formMessage, setFormMessage] = useState(""); // 폼 전체 에러 메시지

    // 상태
    const [isIdValid, setIsIdValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isIdChecked, setIsIdChecked] = useState(false); // 아이디 중복 확인 완료 여부

    // --- 유효성 검사 로직 (useEffect 사용) ---

    // 아이디 유효성 (간단한 예: 5자 이상)
    useEffect(() => {
        if (id.length > 0 && id.length < 5) {
            setIdMessage("아이디는 5자 이상이어야 합니다.");
            setIsIdValid(false);
        } else if (id.length >= 5) {
            setIdMessage(""); // 중복 확인 대기
            setIsIdValid(true);
        } else {
            setIdMessage("");
            setIsIdValid(false);
        }
        setIsIdChecked(false); // 아이디 변경 시 중복 확인 리셋
    }, [id]);

    // 비밀번호 유효성 (간단한 예: 8자 이상)
    useEffect(() => {
        if (password.length > 0 && password.length < 8) {
            setPasswordMessage("비밀번호는 8자 이상이어야 합니다.");
            setIsPasswordValid(false);
        } else if (password.length >= 8) {
            setPasswordMessage("");
            setIsPasswordValid(true);
        } else {
            setPasswordMessage("");
            setIsPasswordValid(false);
        }
    }, [password]);

    // 비밀번호 확인 유효성
    useEffect(() => {
        if (confirmPassword.length > 0 && password !== confirmPassword) {
            setConfirmPasswordMessage("비밀번호가 일치하지 않습니다.");
            setIsConfirmPasswordValid(false);
        } else if (password === confirmPassword && confirmPassword.length > 0) {
            setConfirmPasswordMessage("");
            setIsConfirmPasswordValid(true);
        } else {
            setConfirmPasswordMessage("");
            setIsConfirmPasswordValid(false);
        }
    }, [password, confirmPassword]);

    // 이메일 유효성 (간단한 예: @ 포함)
    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.length > 0 && !emailRegex.test(email)) {
            setEmailMessage("올바른 이메일 형식이 아닙니다.");
            setIsEmailValid(false);
        } else if (emailRegex.test(email)) {
            setEmailMessage("");
            setIsEmailValid(true);
        } else {
            setEmailMessage("");
            setIsEmailValid(false);
        }
    }, [email]);


    // --- 이벤트 핸들러 ---

    // 아이디 중복 확인 핸들러
    const handleCheckId = async () => {
        if (!isIdValid) {
            setIdMessage("아이디는 5자 이상이어야 합니다.");
            return;
        }

        try {
            const { status, data } = await checkId(id);

            if (status === 200) {
                setIdMessage("사용 가능한 아이디입니다.");
                setIsIdChecked(true); // 중복 확인 완료
            } else if (status === 409) {
                setIdMessage(data.message || "이미 존재하는 아이디입니다.");
                setIsIdChecked(false);
            } else {
                setIdMessage(data.message || "아이디 확인 중 오류가 발생했습니다.");
                setIsIdChecked(false);
            }
        } catch (error) {
            console.error("ID Check error:", error);
            setIdMessage("서버 오류가 발생했습니다.");
            setIsIdChecked(false);
        }
    };

    // 마케팅 동의 토글
    const marketingAgreed = agreeEmail || agreeSMS;
    const toggleMarketingAll = () => {
        if (marketingAgreed) {
            setAgreeEmail(false);
            setAgreeSMS(false);
        } else {
            setAgreeEmail(true);
            setAgreeSMS(true);
        }
    };

    // [필수] 동의
    const allRequiredAgreed = agreeService && agreeUserInfo;

    // 가입하기 버튼 활성화 조건
    const isFormValid = isIdValid && isPasswordValid && isConfirmPasswordValid && isEmailValid && isIdChecked && allRequiredAgreed;


    // 회원가입 핸들러
    const handleSignUp = async () => {
        setFormMessage(""); // 이전 메시지 초기화

        if (!allRequiredAgreed) {
            setFormMessage("필수 약관에 모두 동의해야 합니다.");
            return;
        }

        if (!isIdChecked) {
            setFormMessage("아이디 중복 확인을 완료해주세요.");
            return;
        }

        if (!isFormValid) {
            setFormMessage("입력 정보를 다시 확인해주세요.");
            return;
        }

        try {
            const { data, status } = await signUp({
                username: id,
                password: password,
                email: email
            });

            if (status === 201 || status === 200) { // 201 Created
                alert("회원가입에 성공했습니다. 로그인 페이지로 이동합니다.");
                navigate("/login"); // 로그인 페이지로 이동
            } else {
                // 백엔드에서 오는 다양한 실패 메시지 (400, 409 등)
                setFormMessage(data.message || "회원가입에 실패했습니다.");
            }
        } catch (error) {
            console.error("Signup error:", error);
            setFormMessage("회원가입 중 서버 오류가 발생했습니다.");
        }
    };

    // --- JSX 렌더링 ---
    return (
        <div className='SignUp_wrap'>
            <div className="signup_container">
                <h1>SIGN UP</h1>

                {/* 아이디 */}
                <div className="user_id">
                    <div className="title">아이디</div>
                    <div className="id_input">
                        <input
                            type="text"
                            placeholder="아이디를 입력해주세요"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        />
                        <div
                            className={`dupl_btn ${isIdValid ? '' : 'disabled'}`}
                            onClick={isIdValid ? handleCheckId : null}
                        >
                            중복 확인
                        </div>
                    </div>
                    {/* 아이디 메시지 (중복 확인 결과 또는 유효성 검사) */}
                    {idMessage && (
                        <div className={`warning ${isIdChecked ? 'success' : ''}`}>
                            {idMessage}
                        </div>
                    )}
                </div>

                {/* 비밀번호 */}
                <div className="user_pw">
                    <div className="title">비밀번호</div>
                    <div className="new_pw">
                        <div className="pw_input">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="비밀번호를 입력해주세요"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <img
                                src={showPassword ? Seek : Hide}
                                alt="pw_visible"
                                onClick={() => setShowPassword(prev => !prev)}
                            />
                        </div>
                    </div>
                    {/* 비밀번호 유효성 메시지 */}
                    {passwordMessage && <div className="warning">{passwordMessage}</div>}

                    <div className="check_pw">
                        <div className="pw_input">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="비밀번호를 다시 입력해주세요"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <img
                                src={showConfirmPassword ? Seek : Hide}
                                alt="pw_visible"
                                onClick={() => setShowConfirmPassword(prev => !prev)}
                            />
                        </div>
                    </div>
                    {/* 비밀번호 확인 메시지 */}
                    {confirmPasswordMessage && <div className="warning">{confirmPasswordMessage}</div>}
                </div>

                {/* 이메일 */}
                <div className="user_email">
                    <div className="title">이메일</div>
                    <div className="email_input">
                        <input
                            type="text"
                            placeholder="이메일을 입력해주세요"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {/* 이메일 유효성 메시지 */}
                    {emailMessage && <div className="warning">{emailMessage}</div>}
                </div>

                {/* 약관 동의 */}
                <div className="user_agrees">
                    <div className="service_agree">
                        <div className="agreeinfo" onClick={() => setAgreeService((prev) => !prev)}>
                            <img
                                src={agreeService ? Agree : Disagree}
                                alt="service_agree"
                            />
                            <div className="agree_title">
                                <div className="highlight">[필수]</div> CODENAVI 서비스 이용 약관에 동의합니다
                            </div>
                        </div>
                        <div className="goto_detail">
                            <img src={GotoDetail} alt="GotoDetail" />
                        </div>
                    </div>
                    <div className="userinfo_agree">
                        <div className="agreeinfo" onClick={() => setAgreeUserInfo((prev) => !prev)}>
                            <img
                                src={agreeUserInfo ? Agree : Disagree}
                                alt="userinfo_agree"
                            />
                            <div className="agree_title">
                                <div className="highlight">[필수]</div> 개인정보 취급방법 및 이용안내에 동의합니다
                            </div>
                        </div>
                        <div className="goto_detail">
                            <img src={GotoDetail} alt="GotoDetail" />
                        </div>
                    </div>
                    <div className="marketing_agree">
                        <div className="agreeinfo" onClick={toggleMarketingAll}>
                            <img
                                src={marketingAgreed ? Agree : Disagree}
                                alt="marketing_agree"
                            />
                            <div className="agree_title">[선택] 마케팅 활용 및 수신에 동의합니다</div>
                        </div>
                        <div className="marketing_type">
                            <div className="m_email" onClick={() => setAgreeEmail((prev) => !prev)}>
                                <img
                                    src={agreeEmail ? Checked : Unchecked}
                                    alt="email_check"
                                />
                                <div className="m_text">이메일</div>
                            </div>
                            <div className="m_sms" onClick={() => setAgreeSMS((prev) => !prev)}>
                                <img
                                    src={agreeSMS ? Checked : Unchecked}
                                    alt="sms_check"
                                />
                                <div className="m_text">SMS</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="divider"></div>

                {/* 폼 전체 메시지 */}
                {formMessage && <div className="warning form-error">{formMessage}</div>}

                {/* 가입하기 버튼 (활성화/비활성화 스타일 적용) */}
                <div
                    className={`signup_btn ${isFormValid ? '' : 'disabled'}`}
                    onClick={isFormValid ? handleSignUp : null} // 유효할 때만 클릭 가능
                >
                    가입하기
                </div>
            </div>
        </div >
    )
}

export default SignUp;

