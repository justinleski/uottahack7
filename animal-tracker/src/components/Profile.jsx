import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {
    const [showFriendsList, setShowFriendsList] = useState(false);
    const [showAvatarShop, setShowAvatarShop] = useState(false);
    const [showChangeDetails, setShowChangeDetails] = useState(false);

    const closeModal = () => {
        setShowFriendsList(false);
        setShowAvatarShop(false);
        setShowChangeDetails(false);
    };

    return (
        <div className="profile-container">
            {/* Coin Counter */}
            <div className="coin-counter">
                Coins: 100
            </div>

            {/* Top Section */}
            <div className="profile-top">
                <img
                    src="https://via.placeholder.com/150"
                    alt="User Avatar"
                    className="user-avatar"
                />
                <p className="username">Username</p>
            </div>

            {/* Midsection */}
            <div className="profile-midsection">
                <p className="favourite-animal">Favorite Animal: Dog</p>
            </div>

            {/* Bottom Navigation */}
            <div className="profile-bottom">
                <button onClick={() => setShowFriendsList(true)}>View Friends List</button>
                <button onClick={() => setShowAvatarShop(true)}>View Avatar Shop</button>
                <button onClick={() => setShowChangeDetails(true)}>Change Details</button>
            </div>

            {/* Friends List Modal */}
            {showFriendsList && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Friends List</h3>
                        <p>Here is a list of your friends!</p>
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}

            {/* Avatar Shop Modal */}
            {showAvatarShop && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Avatar Shop</h3>
                        <p>Explore and customize your avatar!</p>
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}

            {/* Change Details Modal */}
            {showChangeDetails && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Change Details</h3>
                        <p>Update your profile information here.</p>
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;