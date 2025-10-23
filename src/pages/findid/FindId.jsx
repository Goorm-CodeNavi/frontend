import React, { useState } from 'react'
import NoUser from './Modal/NoUser';
import UserId from './Modal/UserId';
import { useNavigate } from 'react-router-dom';

const FindId = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [showUnder, setShowUnder] = useState(false);
    const [code, setCode] = useState('');


    const [showNoUser, setShowNoUser] = useState(false);
    const [showUserId, setShowUserId] = useState(false);
    const [foundUserId, setFoundUserId] = useState(''); // UserId 모달에 표시할 아이디

    const handleSendCode = () => {
        if (!email.trim()) {
            alert("이메일을 입력해주세요.");
            return;
        }

        const confirmed = window.confirm(`${email} 으로 인증번호를 보내시겠습니까?`);
        if (confirmed) {
            setShowUnder(true);
            // TODO: 실제 인증번호 전송 API 호출 지점
            // await sendVerificationCode(email)
        }
    };

    const handleVerify = async () => {
        if (!code.trim()) {
            alert('인증번호를 입력해주세요');
            return;
        }

        // TODO: 실제 인증 검증 API 호출 지점
        // const res = await verifyCode({ email, code });
        // const isValid = res.data?.isValid;
        // const hasUser = res.data?.hasUser;
        // const userId = res.data?.userId;

        // 더미데이터
        const isValid = code === '123456';
        const hasUser = 1;
        const userId = 'aster03';

        if (!isValid) {
            alert('인증번호가 알맞지 않습니다. 다시 인증해주세요.');
            return;
        }

        if (!hasUser) {
            setShowNoUser(true);
        } else {
            setFoundUserId(userId);
            setShowUserId(true);
        }
    };

    const closeModals = () => {
        setShowNoUser(false);
        setShowUserId(false);

        // navigate("/login");  // 모달 닫고 로그인 페이지로 이동
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
                    />
                    <div className="send" onClick={handleSendCode}>인증번호 전송</div>
                </div>

                {showUnder && (
                    <div className="after">
                        <div className="code_input">
                            <input
                                type="text"
                                placeholder="인증번호를 입력해 주세요"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>
                        <div className="divider"></div>
                        <div className="submit_btn" onClick={handleVerify}>인증하기</div>
                    </div>
                )}
            </div>

            {showNoUser && (
                <div className="modal_overlay" onClick={closeModals}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <NoUser onClose={closeModals} />
                    </div>
                </div>
            )}

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

export default FindId
