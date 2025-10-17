import React, { useMemo, useState } from 'react';
import Profile from '../../assets/img/img_profile.svg';
import StudyRecord from './sections/StudyRecord';
import EditInfo from './sections/EditInfo';
import LinkNotion from './sections/LinkNotion';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const MyPage = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const isActive = (sub) => pathname === `/mypage/${sub}`;

    // 더미데이터
    const userId = "aster03";
    const togetherDate = 56;
    
    return (
        <div className='Mypage_wrap'>
            <aside>
                <img src={Profile} alt="Profile" />
                <div className="user_id">{userId}</div>
                <div className="together">함께 한 지 D+{togetherDate}</div>
                <div className="divider"></div>
                <div className="mypage_menu">
                    <div
                        className={`menu_item study_record ${isActive("study") ? "active" : ""}`}
                        onClick={() => navigate("/mypage/study")}
                    >
                        학습 데이터 및 기록
                    </div>
                    <div
                        className={`menu_item edit_info ${isActive("edit") ? "active" : ""}`}
                        onClick={() => navigate("/mypage/edit")}
                    >
                        내 정보 수정
                    </div>
                    <div
                        className={`menu_item link_notion ${isActive("notion") ? "active" : ""}`}
                        onClick={() => navigate("/mypage/notion")}
                    >
                        Notion 연동하기
                    </div>
                </div>
                <div className="logout">로그아웃</div>
            </aside>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default MyPage
