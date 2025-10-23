import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FinishTemppwModal from './Modal/FinishTemppwModal';
import NoEmailModal from './Modal/NoEmailModal';

const ResetPassword = () => {
    const navigate = useNavigate();

    const [id, setId] = useState('');
    const [email, setEmail] = useState('');
    const [showUnder, setShowUnder] = useState(false); // 인증번호 입력 섹션 표시
    const [code, setCode] = useState('');
    const [isVerified, setIsVerified] = useState(false); // 인증 완료 여부

    const [showIssued, setShowIssued] = useState(false);
    const [tempPw, setTempPw] = useState('');
    const [showNoEmail, setShowNoEmail] = useState(true);

    const canSendCode = useMemo(
        () => !!id.trim() && !!email.trim() && !isVerified,
        [id, email, isVerified]
    );

    const handleSendCode = async () => {
        if (!canSendCode) return;

        const confirmed = window.confirm(`${email} 으로 인증번호를 보내시겠습니까?`);
        if (!confirmed) return;

        // TODO: 실제 인증번호 전송 API
        // await sendResetPasswordCode({ id, email })

        setShowUnder(true);
    };

    const handleVerify = async () => {
        if (!code.trim()) {
            alert('인증번호를 입력해주세요.');
            return;
        }

        // TODO: 실제 인증 검증 API
        // const { isValid, tempPassword } = await verifyResetCode({ id, email, code });

        // 데모: 123456 이면 성공, 임시 비번 랜덤 생성
        const isValid = code === '123456';
        if (!isValid) {
            alert('인증번호가 알맞지 않습니다. 다시 인증해주세요.');
            return;
        }

        setIsVerified(true);// 데모: id가 'nouser'이면 유저 없음으로 가정
        const hasUser = id.trim().toLowerCase() !== 'nouser';

        if (!hasUser) {
            setShowNoEmail(true);
            return;
        }

        // 유저가 있는 경우 임시 비밀번호 발급 모달
        const randomTemp = `tmp-${Math.random().toString(36).slice(2, 8)}`;
        setTempPw(randomTemp);
        setShowIssued(true);
    };

    const closeModalAndGoLogin = () => {
        setShowIssued(false);
        navigate('/login');
    };

    return (
        <div className="ResetPassword_wrap">
            <div className="reset_container">
                <h1>임시 비밀번호 발급</h1>
                <div className="id_input">
                    <input
                        type="text"
                        placeholder="아이디를 입력해 주세요"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        disabled={isVerified}
                    />
                </div>
                <div className="email_input">
                    <input
                        type="text"
                        placeholder="이메일을 입력해 주세요"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isVerified}
                    />
                    <div
                        className={`send ${canSendCode ? '' : 'disabled'}`}
                        onClick={canSendCode ? handleSendCode : undefined}
                        aria-disabled={!canSendCode}
                    >
                        인증번호 전송
                    </div>
                </div>
                {showUnder && !isVerified && (
                    <div className="after">
                        <div className="code_input">
                            <input
                                type="text"
                                placeholder="인증번호를 입력해 주세요"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>
                        <div className="divider" />
                        <div className="submit_btn" onClick={handleVerify}>
                            임시 비밀번호 발급받기
                        </div>
                    </div>
                )}
            </div>
            <FinishTemppwModal open={showIssued} onClose={closeModalAndGoLogin} />
            {showNoEmail && (
                <div className="modal_overlay" onClick={() => setShowNoEmail(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <NoEmailModal />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResetPassword;
