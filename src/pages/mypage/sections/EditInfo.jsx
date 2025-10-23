import React, { useEffect, useState } from 'react';
import Hide from '../../../assets/img/ic_hide.svg';
import Seek from '../../../assets/img/ic_seek.svg';
import { useUser } from '../../../contexts/UserContext';

const EditInfo = () => {
    const { user } = useUser();

    const [username, setUsername] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");
    const [notionEmail, setNotionEmail] = useState(user?.email || "");

    // 비밀번호 가시성 상태
    const [showPw, setShowPw] = useState(false);
    const [showPwCheck, setShowPwCheck] = useState(false);

    // 입력값 상태
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        setUsername(user?.username || "");
        setEmail(user?.email || "");
        setNotionEmail(user?.email || "");
    }, [user]);

    // 비밀번호 일치 여부
    const isMismatch = confirmPassword.length > 0 && password !== confirmPassword;

    //     const [id, setId] = useState('old@email.com')
    // <input value={id} onChange={(e) => setIc(e.target.value)} />

    return (
        <div className='EditInfo_wrap'>
            <div className="main_header">내 정보 수정</div>
            <div className="main_body">
                <div className="edit_id">
                    <div className="title">아이디</div>
                    <div className="id">
                        <input type="text" className='id_input' value={username} onChange={(e) => setUsername(e.target.value)} />
                        <div className="dupl_btn">중복 확인</div>
                    </div>
                    <div className="warning">이미 사용 중인 아이디입니다.</div>
                </div>
                <div className="edit_pw">
                    <div className="title">비밀번호</div>
                    <div className="new_pw">
                        <div className="pw_input">
                            <input
                                type={showPw ? "text" : "password"}
                                placeholder='새로운 비밀번호를 입력해 주세요'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <img src={showPw ? Seek : Hide} onClick={() => setShowPw(v => !v)} alt="Hide" />
                    </div>
                    <div className="check_new_pw">
                        <div className="pw_input">
                            <input
                                type={showPwCheck ? "text" : "password"}
                                placeholder='비밀번호를 다시 입력해 주세요'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        <img src={showPwCheck ? Seek : Hide} onClick={() => setShowPwCheck(v => !v)} alt="Hide" />
                    </div>
                    {/* 비밀번호 불일치 시만 표시 */}
                    {isMismatch && (
                        <div className="warning">비밀번호가 일치하지 않습니다.</div>
                    )}
                </div>
                <div className="edit_email">
                    <div className="title">이메일</div>
                    <div className="email_input">
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                <div className="marketing">
                    <div className="title">마케팅 활용 및 수신 동의</div>
                    <div className="agrees">
                        <div className="agree">
                            <input type="checkbox" className="agree_email" />
                            <div className="text">이메일</div>
                        </div>
                        <div className="agree">
                            <input type="checkbox" className="agree_email" />
                            <div className="text">SMS</div>
                        </div>
                    </div>
                </div>
                <div className="link_notion">
                    <div className="title">노션 연동하기</div>
                    <div className="link_email">
                        <input type="text" value={notionEmail} onChange={(e) => setNotionEmail(e.target.value)} />
                    </div>
                </div>
                <div className="divider"></div>
                <div className="finish_btn">내 정보 수정하기</div>
            </div>
        </div>
    )
}

export default EditInfo
