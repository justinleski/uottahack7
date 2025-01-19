import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, content }) => {
    if (!isOpen || !content) return null; // Ensure modal opens only when `isOpen` and `content` are valid

    return (
        <div className="focus-modal" onClick={onClose}>
            <div className="animal-modal" onClick={(e) => e.stopPropagation()}>
                {/* Content Header */}
                <h2>{content.name}</h2>

                {/* Image */}
                <img
                    src={content.imgSrc}
                    alt={content.name}
                    style={{
                        width: '100%',
                        maxHeight: '300px',
                        borderRadius: '0.5rem',
                        objectFit: 'cover',
                        marginBottom: '1rem'
                    }}
                />

                {/* Additional Content */}
                <p style={{ textAlign: 'center' }}>This is more information about {content.name}.</p>

                {/* Modal Buttons */}
                <div className="modal-buttons">
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;