import React from 'react'
import { useNavigate } from 'react-router-dom';

const UserId = () => {
    const navigate = useNavigate();

    // 더미데이터
    const userId = "qwerty1234";
    
    return (
        <div className='UserId_wrap'>
            <div className="text">회원님의 아이디는</div>
            <div className="user_id">{userId}</div>
            <div className="text">입니다.</div>
            <div className="close_btn" onClick={() => navigate("/login")}>닫기</div>
        </div>
    )
}

export default UserId
