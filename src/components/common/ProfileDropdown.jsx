import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext';

const ProfileDropdown = () => {
    const navigate = useNavigate();
  const { logout } = useAuth();

    // 로그아웃 함수
    const handleLogout = () => {
        logout();
        navigate("/login");  // 로그인 페이지로 이동
    };

    return (
        <div className='Profiledropdown_wrap'>
            <div className="dropdown_container">
                <button className='mypage' onClick={() => navigate("/mypage")}>마이페이지</button>
                <div className="logout">
                    <button onClick={handleLogout}>로그아웃</button>
                </div>
            </div>
        </div>
    )
}

export default ProfileDropdown
