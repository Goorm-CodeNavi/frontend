import React from 'react';
import { useNavigate } from 'react-router-dom';

const NoUser = () => {
    const navigate = useNavigate();
    
    return (
        <div className='NoUser_wrap'>
            <div className="text">입력하신 이메일로 등록한 아이디가 없습니다.</div>
            <div className="subtext">회원가입 후 이용해주시기 바랍니다.</div>
            <div className="goto_signup" onClick={() => navigate("/signup")}>회원가입 하러가기</div>
        </div>
    )
}

export default NoUser
