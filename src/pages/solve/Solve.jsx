import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import ChatBot from '../../components/chatbot/Chatbot';

const Solve = () => {
    const [time, setTime] = useState(0);
    const [timerId, setTimerId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => setTime((prev) => prev + 1), 1000);
        setTimerId(timer);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m
        .toString()
        .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const [showCanvas, setShowCanvas] = useState(false); // true면 코드 에디터 보임
    const [isEdited, setIsEdited] = useState(false); // 저장 버튼 누름 여부
    const [showRunModal, setShowRunModal] = useState(false); // 모달창 표시 여부
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [modalShownOnce, setModalShownOnce] = useState(false); // 모달 1회만 표시
    const [aiEnabled, setAiEnabled] = useState(false); // AI 해설 버튼 활성화 여부
    const [showAI, setShowAI] = useState(false); // false = 문제 영역, true = AI 해설 영역
    const [code, setCode] = useState("// JS 코드를 입력하고 실행 버튼을 눌러보세요\nconsole.log('Hello IDE!');");
    const [output, setOutput] = useState("");

    const [showAIComment, setShowAIComment] = useState(false);

    // 사고캔버스 → 코드 에디터로 이동
    const handleSaveOrEdit = () => {
        setShowCanvas(true);
        setIsEdited(true);
    };

    // 코드 실행
    const runCode = () => {
        try {
            let logs = [];
            const originalLog = console.log;
            console.log = (...args) => logs.push(args.join(" "));

            const result = eval(code);
            console.log = originalLog;

            setOutput(
                logs.join("\n") + (result !== undefined ? `\n결과: ${result}` : "")
            );

            // ✅ 처음 한 번만 모달 표시
            if (!modalShownOnce) {
                setShowRunModal(true);
                setModalShownOnce(true);
            }

            // ✅ 실행 후 AI 해설 버튼 활성화
            setAiEnabled(true);
            console.log("실행 완료 → AI 해설 보기 버튼 활성화됨");
            } catch (err) {
            setOutput("에러: " + err.message);
        }
    };

    // ✅ AI 해설 보기/문제 보기 전환
    const handleToggleAI = () => {
        if (setAiEnabled) {
            setShowAI((prev) => !prev);
            setShowAIComment((prev) => !prev);
        }
    };

    const handleSubmit = () => {
        //clearInterval(timerId);
        setShowSubmitModal(true);
    };

    return (
        <div className="problem-page">
        {/* 상단 헤더 */}
        <div className="top-panel">
            <div className="top-panel-left">
            <h1 className="problem-title">1003 피보나치 함수</h1>

            <div className="timer">⏱ {formatTime(time)}</div>

            {/* ✅ AI 해설 버튼 (초기 비활성화) */}
            <button
                className="AI-commentary-btn"
                disabled={!aiEnabled}
                onClick={handleToggleAI}
                style={{
                opacity: aiEnabled ? 1 : 0.5,
                cursor: aiEnabled ? "pointer" : "not-allowed",
                color: "white",
                }}
            >
                {showAI ? "문제 보기" : "AI 해설 보기"}
            </button>
            </div>

            <div className="top-panel-right">
            <div className="toggle-group">
                <span>사고캔버스</span>
                <label className="switch">
                <input
                    type="checkbox"
                    checked={showCanvas}
                    onChange={() => setShowCanvas((prev) => !prev)}
                />
                <span className="slider"></span>
                </label>
                <span>코드입력</span>
            </div>
            </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="main-content">
            <div className="left-sections">
                {/* 🔹 문제 영역 */}
                {!showAIComment && (
                    <>
                    <section className="problem-section">
                        <h2>문제</h2>
                        <div className="content-box">문제 내용이 들어갑니다.</div>
                    </section>

                    <section className="condition-section">
                        <h2>조건</h2>
                        <div className="content-box">조건 내용</div>
                    </section>

                    <section className="io-section">
                        <h2>입력</h2>
                        <div className="content-box">입력 설명</div>
                        <h2>출력</h2>
                        <div className="content-box">출력 설명</div>
                    </section>

                    <section className="example-section">
                        <h2>입출력 예시 1</h2>
                        <div className="content-box">예시 내용</div>
                        <h2>입출력 예시 2</h2>
                        <div className="content-box">예시 내용</div>
                    </section>
                    </>
                )}

            {/* ✅ AI 해설 표시 영역 */}
                {showAIComment && (
                    <section className="ai-comment-canvas">
                        <h2>AI 모범답안</h2>
                        <p>
                            AI가 생성한 모범 답안(접근 방식, 최적화 전략, 코드)를 볼수 있습니다. 이를 통해 어떤 부분이 개선 할 수 있을지 스스토 분석하고 AI로 부터 상세한 피드백을 받아보세요.
                        </p>
                        
                        <div className="canvas-item">
                        <h3>1. 문제 요약</h3>
                        <textarea readOnly value={`문제 요약`} />
                        </div>

                        <div className="canvas-item">
                        <h3>2. 해결 전략 및 접근법</h3>
                        <textarea readOnly value={`해결 전략 및 접근법`} />
                        </div>

                        <div className="canvas-item">
                        <h3>3. 시간/공간 복잡도 분석</h3>
                        <textarea readOnly value={`시간/공간 복잡도 분석`} />
                        </div>

                        <div className="canvas-item">
                        <h3>4. 의사 코드 (Pseudocode)</h3>
                        <textarea readOnly value={`의사코드`} />
                        </div>
                    </section>
                )}
            </div>

            <div className="right-panel">
            {showCanvas ? (
                <>
                <div className="editor-box">
                    <Editor
                    height="520px"
                    defaultLanguage="javascript"
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    theme="vs-dark"
                    />

                    <div className="output-box">
                    <pre>{output || "출력 결과가 여기에 표시됩니다."}</pre>
                    </div>

                    <div className="btn-container">
                    <button className="run-btn" onClick={runCode}>
                        실행
                    </button>
                    <button className="submit-btn" onClick={handleSubmit}>
                        제출
                    </button>
                    </div>
                </div>
                </>
            ) : (
                <>
                <h2>사고 과정 캔버스</h2>
                <div className="canvas-box">
                    <div className="canvas-item">
                    <h3>1. 문제 요약</h3>
                    <textarea placeholder="문제를 요약해 보세요." />
                    </div>

                    <div className="canvas-item">
                    <h3>2. 해결 전략 정리</h3>
                    <textarea placeholder="해결 전략을 정리하세요." />
                    </div>

                    <div className="canvas-item">
                    <h3>3. 시간/공간 복잡도 분석</h3>
                    <textarea placeholder="복잡도를 분석하세요." />
                    </div>

                    <div className="canvas-item">
                    <h3>4. 의사 코드 (Pseudocode)</h3>
                    <textarea placeholder="의사 코드를 작성하세요." />
                    </div>

                    <button
                    className="submit-btn"
                    onClick={handleSaveOrEdit}
                    >
                    {isEdited ? "수정" : "저장"}
                    </button>
                </div>
                </>
            )}
            <ChatBot />
            </div>
        </div>

        {/* ✅ 모달창 (처음 실행 시 1회 표시) */}
        {showRunModal && (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>AI 해설 기능 안내</h2>
                <p>
                    {`AI가 생성한 모범 답안(접근방식, 최적화 전략, 코드)를 볼 수 있습니다.\n이를 통해 어떤 부분을 개선할 수 있을지 스스로 분석하고\nAI로부터 상세한 비드백을 받을 수 있습니다.`}
                </p>

                <div className="modal-buttons">
                    {/* 닫기 버튼 */}
                    <button onClick={() => setShowRunModal(false)}>닫기</button>

                    {/* AI 해설 보기 버튼 */}
                    <button onClick={() => {
                        setShowRunModal(false);
                        setShowAIComment(true);
                    }}>AI 해설 보기</button>
                </div>                                                  
            </div>
        </div>
        )}

        {showSubmitModal && (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>코드가 제출되었습니다.</h2>
                <p>
                    {`성공`}
                </p>

                <div className="modal-buttons">
                    {/* 닫기 버튼 */}
                    <button onClick={() => setShowSubmitModal(false)}>닫기</button>

                    {/* AI 해설 보기 버튼 */}
                    {/* <button onClick={() => {
                        setShowRunModal(false);
                        setShowAIComment(true);
                    }}>AI 해설 보기</button> */}
                </div>                                                  
            </div>
        </div>
        )}

        </div>
    );
};

export default Solve;
