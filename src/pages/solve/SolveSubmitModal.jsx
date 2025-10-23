import React from 'react'

const SolveSubmitModal = ({ onClose, result }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>제출 결과</h2>
                <p>
                    {result.message}
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
