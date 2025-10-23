import React, { useEffect, useMemo, useState } from "react";
import Hide from "../../../assets/img/ic_hide.svg";
import Seek from "../../../assets/img/ic_seek.svg";
import { useUser } from "../../../contexts/UserContext";
import { checkId, updateUserInfo } from "../../../api/userApi";

const EditInfo = () => {
  const { user, refresh } = useUser(); // ✅ refetchUser → refresh 로 수정

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [notionEmail, setNotionEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPwCheck, setShowPwCheck] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkMsg, setCheckMsg] = useState("");
  const [checkStatus, setCheckStatus] = useState("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // 유저 정보가 바뀌면 초기화
  useEffect(() => {
    setUsername(user?.username || "");
    setEmail(user?.email || "");
    setNotionEmail(user?.email || "");
    setCheckMsg("");
    setCheckStatus("idle");
  }, [user]);

  // 아이디 변경 시 중복확인 상태 초기화
  useEffect(() => {
    if (username !== user?.username) {
      setCheckMsg("");
      setCheckStatus("idle");
    }
  }, [username, user?.username]);

  const isMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const canCheck = useMemo(() => {
    const curr = (username || "").trim();
    const original = (user?.username || "").trim();
    return curr.length > 0 && curr !== original && !checking;
  }, [username, user?.username, checking]);

  const idChanged = (username || "").trim() !== (user?.username || "").trim();

  const canSubmit = useMemo(() => {
    if (isSubmitting) return false;
    if (idChanged && checkStatus !== "ok") return false;
    if (password.length > 0 && isMismatch) return false;
    return true;
  }, [isSubmitting, idChanged, checkStatus, password, isMismatch]);

  // 아이디 중복 확인
  const handleCheckId = async () => {
    const id = (username || "").trim();
    if (!canCheck) return;

    try {
      setChecking(true);
      setCheckMsg("");
      setSubmitMessage("");
      setCheckStatus("idle");

      const { status, data } = await checkId(id);

      if (status === 200) {
        setCheckMsg(data?.result || "사용 가능한 아이디입니다.");
        setCheckStatus("ok");
      } else if (status === 409) {
        setCheckMsg(data?.message || "이미 존재하는 아이디입니다.");
        setCheckStatus("conflict");
      } else {
        setCheckMsg(data?.message || "사용할 수 없는 아이디입니다.");
        setCheckStatus("error");
      }
    } catch {
      setCheckMsg("네트워크 오류가 발생했어요. 잠시 후 다시 시도해주세요.");
      setCheckStatus("error");
    } finally {
      setChecking(false);
    }
  };

  // 내 정보 수정
  const handleUpdateInfo = async () => {
    if (!canSubmit) {
      if (idChanged && checkStatus !== "ok") {
        setSubmitMessage("아이디 중복 확인을 통과해야 합니다.");
      } else if (password.length > 0 && isMismatch) {
        setSubmitMessage("비밀번호가 일치하지 않습니다.");
      }
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitMessage("");

      const updateData = {};

      // ✅ 항상 username 포함
      updateData.username = username?.trim() || user?.username || "";

      // ✅ 이메일 (비어있으면 기존 유지)
      if (email && email.trim().length > 0) {
        updateData.email = email.trim();
      } else {
        updateData.email = user?.email || "";
      }

      // ✅ 비밀번호 (있을 때만)
      if (password.length > 0 && !isMismatch) updateData.password = password;

      // 변경사항 없으면 중단
      if (
        updateData.username === user?.username &&
        updateData.email === user?.email &&
        !password
      ) {
        setSubmitMessage("변경된 정보가 없습니다.");
        setIsSubmitting(false);
        return;
      }

      // API 요청
      const { status, data } = await updateUserInfo(updateData);
      console.log("✅ updateUserInfo response:", status, data);

      if (status === 200) {
        setSubmitMessage("정보가 성공적으로 수정되었습니다.");
        await refresh(); // ✅ refetchUser → refresh 로 수정
        setPassword("");
        setConfirmPassword("");
      } else {
        setSubmitMessage(data?.message || "정보 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("update error:", error);
      setSubmitMessage("요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="EditInfo_wrap">
      <div className="main_header">내 정보 수정</div>
      <div className="main_body">
        {/* 아이디 */}
        <div className="edit_id">
          <div className="title">아이디</div>
          <div className="id">
            <input
              type="text"
              className="id_input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
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
              className={checkStatus === "ok" ? "success" : "warning"}
              style={{ marginLeft: 5, marginTop: 10 }}
            >
              {checkMsg}
            </div>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="edit_pw">
          <div className="title">비밀번호</div>
          <div className="new_pw">
            <div className="pw_input">
              <input
                type={showPw ? "text" : "password"}
                placeholder="새로운 비밀번호를 입력해 주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <img
              src={showPw ? Seek : Hide}
              onClick={() => setShowPw(!showPw)}
              alt="pw toggle"
            />
          </div>
          <div className="check_new_pw">
            <div className="pw_input">
              <input
                type={showPwCheck ? "text" : "password"}
                placeholder="비밀번호를 다시 입력해 주세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <img
              src={showPwCheck ? Seek : Hide}
              onClick={() => setShowPwCheck(!showPwCheck)}
              alt="pw toggle"
            />
          </div>
          {isMismatch && (
            <div className="warning">비밀번호가 일치하지 않습니다.</div>
          )}
        </div>

        {/* 이메일 */}
        <div className="edit_email">
          <div className="title">이메일</div>
          <div className="email_input">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* 노션 연동 */}
        <div className="link_notion">
          <div className="title">노션 연동하기</div>
          <div className="link_email">
            <input
              type="text"
              value={notionEmail}
              onChange={(e) => setNotionEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="divider" />

        {/* 결과 메시지 */}
        {submitMessage && (
          <div
            className={submitMessage.includes("성공") ? "success" : "warning"}
            style={{
              marginTop: 10,
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            {submitMessage}
          </div>
        )}

        <div
          className={`finish_btn ${canSubmit ? "" : "disabled"}`}
          onClick={isSubmitting ? undefined : handleUpdateInfo}
        >
          {isSubmitting ? "수정 중..." : "내 정보 수정하기"}
        </div>
      </div>
    </div>
  );
};

export default EditInfo;
