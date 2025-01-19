import React, { useState, useEffect } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, content }) => {
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        if (isOpen && content && content.slug) {
            // Fetch data from backend
            const fetchProfile = async () => {
                try {
                    const response = await fetch(`/user/getProfile?slug=${content.slug}`);
                    const data = await response.json();
                    setProfileData(data);
                } catch (error) {
                    console.error("Error fetching profile data:", error);
                }
            };

            fetchProfile();
        } else {
            setProfileData(null); // Clear profile data when modal is closed
        }
    }, [isOpen, content]);

    if (!isOpen || !content) return null; // Ensure modal opens only when `isOpen` and `content` are valid

    return (
        <div className="focus-modal" onClick={onClose}>
            <div className="animal-modal" onClick={(e) => e.stopPropagation()}>
                {/* Content Header */}
                <h2>{content.name}</h2>

                {/* Profile Data */}
                {profileData && (
                    <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                        <h3>{profileData.name}</h3>
                        <p>{profileData.animal}</p>
                    </div>
                )}

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