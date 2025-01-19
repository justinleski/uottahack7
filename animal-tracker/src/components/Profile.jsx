import React from 'react';
import "./Profile.css";

const Profile = () => {
    return (
        <div className="profile-container">

            <div className="coin-counter">
AAAA
            </div>

            <div className="profile-top">
                {/*This <img> tag is a placeholder, change it to the user's avatar*/}
                <img src="https://i.imgflip.com/8h26xs.png" alt="" className="user-avatar"/>
                <p className="username">Insert User Name</p>
            </div>


            <div className="profile-midsection">
                <p className="favourite-animal">Insert Favourite Animal</p>
            </div>


            <div className="profile-bottom">
                <button>View Friends List</button>
                <button>View Avatar Shop</button>
                <button>Change Details...</button>

            </div>


        </div>

    );
};

export default Profile;