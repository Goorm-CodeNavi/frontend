import React, { useEffect, useMemo, useState } from 'react';
import Hide from '../../../assets/img/ic_hide.svg';
import Seek from '../../../assets/img/ic_seek.svg';
import { useUser } from '../../../contexts/UserContext';
import { checkId } from '../../../api/userApi';

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

    // 중복확인 상태
    const [checking, setChecking] = useState(false);
    const [checkMsg, setCheckMsg] = useState("");
    const [checkStatus, setCheckStatus] = useState("idle");

    useEffect(() => {
        setUsername(user?.username || "");
        setEmail(user?.email || "");
        setNotionEmail(user?.email || "");
        // 유저가 바뀌면 메시지 초기화
        setCheckMsg("");
        setCheckStatus("idle");
    }, [user]);

    // 사용자가 username을 다시 수정하면 결과 초기화
    useEffect(() => {
        setCheckMsg("");
        setCheckStatus("idle");
    }, [username]);

    // 비밀번호 일치 여부
    const isMismatch = confirmPassword.length > 0 && password !== confirmPassword;

    // 비밀번호 길이 부족 여부
    const isTooShort = password.length > 0 && password.length < 8;

    const canCheck = useMemo(() => {
        const curr = (username || "").trim();
        const original = (user?.username || "").trim();
        return curr.length > 0 && curr !== original && !checking;
    }, [username, user?.username, checking]);

    const handleCheckId = async () => {
        const id = (username || "").trim();

        // 버튼이 비활성화 조건이면 그냥 종료
        if (!canCheck) return;

        try {
            setChecking(true);
            setCheckMsg("");
            setCheckStatus("idle");

            const { status, data } = await checkId(id);

            if (status === 200) {
                setCheckMsg(data?.result || "사용 가능한 아이디입니다.");
                setCheckStatus("ok");
            } else if (status === 409) {
                setCheckMsg(data?.message || "이미 존재하는 아이디입니다.");
                setCheckStatus("conflict");
            } else if (status === 400) {
                setCheckMsg(data?.result || "잘못된 요청입니다. 아이디를 다시 확인해주세요.");
                setCheckStatus("error");
            } else {
                setCheckMsg("예상치 못한 오류가 발생했어요.");
                setCheckStatus("error");
            }
        } catch (e) {
            setCheckMsg("네트워크 오류가 발생했어요. 잠시 후 다시 시도해주세요.");
            setCheckStatus("error");
        } finally {
            setChecking(false);
        }
    };

    return (
        <div className='EditInfo_wrap'>
            <div className="main_header">내 정보 수정</div>
            <div className="main_body">
                <div className="edit_id">
                    <div className="title">아이디</div>
                    <div className="id">
                        <input type="text" className='id_input' value={username} onChange={(e) => setUsername(e.target.value)} />
                        <div
                            className={`dupl_btn ${canCheck ? "" : "disabled"}`}
                            onClick={checking ? undefined : handleCheckId}
                            aria-disabled={!canCheck}
                        >
                            {checking ? "확인 중..." : "중복 확인"}
                        </div>
                    </div>
                    {checkStatus !== "idle" && (
                        <div
                            className={
                                checkStatus === "ok"
                                    ? "success"
                                    : "warning"
                            }
                            style={{ marginLeft: 5, marginTop: 10 }}
                        >
                            {checkMsg}
                        </div>
                    )}
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
                    {/* 비밀번호 경고 문구 */}
                    {(isTooShort || isMismatch) && (
                        <div className="warning">
                            {isTooShort
                                ? "8자리 이상의 비밀번호로 설정해주세요."
                                : "비밀번호가 일치하지 않습니다."}
                        </div>
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
