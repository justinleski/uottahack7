
import React from 'react';
import './Profile.css';

const Profile = () => {
    return (
        <div className="profile-container">
            <div className="coin-counter">
                Coins: 100
            </div>
            <div className="profile-top">
                <img src="https://via.placeholder.com/150" alt="User Avatar" className="user-avatar" />
                <p className="username">Username</p>
            </div>
            <div className="profile-midsection">
                <p className="favourite-animal">Favorite Animal: Dog</p>
            </div>
            <div className="profile-bottom">
                <button>View Friends List</button>
                <button>View Avatar Shop</button>
                <button>Change Details</button>
            </div>
        </div>
    );
};

export default Profile;
