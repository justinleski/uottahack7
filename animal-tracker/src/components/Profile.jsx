import React from 'react';
import "./Profile.css";

const Profile = () => {
    return (
        <div className="profile-container">

            <div className="profile-top">
                {/*This <i> tag is a placeholder, change it to the user's avatar*/}
                <i className="bi bi-circle"></i>
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