import React, { useState } from 'react';
import MainLogo from '../../assets/img/ic_mainlogo.svg';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const navigate = useNavigate();

    // 더미데이터
    const userName = "aster03";
    const together = 57;
    const problemNumber = 1003;
    const problemTitle = "피보나치 함수";

    return (
        <div className='Home_wrap'>
            <div className="body">
                {isLoggedIn ? (
                    <div className="after">
                        <div className="title">
                            <h2>AI와 함께 성장하는 나만의 코딩 학습 파트너, </h2>
                            <img src={MainLogo} alt="MainLogo" />
                        </div>
                        <div className="contents">
                            <div className="first_content">
                                <div className="first_subtitle">안녕하세요, <div className="name">{userName}</div>님!</div>
                                <div className="content_wrap">
                                    <div className="together_day">
                                        <div className="logo">CODENAVI</div>
                                        <div className="text">와 함께 한 지</div>
                                        <div className="date">{together}</div>
                                        <div className="text">일이 되었군요!</div>
                                    </div>
                                    <div className="goto_notion">
                                        <div className="wanna_see">나의 학습 과정을 보고 싶다면</div>
                                        <div className="notion_hyper">Notion으로 바로 가기</div>
                                    </div>
                                </div>
                            </div>
                            <div className="second_content">
                                <div className="second_subtitle">
                                    <div className="logo">CODENAVI</div>
                                    <div className="subtitle">에서 추천하는 오늘의 문제를 풀어보세요</div>
                                </div>
                                <div className="today">
                                    <div className="problem_title">
                                        <div className="problem_info">
                                            <div className="number">{problemNumber}</div>
                                            <div className="name">{problemTitle}</div>
                                        </div>
                                        <div className="goto_solve">문제 풀기</div>
                                    </div>
                                    <div className="problem_content">
                                        {/* TODO: 문제 받아오기 */}
                                        문제에 대한 내용을 띄워주는 공간입니다.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="before">
                        <div className="title">
                            <h2>AI와 함께 성장하는 나만의 코딩 학습 파트너, </h2>
                            <img src={MainLogo} alt="MainLogo" />
                        </div>
                        <div className="contents">
                            <div className="first_content">
                                <div className="first_subtitle">
                                    <div className="logo">CODENAVI</div>
                                    <div className="subtitle">에서는 이런 걸 할 수 있어요</div>
                                </div>
                                <div className="steps">
                                    <div className="steps_top">
                                        <div className="first_step">
                                            <div className="summary">개인 맞춤형 문제 추천 제공</div>
                                            <p>난이도, 유형, 태그 기반 필터링과 맞춤형 문제 추천을 제공합니다</p>
                                        </div>
                                        <div className="second_step">
                                            <div className="summary">4단계 사고 과정 캔버스</div>
                                            <p>문제 요약 → 전략 수립 → 복잡도 분석 → 의사 코드 작성으로 사고력을 체계적으로 확장해보세요</p>
                                        </div>
                                    </div>
                                    <div className="steps_bottom">
                                        <div className="third_step">
                                            <div className="summary">AI 피드백 제공</div>
                                            <p>코드와 사고 과정을 분석하는 AI가 제공하는 즉각적인 피드백을 받아보세요</p>
                                        </div>
                                        <div className="fourth_step">
                                            <div className="summary">Notion 자동 동기화</div>
                                            <p>학습 과정이 실시간으로 Notion에 기록되어 포트폴리오로 바로 활용할 수 있습니다</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="second_content">
                                <div className="second_subtitle">
                                    <div className="logo">CODENAVI</div>
                                    <div className="subtitle">에서 추천하는 오늘의 문제를 풀어보세요</div>
                                </div>
                                <div className="today">
                                    <div className="login" onClick={() => navigate("/login")}>로그인</div>
                                    <div className="text">후</div>
                                    <div className="todaysolve">오늘의 문제</div>
                                    <div className="text">를 추천받아 보세요!</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home
