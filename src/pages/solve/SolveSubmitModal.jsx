import React from 'react'

const SolveSubmitModal = ({ onClose }) => {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
            <h2>코드가 제출되었습니다.</h2>
            <p>
                {`성공`}
            </p>

            <div className="modal-buttons">
                {/* 닫기 버튼 */}
                <button onClick={onClose}>닫기</button>
            </div>                                                  
        </div>
    </div>
    )
}

export default SolveSubmitModal
