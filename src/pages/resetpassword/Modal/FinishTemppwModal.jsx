import React from 'react';
import { useNavigate } from 'react-router-dom';

const FinishTemppwModal = ({ open, onClose }) => {
    const navigate = useNavigate();
    if (!open) return null;

    const handleGoLogin = () => {
        onClose?.();
        navigate('/login');
    };

    return (
        <div className="FinishTemppwModal_wrap" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="FinishTemppw_box">
                    <div className="text">입력하신 이메일로 임시 비밀번호가 발급되었습니다.</div>
                    <div className="subtext">확인 후 다시 로그인 해주시기 바랍니다.</div>
                    <div className="goto_login" onClick={handleGoLogin}>
                        로그인 하러 가기
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinishTemppwModal;
