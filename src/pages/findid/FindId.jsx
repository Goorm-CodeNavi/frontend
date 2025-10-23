import React, { useState } from 'react';
// [경로 수정] './Modal/UserId.jsx'를 참조하도록 변경 (NoUser는 제거)
import UserId from './Modal/UserId.jsx';
import { useNavigate } from 'react-router-dom';
// [경로 수정] 'src/api/userApi.js'를 참조하도록 변경
import { sendVerificationCodeForId, verifyCodeAndFindId } from '../../api/userApi.js';

const FindId = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [showUnder, setShowUnder] = useState(false);
    const [code, setCode] = useState('');

    // '가입되지 않은 회원' 모달은 현재 백엔드 로직상 도달 불가능하여 제거합니다.
    // const [showNoUser, setShowNoUser] = useState(false); 
    const [showUserId, setShowUserId] = useState(false);
    const [foundUserId, setFoundUserId] = useState(''); // UserId 모달에 표시할 아이디

    // alert 대신 사용할 메시지 상태
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // [수정] 'await' 키워드를 사용하기 위해 'async'를 추가합니다.
    const handleSendCode = async () => {
        if (!email.trim()) {
            setMessage("이메일을 입력해주세요.");
            return;
        }

        setIsLoading(true);
        setMessage(''); // 이전 메시지 초기화

        try {
            // 실제 인증번호 전송 API 호출
            const { data, status } = await sendVerificationCodeForId(email);

            if (status === 200) {
                setShowUnder(true);
                setMessage('인증번호가 발송되었습니다. 이메일을 확인해주세요.');
            } else {
                setMessage(data.message || '인증번호 발송에 실패했습니다.');
            }
        } catch (error) {
            console.error("Send code error:", error);
            setMessage(error.response?.data?.message || '발송 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!code.trim()) {
            setMessage('인증번호를 입력해주세요');
            return;
        }

        setIsLoading(true);
        setMessage(''); // 이전 메시지 초기화

        try {
            // 실제 인증 검증 API 호출
            const { data, status } = await verifyCodeAndFindId(email, code);

            // API 성공 (200) 및 응답 데이터에 username이 있는 경우
            if (status === 200 && data.result?.username) {
                setFoundUserId(data.result.username);
                setShowUserId(true);
            } else {
                // API는 200을 반환했으나 username이 없는 비정상적인 경우
                setMessage('인증에 성공했으나 사용자 정보를 찾을 수 없습니다.');
            }

        } catch (error) {
            // API 실패 (400: 코드 불일치/만료, 404 등)
            console.error("Verify code error:", error);
            // 백엔드(AuthController)에서 400일 때 보내는 메시지
            const errorMsg = error.response?.data?.message || '인증에 실패했습니다.';
            setMessage(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const closeModals = () => {
        // setShowNoUser(false); // NoUser 모달 로직 제거
        setShowUserId(false);
        
        // [수정] ESLint 경고(no-unused-vars)를 해결하기 위해 주석 해제
        navigate("/login"); 
    };

    return (
        <div className='FindId_wrap'>
            <div className="findid_container">
                <h1>아이디 찾기</h1>
                <div className="email_input">
                    <input
                        type="text"
                        placeholder='이메일을 입력해 주세요'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                    />
                    <div 
                        className={`send ${isLoading ? 'disabled' : ''}`}
                        onClick={!isLoading ? handleSendCode : null}
                    >
                        {isLoading ? '전송중...' : '인증번호 전송'}
                    </div>
                </div>

                {/* alert 대신 메시지 표시 */}
                {message && (
                    <div className={`warning ${showUserId ? 'success' : ''}`}>
                        {message}
                    </div>
                )}

                {showUnder && (
                    <div className="after">
                        <div className="code_input">
                            <input
                                type="text"
                                placeholder="인증번호를 입력해 주세요"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="divider"></div>
                        <div 
                            className={`submit_btn ${isLoading ? 'disabled' : ''}`}
                            onClick={!isLoading ? handleVerify : null}
                        >
                            {isLoading ? '인증중...' : '인증하기'}
                        </div>
                    </div>
                )}
            </div>

            {/* NoUser 모달은 현재 백엔드 로직상 도달 불가능하여 주석 처리
            {showNoUser && (
                <div className="modal_overlay" onClick={closeModals}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <NoUser onClose={closeModals} />
                    </div>
                </div>
            )}
            */}

            {showUserId && (
                <div className="modal_overlay" onClick={closeModals}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <UserId userId={foundUserId} onClose={closeModals} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default FindId;








