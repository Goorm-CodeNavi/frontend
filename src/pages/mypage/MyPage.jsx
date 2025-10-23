import React, { useMemo, useState } from 'react';
import Profile from '../../assets/img/img_profile.svg';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from "../../contexts/UserContext";

const dPlus = (iso) => {
    if (!iso) return 0;
    const created = new Date(iso).getTime();
    const today = Date.now();
    return Math.max(0, Math.floor((today - created) / (1000 * 60 * 60 * 24)));
};

const MyPage = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const isActive = (sub) => pathname === `/mypage/${sub}`;

    const { user, loading } = useUser();
    const username = user?.username ?? "";
    const togetherDate = dPlus(user?.created_at);

    if (loading) return <div className="Mypage_wrap"><main>로딩 중...</main></div>;


    return (
        <div className='Mypage_wrap'>
            <aside>
                <img src={Profile} alt="Profile" />
                <div className="user_id">{username || "-"}</div>
                <div className="together">함께 한 지 D+{togetherDate + 1}</div>
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
                        className={`menu_item link_notion ${isActive("gpt") ? "active" : ""}`}
                        onClick={() => navigate("/mypage/gpt")}
                    >
                        GPT에게 도움받기
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
