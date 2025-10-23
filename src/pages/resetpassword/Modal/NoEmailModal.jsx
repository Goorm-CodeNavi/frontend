import React from 'react'
import { useNavigate } from 'react-router-dom';

const NoEmailModal = () => {
    const navigate = useNavigate();

    return (
        <div className='NoEmailModal_wrap'>
            <div className="text">입력하신 이메일 혹은 아이디로 등록된 유저가 없습니다.</div>
            <div className="subtext">회원가입 후 이용해주시기 바랍니다.</div>
            <div className="goto_signup" onClick={() => navigate("/signup")}>회원가입 하러가기</div>
        </div>
    )
}

export default NoEmailModal
