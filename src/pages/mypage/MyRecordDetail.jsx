import Editor from '@monaco-editor/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSolutionDetail } from '../../api/userApi';

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

// 백엔드 언어 문자열 → 셀렉트 키 값
const toLangKey = (lang) => {
    if (!lang) return 'javascript';
    const m = {
        javascript: 'javascript',
        javascriptes6: 'javascript',
        js: 'javascript',
        python: 'python',
        py: 'python',
        java: 'java',
        cplusplus: 'cpp',
        'c++': 'cpp',
        cpp: 'cpp',
        c: 'c',
    };
    return m[String(lang).toLowerCase()] || 'javascript';
};

// Monaco가 기본 제공하지 않는 언어(C/C++)는 안전하게 plaintext로
const languageForMonaco = (langKey) => {
    if (langKey === 'javascript' || langKey === 'python' || langKey === 'java') return langKey;
    return 'plaintext';
};

// 초 → HH:MM:SS
const formatHMS = (seconds) => {
    if (typeof seconds !== 'number' || seconds < 0) return '-';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

const MyRecordDetail = () => {
    const { solutionId } = useParams();

    const [isAIView, setIsAIView] = useState(false);
    const [showCanvas, setShowCanvas] = useState(false);

    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState('');

    // 코드 입력 영역용 상태들
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState(templates['javascript']);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);
                setLoadError('');
                const res = await getSolutionDetail(solutionId);
                setDetail(res);

                // 제출 코드/언어 설정 (userImplementation)
                const implLangKey = toLangKey(res?.userImplementation?.language);
                setLanguage(implLangKey);
                setCode(res?.userImplementation?.code ?? templates[implLangKey] ?? '');
            } catch (e) {
                setLoadError(e?.message || '제출 상세 정보를 불러오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        };
        if (solutionId) fetchDetail();
    }, [solutionId]);

    if (loading) return <div className="MyRecordDetail_wrap">로딩 중...</div>;
    if (loadError) return <div className="MyRecordDetail_wrap">에러: {loadError}</div>;
    if (!detail) return <div className="MyRecordDetail_wrap">데이터가 없습니다.</div>;

    // 화면 표시용 파생값들
    const problemNumber = detail?.problemInfo?.number ?? '';
    const problemTitle = detail?.problemInfo?.title ?? '';
    const problemContent = detail?.problemInfo?.content ?? '';
    const inputDescription = detail?.problemInfo?.inputDescription ?? '';
    const outputDescription = detail?.problemInfo?.outputDescription ?? '';
    const timeLimit = detail?.problemInfo?.timeLimit;     // ms
    const memoryLimit = detail?.problemInfo?.memoryLimit; // MB
    const examples = Array.isArray(detail?.problemInfo?.examples) ? detail.problemInfo.examples : [];

    const ai = detail?.aiSolution;
    const userTP = detail?.userThinkingProcess;

    const timeSpentText = formatHMS(detail?.statusInfo?.timeSpent);

    const handleLanguageChange = (e) => {
        const next = e.target.value;
        setLanguage(next);
        setCode(templates[next] || '');
    };

    return (
        <div className="MyRecordDetail_wrap">
            <div className="detail_container">
                <div className="left">
                    <div className="left_header">
                        <div className="problem_info">
                            <div className="problem_number">{problemNumber}</div>
                            <div className="problem_title">{problemTitle}</div>
                        </div>
                        <div className="timer">⏱ {timeSpentText}</div>
                        <div className="problem_ai_btn" onClick={() => setIsAIView((prev) => !prev)}>
                            {isAIView ? '문제 보기' : 'AI 해설 보기'}
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
                                        {ai?.summary || 'AI 모범 요약이 없습니다.'}
                                    </div>
                                </div>

                                <div className="solve_approach">
                                    <h4>2. 해결 전략 및 접근법</h4>
                                    <div className="description">
                                        {ai?.strategy || 'AI 해결 전략이 없습니다.'}
                                    </div>
                                </div>

                                <div className="analyze">
                                    <h4>3. 시간/공간 복잡도 분석</h4>
                                    <div className="description">
                                        {(() => {
                                            if (!ai?.complexity) return '복잡도 정보가 없습니다.';
                                            // complexity가 JSON 문자열일 수 있어 파싱 시도
                                            try {
                                                const obj = typeof ai.complexity === 'string' ? JSON.parse(ai.complexity) : ai.complexity;
                                                const t = obj?.time ?? '-';
                                                const s = obj?.space ?? '-';
                                                return `시간: ${t} / 공간: ${s}`;
                                            } catch {
                                                return String(ai.complexity);
                                            }
                                        })()}
                                    </div>
                                </div>

                                <div className="pseudocode">
                                    <h4>4. 의사 코드 (Pseudocode)</h4>
                                    <div className="description">
                                        {ai?.pseudocode || '의사 코드가 없습니다.'}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="problem_descriptions">
                                <div className="problem_desc">
                                    <h3>문제</h3>
                                    <div className="description">
                                        {problemContent || '문제 설명이 없습니다.'}
                                    </div>
                                </div>

                                <div className="requirements">
                                    <h3>조건</h3>
                                    <div className="description">
                                        <div className="desc_title">시간 제한</div>
                                        <div className="desc_content">
                                            {typeof timeLimit === 'number' ? `${timeLimit} ms` : '-'}
                                        </div>
                                    </div>
                                    <div className="divider"></div>
                                    <div className="description">
                                        <div className="desc_title">메모리 제한</div>
                                        <div className="desc_content">
                                            {typeof memoryLimit === 'number' ? `${memoryLimit} MB` : '-'}
                                        </div>
                                    </div>
                                </div>

                                <div className="input_output">
                                    <h3>입력</h3>
                                    <div className="description">{inputDescription || '입력 설명이 없습니다.'}</div>
                                    <h3>출력</h3>
                                    <div className="description">{outputDescription || '출력 설명이 없습니다.'}</div>
                                </div>

                                <div className="io_example">
                                    <h3>입출력 예시</h3>
                                    {examples.length === 0 ? (
                                        <div className="description">예시가 없습니다.</div>
                                    ) : (
                                        examples.map((ex, idx) => (
                                            <div className="example_blocks" key={idx}>
                                                <div className="input_block">
                                                    <div className="description">
                                                        <div className="desc_title">입력 {idx + 1}</div>
                                                        <pre className="desc_pre">{ex?.input ?? ''}</pre>
                                                    </div>
                                                </div>
                                                <div className="output_block">
                                                    <div className="description">
                                                        <div className="desc_title">출력 {idx + 1}</div>
                                                        <pre className="desc_pre">{ex?.output ?? ''}</pre>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
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
                                    <div className="code_header">
                                        <span className="label">제출 언어</span>
                                        <div className="lang_badge">{language.toUpperCase()}</div>
                                    </div>
                                    <div className="submit_code">
                                        <code>{code}</code>
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
                                        {userTP?.problemSummary || '작성된 내용이 없습니다.'}
                                    </div>
                                </div>

                                <div className="solve_approach">
                                    <h4>2. 해결 전략 및 접근법</h4>
                                    <div className="description">
                                        {userTP?.solutionStrategy || '작성된 내용이 없습니다.'}
                                    </div>
                                </div>

                                <div className="analyze">
                                    <h4>3. 시간/공간 복잡도 분석</h4>
                                    <div className="description">
                                        {userTP?.complexityAnalysis
                                            ? `시간: ${userTP?.complexityAnalysis?.time || '-'} / 공간: ${userTP?.complexityAnalysis?.space || '-'}`
                                            : '작성된 내용이 없습니다.'}
                                    </div>
                                </div>

                                <div className="pseudocode">
                                    <h4>4. 의사 코드 (Pseudocode)</h4>
                                    <div className="description">
                                        {userTP?.pseudocode || '작성된 내용이 없습니다.'}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyRecordDetail;
