import React, { useEffect, useRef, useState } from 'react';
import Search from '../../assets/img/ic_search.svg';
import Toggle from '../../assets/img/ic_arrow_down.svg';
import BankModal from './BankModal';

const Bank = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState('Easy');
    const wrapRef = useRef(null);

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

    return (
        <div className='Bank_wrap'>
            <aside>
                <div className="category">카테고리</div>
                <div className="algorithms">
                    전체<br />수학<br />구현<br />다이나믹 프로그래밍
                </div>
            </aside>
            <main>
                <div className="main_header">
                    <div className="title">문제 은행</div>
                    <div className="search_bar">
                        <input className='search' placeholder='검색어를 입력하세요' />
                        <img src={Search} alt="Search" />
                    </div>
                </div>
                <div className="main_body">
                    <div className="level_toggle_wrap">
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
                    <div className="bank">
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
                                {/* TODO: 백엔드에서 문제 목록 받아오기 */}
                                문제 리스트를 최대 10개까지 보여줍니다.
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="main_footer">
                    {/* 페이지네이션 */}
                    <div className="pagination">
                        1 2 3 4 5
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Bank
