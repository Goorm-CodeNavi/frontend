import Editor from '@monaco-editor/react';
import React, { useState } from 'react'

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

// Monaco가 기본 제공하지 않는 언어(C/C++)는 안전하게 plaintext로
const languageForMonaco = (lang) => {
    if (lang === 'javascript' || lang === 'python' || lang === 'java') return lang;
    // 'cpp'와 'c'는 기본 미지원 → 'plaintext'
    return 'plaintext';
};

const MyRecordDetail = () => {
    const [isAIView, setIsAIView] = useState(false);
    const [showCanvas, setShowCanvas] = useState(false);

    // 코드 입력 영역용 상태들
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState(templates['javascript']);
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    // 더미데이터
    const problemNumber = 42;
    const problemTitle = "예제 문제 제목";
    const language_ex = "python";
    const userCode = templates[language] || "// 코드 템플릿이 없습니다.";
    const timeTaken = "00:15:30";

    const handleLanguageChange = (e) => {
        const next = e.target.value;
        setLanguage(next);
        setCode(templates[next] || '');
    };

    const runCode = () => {
        setOutput("코드를 실행 중입니다...");

        try {
            let result = "";

            if (language === "javascript") {
                // 브라우저에서 직접 실행 가능한 유일한 언어: JS
                const logs = [];
                const originalLog = console.log;
                console.log = (...args) => logs.push(args.join(" "));
                eval(code); // 실제 실행
                console.log = originalLog;

                result = logs.join("\n") || "출력 결과 없음";
            } else {
                // 브라우저에서는 JS 외 언어는 실제 실행 불가
                result = [
                    `언어: ${language}`,
                    "이 언어는 현재 로컬 브라우저 환경에서 직접 실행할 수 없습니다.",
                    "입력한 코드:",
                    "----------------------------",
                    code,
                    "----------------------------",
                ].join("\n");
            }

            setOutput(result);
        } catch (err) {
            setOutput(`❌ 실행 오류: ${err.message}`);
        }
    };


    return (
        <div className='MyRecordDetail_wrap'>
            <div className="detail_container">
                <div className="left">
                    <div className="left_header">
                        <div className="problem_info">
                            <div className="problem_number">{problemNumber}</div>
                            <div className="problem_title">{problemTitle}</div>
                        </div>
                        <div className="timer">⏱ {timeTaken}</div>
                        <div className="problem_ai_btn" onClick={() => setIsAIView((prev) => !prev)}>
                            {isAIView ? "문제 보기" : "AI 해설 보기"}
                        </div>
                    </div>
                    <div className="left_content">
                        {isAIView ? (
                            <div className="ai_answer">
                                <h3>AI 모범 답안</h3>
                                <div className="ai_description">
                                    AI가 생성한 모범 답안(접근 방식, 최적화 전략, 코드)를 볼 수 있습니다. 이를 통해 어떤 부분을 개선할 수 있을지 스스로 분석하고 AI로부터 상세한 피드백을 받아보세요.
                                </div>
                                <div className="summarize">
                                    <h4>1. 문제 요약</h4>
                                    <div className="description">
                                        AI 모범 답안이 보입니다.
                                    </div>
                                </div>
                                <div className="solve_approach">
                                    <h4>2. 해결 전략 및 접근법</h4>
                                    <div className="description">
                                        AI 모범 답안이 보입니다.
                                    </div>
                                </div>
                                <div className="analyze">
                                    <h4>3. 시간/공간 복잡도 분석</h4>
                                    <div className="description">
                                        AI 모범 답안이 보입니다.
                                    </div>
                                </div>
                                <div className="pseudocode">
                                    <h4>4. 의사 코드 (Pseudocode)</h4>
                                    <div className="description">
                                        AI 모범 답안이 보입니다.
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="problem_descriptions">
                                <div className="problem_desc">
                                    <h3>문제</h3>
                                    <div className="description">
                                        여기에 문제 설명이 들어갑니다.
                                    </div>
                                </div>
                                <div className="requirements">
                                    <h3>조건</h3>
                                    <div className="description">
                                        <div className="desc_title">시간 제한</div>
                                        <div className="desc_content">0.25초 (추가 시간 없음)</div>
                                    </div>
                                    <div className="divider"></div>
                                    <div className="description">
                                        <div className="desc_title">메모리 제한</div>
                                        <div className="desc_content">128MB</div>
                                    </div>
                                </div>
                                <div className="input_output">
                                    <h3>입력</h3>
                                    <div className="description">
                                        입력 형식에 대한 설명이 들어갑니다.
                                    </div>
                                    <h3>출력</h3>
                                    <div className="description">
                                        출력 형식에 대한 설명이 들어갑니다.
                                    </div>
                                </div>
                                <div className="io_example">
                                    <h3>입출력 예시 1</h3>
                                    <div className="example_blocks">
                                        <div className="input_block">
                                            <div className="description">
                                                입력 예시가 들어갑니다.
                                            </div>
                                        </div>
                                        <div className="output_block">
                                            <div className="description">
                                                출력 예시가 들어갑니다.
                                            </div>
                                        </div>
                                    </div>
                                    <h3>입출력 예시 2</h3>
                                    <div className="example_blocks">
                                        <div className="input_block">
                                            <div className="description">
                                                입력 예시가 들어갑니다.
                                            </div>
                                        </div>
                                        <div className="output_block">
                                            <div className="description">
                                                출력 예시가 들어갑니다.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="right">
                    <div className="right_header">
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

                    <div className="right_content">
                        {showCanvas ? (
                            <div className="code_input">
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
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="canvas_container">
                                <h1>사고 과정 캔버스</h1>
                                <div className="canvas_description">
                                    코딩 전, 문제 해결 전략을 먼저 정리해보세요. 이 과정은 문제 해결 능력을 향상시키는 데 큰 도움이 됩니다.
                                </div>
                                <div className="summarize">
                                    <h4>1. 문제 요약</h4>
                                    <div className="description">
                                        사용자가 작성한 사고 캔버스가 보입니다.
                                    </div>
                                </div>
                                <div className="solve_approach">
                                    <h4>2. 해결 전략 및 접근법</h4>
                                    <div className="description">
                                        사용자가 작성한 사고 캔버스가 보입니다.
                                    </div>
                                </div>
                                <div className="analyze">
                                    <h4>3. 시간/공간 복잡도 분석</h4>
                                    <div className="description">
                                        사용자가 작성한 사고 캔버스가 보입니다.
                                    </div>
                                </div>
                                <div className="pseudocode">
                                    <h4>4. 의사 코드 (Pseudocode)</h4>
                                    <div className="description">
                                        사용자가 작성한 사고 캔버스가 보입니다.
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyRecordDetail
