import React from 'react';

const SolveRunModal = ({ isOpen, onClose, onShowAIComment }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>AI 해설 기능 안내</h2>
        <p>
          {`AI가 생성한 모범 답안(접근방식, 최적화 전략, 코드)를 볼 수 있습니다.\n이를 통해 어떤 부분을 개선할 수 있을지 스스로 분석하고\nAI로부터 상세한 비드백을 받을 수 있습니다.`}
        </p>

        <div className="modal-buttons">
        <button
            onClick={() => {
              onClose();
            }}
          >
            닫기
          </button>
          <button
            onClick={() => {
              onClose();
              onShowAIComment();
            }}
          >
            AI 해설 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SolveRunModal;
