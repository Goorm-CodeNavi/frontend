import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProfileDropdown = () => {
    const navigate = useNavigate();

    return (
        <div className='Profiledropdown_wrap'>
            <div className="dropdown_container">
                <button className='mypage' onClick={() => navigate("/mypage")}>마이페이지</button>
                <div className="logout">
                    <button>로그아웃</button>
                </div>
            </div>
        </div>
    )
}

export default ProfileDropdown
