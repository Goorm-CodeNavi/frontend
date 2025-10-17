import React, { useEffect, useRef, useState } from 'react';
import Search from '../../assets/img/ic_search.svg';
import Toggle from '../../assets/img/ic_arrow_down.svg';
import PrevIcon from '../../assets/img/ic_arrow_left.svg';
import NextIcon from '../../assets/img/ic_arrow_right.svg';
import BankModal from './BankModal';

const MAX_ROWS = 10;
const ROW_GAP_PX = 5;

const Bank = () => {
    const [isOpen, setIsOpen] = useState(false);  // 난이도 모달
    const [selectedLevel, setSelectedLevel] = useState('Easy');  // 난이도 선택
    const [selectedAlgo, setSelectedAlgo] = useState('전체');  // 알고리즘 선택
    const [searchText, setSearchText] = useState('');  // 검색창
    const wrapRef = useRef(null);
    const rowRef = useRef(null);
    const [rowBlockHeight, setRowBlockHeight] = useState(0);  // 테이블 크기
    const [page, setPage] = useState(1);  // 페이지네이션

    useEffect(() => {
        setPage(1); // 필터/검색 바뀌면 1페이지로
    }, [selectedAlgo, searchText]);

    const handleToggle = () => {
        setIsOpen(v => !v);
    }

    const handleSelectLevel = (levelLabel) => {
        const levelOnly = levelLabel.split(' ')[0];
        setSelectedLevel(levelOnly);
        setIsOpen(false);
    };

    // 바깥 클릭 시 닫기
    useEffect(() => {
        const onClickOutside = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    // 알고리즘 태그 목록
    const algoTags = [  // TODO: 추후 문제 확정되면 다시 확인하기
        '전체',
        '구현',
        '수학',
        '다이나믹 프로그래밍',
        '해시테이블',
        '투 포인터',
        '자료구조',
        '스택',
    ];

    // 더미 문제 데이터
    const problems = [
        { id: 1003, title: '피보나치 함수', category: '다이나믹 프로그래밍', info: '성공' },
        { id: 1004, title: '피보나치 함수', category: '다이나믹 프로그래밍', info: '성공' },
        { id: 1005, title: '피보나치 함수', category: '다이나믹 프로그래밍', info: '성공' },
        { id: 1003, title: '피보나치 함수', category: '다이나믹 프로그래밍', info: '성공' },
        { id: 1004, title: '피보나치 함수', category: '다이나믹 프로그래밍', info: '성공' },
        { id: 1005, title: '피보나치 함수', category: '다이나믹 프로그래밍', info: '성공' },
        { id: 1003, title: '피보나치 함수', category: '다이나믹 프로그래밍', info: '성공' },
        { id: 1004, title: '피보나치 함수', category: '다이나믹 프로그래밍', info: '성공' },
        { id: 1005, title: '피보나치 함수', category: '다이나믹 프로그래밍', info: '성공' },
        { id: 1003, title: '피보나치 함수', category: '다이나믹 프로그래밍', info: '성공' },
        { id: 1004, title: '피보나치 함수', category: '다이나믹 프로그래밍', info: '성공' },
        { id: 1005, title: '피보나치 함수', category: '다이나믹 프로그래밍', info: '성공' },
    ];

    // 선택된 카테고리/검색어 기준 필터
    const filteredProblems = problems.filter(p => {
        const matchAlgo = selectedAlgo === '전체' ? true : p.category === selectedAlgo;
        const matchSearch = searchText.trim() === '' ? true : p.title?.includes(searchText.trim());
        return matchAlgo && matchSearch;
    });

    const totalPages = Math.max(1, Math.ceil(filteredProblems.length / MAX_ROWS));
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    // 현재 페이지 아이템만 잘라서 표시
    const startIdx = (page - 1) * MAX_ROWS;
    const endIdx = startIdx + MAX_ROWS;
    const pageItems = filteredProblems.slice(startIdx, endIdx);

    // 첫 행 높이 측정 (행 높이 + gap)
    useEffect(() => {
        // 렌더 후 살짝 늦춰서 측정(글꼴/이미지 로딩 고려)
        const id = requestAnimationFrame(() => {
            if (rowRef.current) {
                const h = rowRef.current.getBoundingClientRect().height;
                setRowBlockHeight(h);
            } else {
                // 표시할 행이 하나도 없을 때의 안전망 (대충 50px + gap 정도)
                setRowBlockHeight(50);
            }
        });
        return () => cancelAnimationFrame(id);
    }, [pageItems.length, page]);

    const missingCount = Math.max(0, MAX_ROWS - pageItems.length);
    const fillerHeight = missingCount * rowBlockHeight;

    return (
        <div className='Bank_wrap'>
            <aside>
                <div className="category">카테고리</div>
                <div className="algorithms">
                    {algoTags.map((tag) => (
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
                            onChange={(e) => setSearchText(e.target.value)}
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

                        {/* 모달 */}
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
                            <>
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
                                            <tr key={`${p.id}-${startIdx + idx}`} ref={idx === 0 ? rowRef : null}>
                                                <td>{p.id}</td>
                                                <td>{p.title}</td>
                                                <td>
                                                    <span className="category_tag">#{p.category}</span>
                                                </td>
                                                <td>{p.info}</td>
                                            </tr>
                                        ))}

                                        {Array.from({ length: missingCount }).map((_, i) => (
                                            <tr key={`filler-${startIdx + page}-${i}`}
                                                className='filler-row'
                                                style={{ height: `${rowBlockHeight}px` }}
                                            >
                                                <td colSpan={4} />
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>
                </div>
                <div className="main_footer">
                    {/* 페이지네이션 */}
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
    )
}

export default Bank
