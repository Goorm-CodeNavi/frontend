import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FinishTemppwModal from './Modal/FinishTemppwModal';
import NoEmailModal from './Modal/NoEmailModal';
import { issueTempPassword } from '../../api/userApi';

const ResetPassword = () => {
    const navigate = useNavigate();

    const [id, setId] = useState('');
    const [email, setEmail] = useState('');

    // 모달 상태 | 로딩
    const [showIssued, setShowIssued] = useState(false);
    const [tempPw, setTempPw] = useState('');
    const [showNoEmail, setShowNoEmail] = useState(false);
    const [loading, setLoading] = useState(false);

    // 이메일 유효성 검사
    const isValidEmail = useMemo(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }, [email]);

    // 버튼 활성화(아이디 + 이메일 유효 시)
    const canIssue = useMemo(() => !!id.trim() && isValidEmail, [id, isValidEmail]);

    const handleIssue = async () => {
        if (!canIssue) return;
        try {
            setLoading(true);
            const { data, status } = await issueTempPassword(id.trim(), email.trim());

            if (status === 200 && data?.isSuccess) {
                setShowIssued(true);
            } else if (status === 400) {
                const msg = data?.result || data?.message || '잘못된 요청입니다.';
                alert(msg);
            } else {
                alert(data?.message || '처리 중 오류가 발생했습니다.');
            }
        } catch (e) {
            alert('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    const closeIssuedAndGoLogin = () => {
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
                    />
                </div>
                <div className="email_input">
                    <input
                        type="text"
                        placeholder="이메일을 입력해 주세요"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                {/* 이메일 형식 오류 안내 */}
                {email.length > 0 && !isValidEmail && (
                    <div className="warning">
                        올바른 이메일 형식이 아닙니다.
                    </div>
                )}
                <div className="divider"></div>
                <div
                    className={`submit_btn ${canIssue ? '' : 'disabled'}`}
                    onClick={canIssue ? handleIssue : undefined}
                    aria-disabled={!canIssue}
                >
                    {loading ? '처리 중...' : '임시 비밀번호 발급받기'}
                </div>
            </div>

            {/* 임시 비밀번호 발급 완료 모달 */}
            <FinishTemppwModal
                open={showIssued}
                onClose={closeIssuedAndGoLogin}
            />

            {/* 유저 없음 모달 */}
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
