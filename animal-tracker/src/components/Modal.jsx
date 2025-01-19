import React, { useState, useEffect } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, content }) => {
    const [profileData, setProfileData] = useState(null);
    const [isSendingInvite, setIsSendingInvite] = useState(false);

    useEffect(() => {
        if (isOpen && content && content.slug) {
            const fetchProfile = async () => {
                try {
                    const response = await fetch(`/user/profile?slug=${content.slug}`);
                    const data = await response.json();
                    setProfileData(data);
                } catch (error) {
                    console.error("Error fetching profile data:", error);
                }
            };

            fetchProfile();
        } else {
            setProfileData(null);
        }
    }, [isOpen, content]);

    const handleSendFriendInvite = async () => {
        setIsSendingInvite(true);
        try {
            const response = await fetch('/user/friendRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ slug: content.slug }),
            });
            if (!response.ok) throw new Error('Failed to send friend invite');
            alert(`Friend invite sent to ${profileData.name}`);
        } catch (error) {
            console.error('Error sending friend invite:', error);
            alert('Failed to send friend invite.');
        } finally {
            setIsSendingInvite(false);
        }
    };

    if (!isOpen || !content) return null;

    return (
        <div className="focus-modal" onClick={onClose}>
            <div className="animal-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}


                {profileData ? (
                    <>
                        {/* Profile Information */}
                        <div className="profile-info">
                            <div className="avatar-container">
                                <img
                                    src={profileData.img.avatar}
                                    alt="Avatar"
                                    className="modal-avatar"
                                />
                                <img
                                    src={profileData.img.hat}
                                    alt="Hat"
                                    className="modal-hat"
                                />
                            </div>
                            <p><strong>Name:</strong> {profileData.name}</p>
                            <p><strong>Favorite Animal:</strong> {profileData.animal}</p>
                            <p><strong>Balance:</strong> {profileData.balance}</p>
                        </div>

                        {/* Image */}
                        <h2>Animal: {content.animal}</h2>
                        <img
                            src={content.imgSrc}
                            alt={content.name}
                            className="modal-image"
                        />

                        {/* Invite Button */}
                        <button
                            onClick={handleSendFriendInvite}
                            disabled={isSendingInvite}
                            className="invite-button"
                        >
                            {isSendingInvite ? 'Sending...' : 'Send Friend Invite'}
                        </button>
                    </>
                ) : (
                    <p>Loading user details...</p>
                )}

                {/* Close Button */}
                <div className="modal-buttons">
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;