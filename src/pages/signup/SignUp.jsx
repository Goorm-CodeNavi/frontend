import React, { useState } from "react";
import Hide from '../../assets/img/ic_hide.svg';
import Seek from '../../assets/img/ic_seek.svg';
import Agree from '../../assets/img/ic_agree.svg';
import Disagree from '../../assets/img/ic_disagree.svg';
import Checked from '../../assets/img/ic_checked.svg';
import Unchecked from '../../assets/img/ic_unchecked.svg';
import GotoDetail from '../../assets/img/ic_goto_detail.svg';
import { useNavigate } from "react-router-dom";
// API 함수 임포트
import { checkId, signUp } from '../../api/userApi';

const SignUp = () => {
    const navigate = useNavigate();

    // --- 폼 필드 상태 ---
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [email, setEmail] = useState("");

    // --- UI 상태 ---
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // --- 약관 동의 상태 ---
    const [agreeService, setAgreeService] = useState(false);
    const [agreeUserInfo, setAgreeUserInfo] = useState(false);
    const [agreeEmail, setAgreeEmail] = useState(false);
    const [agreeSMS, setAgreeSMS] = useState(false);

    // --- 유효성 검사 메시지 ---
    const [idMessage, setIdMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState(""); // 8자 이상
    const [passwordConfirmMessage, setPasswordConfirmMessage] = useState(""); // 불일치
    const [emailMessage, setEmailMessage] = useState("");
    
    // --- API 관련 상태 ---
    const [isIdChecked, setIsIdChecked] = useState(false); // 아이디 중복 확인 완료 여부
    const [formError, setFormError] = useState(""); // 폼 전체 에러

    // --- 유효성 검사 함수 ---
    const validateId = (id) => {
        const regex = /^[a-z0-9]{5,20}$/;
        if (!id) return { valid: false, msg: "아이디를 입력해주세요." };
        if (!regex.test(id)) return { valid: false, msg: "5~20자의 영문 소문자, 숫자만 사용 가능합니다." };
        return { valid: true, msg: "" };
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return { valid: false, msg: "이메일을 입력해주세요." };
        if (!regex.test(email)) return { valid: false, msg: "올바른 이메일 형식이 아닙니다." };
        return { valid: true, msg: "" };
    };

    const validatePassword = (password) => {
        if (!password) return { valid: false, msg: "비밀번호를 입력해주세요." };
        if (password.length < 8) return { valid: false, msg: "비밀번호는 8자 이상이어야 합니다." };
        return { valid: true, msg: "" };
    };

    // --- 이벤트 핸들러 ---
    const handleIdChange = (e) => {
        const newId = e.target.value;
        setId(newId);
        setIsIdChecked(false); // ID가 변경되면 중복 확인 상태 초기화
        const { msg } = validateId(newId);
        setIdMessage(msg); // 실시간 유효성 검사 메시지
    };

    // 아이디 중복 확인 핸들러
    const handleCheckId = async () => {
        const { valid, msg } = validateId(id);
        if (!valid) {
            setIdMessage(msg);
            setIsIdChecked(false);
            return;
        }

        try {
            const { status, data } = await checkId(id); // userApi.js의 checkId 호출
            if (status === 200) {
                setIdMessage("사용 가능한 아이디입니다.");
                setIsIdChecked(true);
            } else if (status === 409) {
                setIdMessage(data?.message || "이미 존재하는 아이디입니다.");
                setIsIdChecked(false);
            } else {
                setIdMessage(data?.result || data?.message || "아이디를 확인해주세요.");
                setIsIdChecked(false);
            }
        } catch (err) {
            console.error("ID check error:", err);
            setIdMessage("중복 확인 중 오류가 발생했습니다.");
            setIsIdChecked(false);
        }
    };
    
    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        const { msg } = validateEmail(newEmail);
        setEmailMessage(msg);
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        const { msg } = validatePassword(newPassword);
        setPasswordMessage(msg); // 8자 이상 검사
        
        // 비밀번호 변경 시 확인 필드도 재검증
        if (passwordConfirm) {
            if (newPassword === passwordConfirm) {
                setPasswordConfirmMessage("");
            } else {
                setPasswordConfirmMessage("비밀번호가 일치하지 않습니다.");
            }
        }
    };

    const handlePasswordConfirmChange = (e) => {
        const newPasswordConfirm = e.target.value;
        setPasswordConfirm(newPasswordConfirm);
        if (!newPasswordConfirm) {
            setPasswordConfirmMessage("");
        } else if (password === newPasswordConfirm) {
            setPasswordConfirmMessage("");
        } else {
            setPasswordConfirmMessage("비밀번호가 일치하지 않습니다.");
        }
    };

    // --- 마케팅 동의 ---
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

    // --- 폼 제출 핸들러 ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(""); // 이전 에러 초기화

        // 1. 개별 유효성 검사
        const idVal = validateId(id);
        const emailVal = validateEmail(email);
        const pwVal = validatePassword(password);
        const pwConfirmVal = (password === passwordConfirm);

        if (!idVal.valid) { setFormError("아이디를 확인해주세요."); return; }
        if (!emailVal.valid) { setFormError("이메일을 확인해주세요."); return; }
        if (!pwVal.valid) { setFormError("비밀번호를 확인해주세요."); return; }
        if (!pwConfirmVal) { setFormError("비밀번호가 일치하지 않습니다."); return; }

        // 2. 아이디 중복 확인 여부
        if (!isIdChecked) {
            setFormError("아이디 중복 확인을 해주세요.");
            return;
        }

        // 3. 필수 약관 동의 여부
        if (!agreeService || !agreeUserInfo) {
            setFormError("필수 약관에 동의해주세요.");
            return;
        }

        // 4. API 호출
        try {
            const { status, data } = await signUp({ username: id, password, email });
            if (status === 201) {
                alert("회원가입에 성공했습니다. 로그인 페이지로 이동합니다.");
                navigate("/login");
            } else {
                setFormError(data?.result || data?.message || "회원가입에 실패했습니다.");
            }
        } catch (err) {
            console.error("Signup error:", err);
            // err.response.data.message 등이 있을 수 있음
            const errorMsg = err.response?.data?.message || err.response?.data?.result || "회원가입 중 알 수 없는 오류가 발생했습니다.";
            setFormError(errorMsg);
        }
    };
    
    // --- 최종 유효성 ---
    const allRequiredAgreed = agreeService && agreeUserInfo;
    const isFormValid = validateId(id).valid &&
                        validateEmail(email).valid &&
                        validatePassword(password).valid &&
                        (password === passwordConfirm) &&
                        isIdChecked;

    return (
        <div className='SignUp_wrap'>
            <div className="signup_container">
                <h1>SIGN UP</h1>

                <form onSubmit={handleSubmit}>
                    <div className="user_id">
                        <div className="title">아이디</div>
                        <div className="id_input">
                            <input 
                                type="text" 
                                placeholder="아이디를 입력해주세요 (5~20자 영문, 숫자)" 
                                value={id}
                                onChange={handleIdChange}
                            />
                            <div className="dupl_btn" onClick={handleCheckId}>중복 확인</div>
                        </div>
                        {/* 아이디 메시지 (성공/에러) */}
                        {idMessage && (
                            <div className={`warning ${isIdChecked ? 'success' : ''}`}>
                                {idMessage}
                            </div>
                        )}
                    </div>

                    <div className="user_pw">
                        <div className="title">비밀번호</div>
                        <div className="new_pw">
                            <div className="pw_input">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="비밀번호를 입력해주세요 (8자 이상)" 
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                                <img
                                    src={showPassword ? Seek : Hide}
                                    alt="pw_visible"
                                    onClick={() => setShowPassword(prev => !prev)}
                                />
                            </div>
                        </div>
                        {/* 8자 이상 유효성 검사 메시지 */}
                        {passwordMessage && <div className="warning">{passwordMessage}</div>}

                        <div className="check_pw">
                            <div className="pw_input">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    placeholder="비밀번호를 다시 입력해주세요" 
                                    value={passwordConfirm}
                                    onChange={handlePasswordConfirmChange}
                                />
                                <img
                                    src={showConfirmPassword ? Seek : Hide}
                                    alt="pw_visible"
                                    onClick={() => setShowConfirmPassword(prev => !prev)}
                                />
                            </div>
                        </div>
                        {/* 비밀번호 불일치 메시지 */}
                        {passwordConfirmMessage && <div className="warning">{passwordConfirmMessage}</div>}
                    </div>

                    <div className="user_email">
                        <div className="title">이메일</div>
                        <div className="email_input">
                            <input 
                                type="text" 
                                placeholder="이메일을 입력해주세요" 
                                value={email}
                                onChange={handleEmailChange}
                            />
                        </div>
                        {/* 이메일 형식 유효성 검사 메시지 */}
                        {emailMessage && <div className="warning">{emailMessage}</div>}
                    </div>

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

                    {/* 폼 전체 에러 메시지 */}
                    {formError && <div className="warning" style={{textAlign: 'center', marginBottom: '10px'}}>{formError}</div>}

                    <button
                        type="submit"
                        className="signup_btn"
                        disabled={!isFormValid || !allRequiredAgreed} // 폼 유효 + 필수 약관 동의 시 활성화
                    >
                        가입하기
                    </button>
                </form>

            </div>
        </div >
    )
}

export default SignUp;
