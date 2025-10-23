import React, { useEffect, useRef, useState } from 'react';
import Search from '../../../assets/img/ic_search.svg';
import PrevIcon from '../../../assets/img/ic_arrow_left.svg';
import NextIcon from '../../../assets/img/ic_arrow_right.svg';
import { getMySubmissions } from '../../../api/userApi';
import { useNavigate } from 'react-router-dom';

const MAX_ROWS = 10;

const StudyRecord = () => {
    const navigate = useNavigate();

    const goDetail = (submission) => {
        navigate(`/mypage/${submission.solutionId}`, {
            state: { submission }, // 목록에서 가진 데이터 그대로 넘김(옵션)
        });
    };

    // 탭(로컬 상태)
    const [selectedTab, setSelectedTab] = useState("제출");
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);

    // 서버 데이터 상태
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [content, setContent] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    // 행 높이 측정 (filler-row 용)
    const rowRef = useRef(null);
    const [rowBlockHeight, setRowBlockHeight] = useState(0);

    // 탭/검색 바뀌면 1페이지로
    useEffect(() => {
        setPage(1);
    }, [selectedTab, searchText]);

    // // 더미 데이터
    // const problems = [
    //     { id: 1003, title: "피보나치 함수", category: "다이나믹 프로그래밍", info: "성공" },
    //     { id: 1004, title: "피보나치 함수 2", category: "다이나믹 프로그래밍", info: "실패" },
    //     { id: 1005, title: "피보나치 함수 3", category: "다이나믹 프로그래밍", info: "성공" },
    //     { id: 2001, title: "수 정렬하기", category: "구현", info: "실패" },
    //     { id: 2002, title: "소수 판별", category: "수학", info: "성공" },
    //     { id: 2003, title: "에라토스테네스", category: "수학", info: "실패" },
    //     { id: 3001, title: "투 포인터 연습", category: "투 포인터", info: "성공" },
    //     { id: 3002, title: "스택 기본", category: "스택", info: "실패" },
    //     { id: 3003, title: "해시셋 응용", category: "해시테이블", info: "성공" },
    //     { id: 3004, title: "큐 시뮬", category: "자료구조", info: "실패" },
    //     { id: 4001, title: "LIS 기본", category: "다이나믹 프로그래밍", info: "성공" },
    //     { id: 4002, title: "DP 최적화", category: "다이나믹 프로그래밍", info: "실패" },
    // ];

    // 서버 호출
    useEffect(() => {
        const fetchPage = async () => {
            try {
                setLoading(true);
                setError("");
                const res = await getMySubmissions({ page: page - 1, size: MAX_ROWS }); // 서버 0-based
                setContent(res.content || []);
                setTotalPages(res.totalPages || 1);
            } catch (e) {
                setError(e?.message || "제출 기록을 불러오지 못했습니다.");
                setContent([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, [page]);

    // 현재 페이지 데이터에서 프론트 필터링
    const filtered = (content || []).filter((item) => {
        const matchSearch =
            searchText.trim() === ""
                ? true
                : (item.problemTitle || "").includes(searchText.trim()) ||
                (item.problemNumber || "").includes(searchText.trim());
        const matchTab =
            selectedTab === "제출"
                ? true
                : selectedTab === "맞은 문제"
                    ? item.status === "정답"
                    : item.status !== "정답"; // 틀린 문제
        return matchSearch && matchTab;
    });

    // 첫 행 높이 측정 (gap은 CSS border-spacing만 사용)
    useEffect(() => {
        const id = requestAnimationFrame(() => {
            if (rowRef.current) {
                setRowBlockHeight(rowRef.current.getBoundingClientRect().height || 50);
            } else {
                setRowBlockHeight(50);
            }
        });
        return () => cancelAnimationFrame(id);
    }, [filtered.length]);

    const missingCount = Math.max(0, MAX_ROWS - filtered.length);
    const pages = Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1);

    return (
        <div className='StudyRecord_wrap'>
            <div className="main_header">
                <div className="title">학습 데이터 및 기록</div>
                <div className="search_bar">
                    <input
                        className='search'
                        placeholder='검색어를 입력하세요'
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <img src={Search} alt="Search" />
                </div>
            </div>
            <div className="main_body">
                <div className="record_tabs">
                    {["제출", "맞은 문제", "틀린 문제"].map((tab) => (
                        <div
                            key={tab}
                            className={`record_tab ${selectedTab === tab ? "active" : ""}`}
                            onClick={() => setSelectedTab(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>
                <div className={`record_table ${filtered.length ? "has_table" : "empty"}`}>
                    {filtered.length === 0 ? (
                        <div className="no_results">찾으시는 문제가 없어요</div>
                    ) : (
                        <table className="problem_lists">
                            <thead>
                                <tr>
                                    <th>문제 번호</th>
                                    <th>문제 제목</th>
                                    <th>언어</th>
                                    <th>정보</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="thead_spacer" aria-hidden="true">
                                    <td colSpan={4} style={{ height: "5px" }} />
                                </tr>

                                {filtered.map((s, idx) => (
                                    <tr key={s.solutionId} ref={idx === 0 ? rowRef : null}>
                                        <td>{s.problemNumber}</td>
                                        <td
                                            className="title_link"
                                            onClick={() => goDetail(s)}
                                        >{s.problemTitle}</td>
                                        <td><span className="category_tag">#{s.language}</span></td>
                                        <td>
                                            <span className={`status ${s.status === '오답' ? 'fail' : ''}`}>
                                                {s.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}

                                {Array.from({ length: missingCount }).map((_, i) => (
                                    <tr key={`filler-${page}-${i}`} className="filler-row" style={{ height: `${rowBlockHeight}px` }}>
                                        <td colSpan={4} />
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <div className="main_footer">
                {/* 페이지네이션 */}
                <div className="pagination">
                    <img
                        className="nav_btn"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        src={PrevIcon}
                        alt="PrevIcon"
                    />
                    {pages.map((num) => (
                        <div
                            key={num}
                            className={`page-btn ${num === page ? "active" : ""}`}
                            onClick={() => setPage(num)}
                        >
                            {num}
                        </div>
                    ))}
                    <img
                        className="nav_btn"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        src={NextIcon}
                        alt="NextIcon"
                    />
                </div>
            </div>
        </div>
    )
}

export default StudyRecord
