import React from 'react'

const BankModal = ({ onSelect }) => {
    return (
        <div className='BankModal_wrap'>
            <div className="modal_container">
                <div className="easy" onClick={() => onSelect('Easy (1-3)')}>Easy (1-3)</div>
                <div className="medium" onClick={() => onSelect('Medium (4-6)')}>Medium (4-6)</div>
                <div className="hard" onClick={() => onSelect('Hard (7-10)')}>Hard (7-10)</div>
            </div>
        </div>
    )
}

export default BankModal
