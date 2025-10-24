import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import ChatBot from '../../components/chatbot/Chatbot';
import SolveRunModal from './SolveRunModeal';
import SolveSubmitModal from './SolveSubmitModal';
import { problemDetails } from '../../api/problemApi';
import { createSolutions } from '../../api/problemApi';
import { runJudgeCode } from '../../api/problemApi';
import { updateSolution } from '../../api/solutionAPI';
import { submitJudgeCode } from '../../api/solutionAPI';
import { fetchEditorial } from '../../api/problemApi';

const templates = {
    javascript: `console.log("Hello, JavaScript!");`,
    python: `print("Hello, Python!")`,
    java: `public class Main {
        public static void main(String[] args) {
            System.out.println("Hello, Java!");
        }
}`,
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, C++!" << endl;
    return 0;
}`,
    c: `#include <stdio.h>

int main() {
    printf("Hello, C!\\n");
    return 0;
}`,
};

// 언어별 Judge0 id
const languageIds = {
javascript: 63,
python: 71,
java: 62,
cpp: 54,
c: 50,
};

const Solve = () => {
    const [time, setTime] = useState(0);
    const [timerId, setTimerId] = useState(null);
    const navigate = useNavigate();

    const { problemNumber } = useParams();
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                setLoading(true);
                const result = await problemDetails(problemNumber);
                // result 구조 확인 후 필요한 데이터 추출
                // 예: result.result.content 또는 result.result
                console.log("1", result)
                console.log("문제 번호", problemNumber);
                setProblem(result.result); 
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
    }, [problemNumber]);
    
    const [canvasData, setCanvasData] = useState({
        problemSummary: "",
        solutionStrategy: "",
        complexityAnalysis: {
            timeAndSpace: ""
        },
        pseudocode: "",
    });

    const handleChange = async(e) => {
        const {name, value} = e.target;
        
        if (name === "problemSummary") {
            setCanvasData((prev) => ({...prev, problemSummary: value}));
        } else if (name === "solutionStrategy") {
            setCanvasData((prev) => ({...prev, solutionStrategy: value}));
        } else if (name === "complexityAnalysis.timeAndSpace") {
            setCanvasData((prev) => ({...prev, complexityAnalysis: {...prev.complexityAnalysis, timeAndSpace: value}}));
        } else if (name === "pseudocode") {
            setCanvasData((prev) => ({...prev, pseudocode: value}));
        }
        //setIsEdited(true);
    };

    const [solutionId, setSolutionId] = useState(null);


    // 사고캔버스 → 코드 에디터로 이동
    const handleSaveOrEdit = async () => {
        try {
            if (!solutionId) {
                // 🔹 새로 생성 (처음 저장)
                console.log("보내는 문제 번호", problemNumber);
                console.log("보내는 데이터", canvasData);
                const response = await createSolutions(problemNumber, canvasData);
                const newSolutionId = response?.result?.solutionId || response?.solutionId;
                if (newSolutionId) {
                    setSolutionId(newSolutionId);
                    setIsEdited(true);
                    setShowCanvas(true);
                    //alert("저장 완료!");
                    console.log("✅ solutionId 저장됨:", newSolutionId);
                }
            } else {
                const response = await updateSolution(solutionId, canvasData);
                //alert("수정 완료!");
                setShowCanvas(true);
                console.log("캔버스 수정 응답:", response);
                console.log("현재 solutionId:", solutionId);
            }
        } catch (error) {
            console.error("저장/수정 실패:", error);
            alert("사고 과정 캔버스 작성 실패");
        }
    };
    // setIsEdited(true);
    // setShowCanvas(true);

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

    const [aiEnabled, setAiEnabled] = useState(false); // AI 해설 버튼 활성화 여부
    const [editorial, setEditorial] = useState({
        summary: "",
        strategy: "",
        complexity: { time: "", space: "" },
        pseudocode: ""
    });

    useEffect(() => {
        if (aiEnabled && problemNumber) {
        const fetchEditorialData = async () => {
            try {
            const editorialData = await fetchEditorial(problemNumber);
            if (editorialData.isSuccess) {
                setEditorial(editorialData.result);
            } else {
                console.error("AI 해설 불러오기 실패:", editorialData.message);
            }
            } catch (error) {
            console.error("AI 해설 API 호출 중 오류:", error);
            }
        };
    
        fetchEditorialData();
        }
    }, [aiEnabled, problemNumber]);

    const [showCanvas, setShowCanvas] = useState(false); // true면 코드 에디터 보임
    const [isEdited, setIsEdited] = useState(false); // 저장 버튼 누름 여부
    const [showRunModal, setShowRunModal] = useState(false); // 모달창 표시 여부
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [modalShownOnce, setModalShownOnce] = useState(false); // 모달 1회만 표시
    
    const [showAI, setShowAI] = useState(false); // false = 문제 영역, true = AI 해설 영역
    const [code, setCode] = useState(templates["javascript"]);
    const [output, setOutput] = useState("");

    const [showAIComment, setShowAIComment] = useState(false);

    const [language, setLanguage] = useState("javascript");

    const [submitResult, setSubmitResult] = useState(null);

    if (loading) return <div>로딩중...</div>;
    if (error) return <div>문제 정보를 불러오지 못했습니다.</div>;
    if (!problem) return <div>문제가 존재하지 않습니다.</div>;

    const handleLanguageChange = (e) => {
        const selectedLang = e.target.value;
        setLanguage(selectedLang);
        setCode(templates[selectedLang]); // 언어 변경 시 기본 코드 로드
    };

    


    // 코드 실행
    const runCode = async () => {
        setOutput("코드를 실행 중입니다...");

        if (!modalShownOnce) {
            setShowRunModal(true);
            setModalShownOnce(true);
        }
        setAiEnabled(true);
        setShowRunModal(true);

        try {
            const result = await runJudgeCode(problemNumber, language, code); // 👈 분리된 API 사용
            console.log("실행결과", result);
            
            const rawOutput = result?.result?.[0]?.actualOutput || "";

            
            setOutput(rawOutput.trim() || "출력 결과가 없습니다.");
        } catch (err) {
            setOutput("❌ 실행 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
    if (!solutionId) {
        alert("먼저 사고캔버스를 저장하세요!");
        return;
    }

    try {
        const result = await submitJudgeCode(solutionId, {
            language,
            code,
            timeSpent: time * 1000, // 초 -> 밀리초
        });
        alert("제출 완료!");
        console.log("제출 결과:", result);
        setSubmitResult(result);
        setShowSubmitModal(true);
    } catch (error) {
        console.error("제출 실패:", error);
        alert("제출 중 오류가 발생했습니다.");
    }
};


    return (
        <div className="problem-page">
        {/* 상단 헤더 */}
        <div className="top-panel">
            <div className="top-panel-left">
            <h1 className="problem-title">{problem.number} {problem.title}</h1>

            <div className="timer">⏱ {formatTime(time)}</div>

            {/* ✅ AI 해설 버튼 (초기 비활성화) */}
            <button
                className="AI-commentary-btn"
                disabled={!aiEnabled}
                onClick={() => setShowAIComment((prev) => !prev)}
                style={{
                opacity: aiEnabled ? 1 : 0.5,
                cursor: aiEnabled ? "pointer" : "not-allowed",
                color: "white",
                }}
            >
                {showAIComment ? "문제 보기" : "AI 해설 보기"}
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
                        <div className="content-box">{problem.content}</div>
                    </section>

                    <section className="condition-section">
                        <h2>조건</h2>
                        <div className="content-box">{problem.inputDescription}</div>
                    </section>

                    <section className="io-section">
                        <h2>입력</h2>
                        <div className="content-box">{problem.inputDescription}</div>
                        <h2>출력</h2>
                        <div className="content-box">{problem.outputDescription}</div>
                    </section>

                    <section className="example-section">
                        <h2>입출력 예시 1</h2>
                        <div className='content-inout'>
                            <div className="content-box">{problem.examples[0].input}</div>
                            <div className="content-box">{problem.examples[0].output}</div>
                        </div>
                        <h2>입출력 예시 2</h2>
                        <div className='content-inout'>
                            <div className="content-box">{problem.examples[1].input}</div>
                            <div className="content-box">{problem.examples[1].output}</div>
                        </div>
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
                            <textarea readOnly value={editorial.summary} />
                        </div>

                        <div className="canvas-item">
                        <h3>2. 해결 전략 및 접근법</h3>
                        <textarea readOnly value={editorial.strategy} />
                        </div>

                        <div className="canvas-item">
                        <h3>3. 시간/공간 복잡도 분석</h3>
                        <textarea readOnly value={editorial.complexity.timeAndSpace} />
                        </div>

                        <div className="canvas-item">
                        <h3>4. 의사 코드 (Pseudocode)</h3>
                        <textarea readOnly value={editorial.pseudocode} />
                        </div>
                    </section>
                )}
            </div>

            <div className="right-panel">
            {showCanvas ? (
                <>
                <div className="editor-box">
                    {/* 언어 선택 드롭다운 */}
                    <div className="language-select">
                        <label htmlFor="language">언어 선택: </label>
                        <select
                        id="language"
                        value={language}
                        onChange={handleLanguageChange}
                        >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="c">C</option>
                        </select>
                    </div>

                    {/* 코드 에디터 */}
                    <Editor
                        height="530px"
                        language={language}
                        value={code}
                        onChange={(value) => setCode(value || "")}
                        theme="vs-dark"
                    />

                    {/* 출력 영역 */}
                    <div className="output-box">
                        <pre>{output || "출력 결과가 여기에 표시됩니다."}</pre>
                    </div>

                    {/* 버튼 영역 */}
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
                    <textarea name="problemSummary" 
                        placeholder="문제를 요약해 보세요."
                        value={canvasData.problemSummary}
                        onChange={handleChange} />
                    </div>

                    <div className="canvas-item">
                    <h3>2. 해결 전략 정리</h3>
                    <textarea name="solutionStrategy" 
                        placeholder="해결 전략을 정리하세요."
                        value={canvasData.solutionStrategy}
                        onChange={handleChange} />
                    </div>

                    <div className="canvas-item">
                    <h3>3. 시간/공간 복잡도 분석</h3>
                    <textarea name="complexityAnalysis.timeAndSpace"
                        placeholder="복잡도를 분석하세요."
                        value={canvasData.complexityAnalysis.timeAndSpace}
                        onChange={handleChange} />
                    </div>

                    <div className="canvas-item">
                    <h3>4. 의사 코드 (Pseudocode)</h3>
                    <textarea name="pseudocode" 
                        placeholder="의사 코드를 작성하세요." 
                        value={canvasData.pseudocode}
                        onChange={handleChange} />
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

            <SolveRunModal
                isOpen={showRunModal}
                onClose={() => setShowRunModal(false)}
                onShowAIComment={() => setShowAIComment(true)}
            />
        )}

        {showSubmitModal && (
            <SolveSubmitModal
                onClose={() => setShowSubmitModal(false)}
                result={submitResult} // 정답 여부 데이터
            />
        )}

        </div>
    );
};

export default Solve;