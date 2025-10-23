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

const MyRecordDetail = () => {
    const [isAIView, setIsAIView] = useState(false);

    // 더미데이터
    const problemNumber = 42;
    const problemTitle = "예제 문제 제목";
    const language = "python";
    const userCode = templates[language] || "// 코드 템플릿이 없습니다.";
    const timeTaken = "00:15:30";

    return (
        <div className='MyRecordDetail_wrap'>
            <div className="detail_container">
                <div className="left">
                    <div className="left_header">
                        <div className="problem_info">
                            <div className="problem_number">{problemNumber}</div>
                            <div className="problem_title">{problemTitle}</div>
                        </div>
                        <div className="timer">{timeTaken}</div>
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
                    사고 캔버스 및 코드 입력 섹션입니다.
                </div>
            </div>
        </div>
    );
}

export default MyRecordDetail
