import React, { useEffect, useRef, useState } from 'react';
import Search from '../../assets/img/ic_search.svg';
import Toggle from '../../assets/img/ic_arrow_down.svg';
import PrevIcon from '../../assets/img/ic_arrow_left.svg';
import NextIcon from '../../assets/img/ic_arrow_right.svg';
import BankModal from './BankModal';
import { problemList } from "../../api/problemApi";
import { useNavigate } from 'react-router-dom';

const MAX_ROWS = 10;

const Bank = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState('Easy');
    const [selectedAlgo, setSelectedAlgo] = useState('전체');
    const [searchText, setSearchText] = useState('');
    const wrapRef = useRef(null);
    const rowRef = useRef(null);
    const navigate = useNavigate();
    const [rowBlockHeight, setRowBlockHeight] = useState(0);

    const [problems, setProblems] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(50); // API에서 한 번에 충분히 불러오기

    // 문제 목록 호출
    useEffect(() => {
        const fetchData = async () => {
        try {
            const result = await problemList(page - 1, size); // 한 번에 size 만큼 가져오기
            console.log("데이터:", result);
            setProblems(result.result.content || []);
        } catch (error) {
            console.error("문제 목록 불러오기 실패:", error);
        }
        };
        fetchData();
    }, [page, size]);

    // 필터/검색 변경 시 페이지 초기화
    useEffect(() => {
        setPage(1);
    }, [selectedAlgo, searchText]);

    const handleToggle = () => setIsOpen(v => !v);
    const handleSelectLevel = (levelLabel) => {
        setSelectedLevel(levelLabel.split(' ')[0]);
        setIsOpen(false);
    };

    // 모달 외부 클릭 시 닫기
    useEffect(() => {
        const onClickOutside = (e) => {
        if (wrapRef.current && !wrapRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    const algoTags = [
        '전체', '구현', '수학', '다이나믹 프로그래밍',
        '해시테이블', '투 포인터', '자료구조', '스택'
    ];

    // 필터링
    const filteredProblems = Array.isArray(problems)
        ? problems.filter(p => {
            const category = p.category?.trim() || '미지정';
            const title = p.title?.trim() || '제목 없음';

            const matchAlgo =
                selectedAlgo === '전체' ? true :
                category === selectedAlgo || (category === '미지정' && selectedAlgo === '미지정');

            const matchSearch =
                searchText.trim() === '' ? true :
                title.toLowerCase().includes(searchText.trim().toLowerCase());

            return matchAlgo && matchSearch;
        })
    : [];

    //const filteredProblems = problems;


    // 페이지네이션
    const totalPages = Math.max(1, Math.ceil(filteredProblems.length / MAX_ROWS));
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const startIdx = (page - 1) * MAX_ROWS;
    const pageItems = filteredProblems.slice(startIdx, startIdx + MAX_ROWS);
    const missingCount = Math.max(0, MAX_ROWS - pageItems.length);

    // 첫 행 높이 계산
    useEffect(() => {
        const id = requestAnimationFrame(() => {
        if (rowRef.current) setRowBlockHeight(rowRef.current.getBoundingClientRect().height);
        else setRowBlockHeight(50);
        });
        return () => cancelAnimationFrame(id);
    }, [pageItems.length, page]);

    useEffect(() => {
        console.log("problems:", problems);
        console.log("filteredProblems:", filteredProblems);
        console.log("pageItems:", pageItems);
    }, [problems, filteredProblems, pageItems]);

    return (
        <div className='Bank_wrap'>
        <aside>
            <div className="category">카테고리</div>
            <div className="algorithms">
            {algoTags.map(tag => (
                <div
                key={tag}
                className={`algo_item ${selectedAlgo === tag ? 'selected' : ''}`}
                onClick={() => setSelectedAlgo(tag)}
                >
                {tag}
                </div>
            ))}
            </div>
        </aside>

        <main>
            <div className="main_header">
            <div className="title">문제 은행</div>
            <div className="search_bar">
                <input
                className='search'
                placeholder='검색어를 입력하세요'
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                />
                <img src={Search} alt="Search" />
            </div>
            </div>

            <div className="main_body">
            <div className="level_toggle_wrap" ref={wrapRef}>
                <div className="level_toggle" onClick={handleToggle}>
                <div className="level">{selectedLevel}</div>
                <img src={Toggle} alt="Toggle" />
                </div>
                {isOpen && (
                <div className="level_dropdown">
                    <BankModal onSelect={handleSelectLevel} />
                </div>
                )}
            </div>

            <div className={`bank ${filteredProblems.length ? 'has_table' : 'empty'}`}>
                {filteredProblems.length === 0 ? (
                <div className="no_results">찾으시는 문제가 없어요</div>
                ) : (
                <table className="problem_lists">
                    <thead>
                    <tr>
                        <th>문제 번호</th>
                        <th>문제 제목</th>
                        <th>카테고리</th>
                        <th>정보</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="thead_spacer" aria-hidden="true">
                        <td colSpan={4} style={{ height: `5px` }} />
                    </tr>
                    {pageItems.map((p, idx) => (
                        <tr key={`${p.number}-${startIdx + idx}`} ref={idx === 0 ? rowRef : null}>
                        <td>{p.number}</td>
                        <td onClick={() => navigate(`/problems/${p.number}`)}>{p.title?.trim() || ""}</td>
                        <td><span className="category_tag">#{p.category?.trim() || ""}</span></td>
                        <td>{Array.isArray(p.tags) ? p.tags.join(", ") : ""}</td>
                        </tr>
                    ))}
                    {Array.from({ length: missingCount }).map((_, i) => (
                        <tr key={`filler-${startIdx + page}-${i}`} className='filler-row' style={{ height: `${rowBlockHeight}px` }}>
                        <td colSpan={4} />
                        </tr>
                    ))}
                    </tbody>
                </table>
                )}
            </div>
            </div>

            <div className="main_footer">
            <div className="pagination">
                <img
                className="nav_btn"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                src={PrevIcon}
                alt="PrevIcon"
                />
                {pages.map(num => (
                <div
                    key={num}
                    className={`page-btn ${num === page ? 'active' : ''}`}
                    onClick={() => setPage(num)}
                >
                    {num}
                </div>
                ))}
                <img
                className="nav_btn"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                src={NextIcon}
                alt="NextIcon"
                />
            </div>
            </div>
        </main>
        </div>
    );
};

export default Bank;
