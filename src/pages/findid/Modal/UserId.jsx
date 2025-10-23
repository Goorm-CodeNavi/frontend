import React from 'react';
// [수정] useNavigate 대신 props로 받은 onClose를 사용합니다.
// import { useNavigate } from 'react-router-dom';

// [수정] 부모 컴포넌트(FindId.js)로부터 userId와 onClose를 props로 받습니다.
const UserId = ({ userId, onClose }) => {
    // const navigate = useNavigate(); // [삭제]
    
    // [삭제] 더미데이터 삭제
    // const userId = "qwerty1234"; 
    
    return (
        <div className='UserId_wrap'>
            <div className="text">회원님의 아이디는</div>
            {/* [수정] props로 받은 userId를 표시합니다. */}
            <div className="user_id">{userId}</div>
            <div className="text">입니다.</div>
            {/* [수정] navigate("/login") 대신 onClose 함수를 호출합니다. */}
            <div className="close_btn" onClick={onClose}>닫기</div>
        </div>
    )
}

export default UserId

