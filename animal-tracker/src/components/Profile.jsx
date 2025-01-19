import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [friendsList, setFriendsList] = useState([]);
    const [friendInvites, setFriendInvites] = useState([]);
    const [showModal, setShowModal] = useState(null); // 'friends', 'changeDetails', or 'friendInvites'
    const [loadingFriends, setLoadingFriends] = useState(false);
    const [loadingInvites, setLoadingInvites] = useState(false);
    const [formData, setFormData] = useState({ name: '', animal: '' });


    const [shopHats, setShopHats] = useState([]);
    const [shopAvatars, setShopAvatars] = useState([]);
    const [loadingShop, setLoadingShop] = useState(false);

// 2) Fetch hats and avatars
    const fetchShopData = async () => {
        setLoadingShop(true);
        try {
            const hatsResponse = await fetch('/shop/hats');
            const hatsData = await hatsResponse.json();
            setShopHats(hatsData);

            const avatarsResponse = await fetch('/shop/avatars');
            const avatarsData = await avatarsResponse.json();
            setShopAvatars(avatarsData);
        } catch (error) {
            console.error('Error fetching shop data:', error);
        } finally {
            setLoadingShop(false);
        }
    };

// 3) Shop actions
    const handleBuyHat = async (hatId) => {
        try {
            const response = await fetch('/shop/buyHat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pid: hatId }),
            });
            if (!response.ok) throw new Error('Failed to buy hat');

            // Server response might return updated profile
            const updatedProfile = await response.json();
            setProfileData(updatedProfile);

            // Refresh shop data to see updated "owned" status
            fetchShopData();
        } catch (error) {
            console.error('Error buying hat:', error);
        }
    };

    const handleBuyAvatar = async (avatarId) => {
        try {
            const response = await fetch('/shop/buyAvatar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pid: avatarId }),
            });
            if (!response.ok) throw new Error('Failed to buy avatar');

            const updatedProfile = await response.json();
            setProfileData(updatedProfile);

            fetchShopData();
        } catch (error) {
            console.error('Error buying avatar:', error);
        }
    };

    const handleSelectHat = async (hatId) => {
        try {
            const response = await fetch('/user/chooseHat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: hatId }),
            });
            if (!response.ok) throw new Error('Failed to select hat');

            const updatedProfile = await response.json();
            setProfileData(updatedProfile);
        } catch (error) {
            console.error('Error selecting hat:', error);
        }
    };

    const handleSelectAvatar = async (avatarId) => {
        try {
            const response = await fetch('/user/chooseAvatar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: avatarId }),
            });
            if (!response.ok) throw new Error('Failed to select avatar');

            const updatedProfile = await response.json();
            setProfileData(updatedProfile);
        } catch (error) {
            console.error('Error selecting avatar:', error);
        }
    };

// 4) Function to open Shop modal
    const openShopModal = () => {
        setShowModal('shop');
        fetchShopData();
    };


    useEffect(() => {
        // Fetch the profile data from the backend
        fetch('/user/profile')
            .then((response) => response.json())
            .then((data) => {
                setProfileData(data);
                setFormData({ name: data.name, animal: data.animal });
            })
            .catch((error) => console.error('Error fetching profile data:', error));
    }, []);

    const fetchFriendsDetails = async () => {
        setLoadingFriends(true);
        try {
            const response = await fetch('/user/getFriends');
            const friends = await response.json();

            const friendDetails = await Promise.all(
                friends.map(async (friend) => {
                    const friendResponse = await fetch(`/user/profile?slug=${friend.slug}`);
                    return await friendResponse.json();
                })
            );

            setFriendsList(friendDetails);
        } catch (error) {
            console.error('Error fetching friends details:', error);
        } finally {
            setLoadingFriends(false);
        }
    };

    const fetchFriendInvites = async () => {
        setLoadingInvites(true);
        try {
            const response = await fetch('/user/friendRequests');
            const invites = await response.json();

            const inviteDetails = await Promise.all(
                invites.map(async (invite) => {
                    const inviteResponse = await fetch(`/user/profile?slug=${invite.slug}`);
                    return await inviteResponse.json();
                })
            );

            setFriendInvites(inviteDetails);
        } catch (error) {
            console.error('Error fetching friend invites:', error);
        } finally {
            setLoadingInvites(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        fetch('/user/profileUpdate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to update profile');
                return response.json();
            })
            .then((updatedData) => {
                setProfileData((prev) => ({
                    ...prev,
                    name: updatedData.name,
                    animal: updatedData.animal,
                }));
                setShowModal(null);
            })
            .catch((error) => console.error('Error updating profile:', error));
    };

    const handleAcceptInvite = async (slug) => {
        try {
            console.log("SLUG", slug);
            await fetch('/user/addFriend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ slug }),
            });
            // Remove the accepted invite from the invites list
            setFriendInvites((prev) => prev.filter((invite) => invite.slug !== slug));
        } catch (error) {
            console.error('Error accepting friend invite:', error);
        }
    };

    const openFriendsModal = () => {
        setShowModal('friends');
        fetchFriendsDetails();
    };

    const openFriendInvitesModal = () => {
        setShowModal('friendInvites');
        fetchFriendInvites();
    };

    const openChangeDetailsModal = () => {
        setShowModal('changeDetails');
    };

    const closeModal = () => {
        setShowModal(null);
    };

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            {/* Coin Counter */}
            <div className="coin-counter">
                Coins: {profileData.balance}
            </div>

            {/* Top Section */}
            <div className="profile-top">
                <div className="avatar-container">
                    {/* Layering the avatar and hat */}
                    <img
                        src={profileData.img.avatar}
                        alt="User Avatar"
                        className="user-avatar"
                    />
                    <img
                        src={profileData.img.hat}
                        alt="User Hat"
                        className="user-hat"
                    />
                </div>
                <p className="username">{profileData.name}</p>
            </div>

            {/* Midsection */}
            <div className="profile-midsection">
                <p className="favourite-animal">Favorite Animal: {profileData.animal}</p>
            </div>

            {/* Bottom Navigation */}
            <div className="profile-bottom">
                <button onClick={openFriendsModal}>View Friends List</button>
                <button onClick={openFriendInvitesModal}>View Friend Invites</button>
                <button onClick={openChangeDetailsModal}>Change Details</button>
                <button onClick={openShopModal}>Open Shop</button>
            </div>

            {/* Combined Modal */}
            {showModal && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        {showModal === 'friends' && (
                            <>
                                <h3>Friends List</h3>
                                {loadingFriends ? (
                                    <p>Loading friends...</p>
                                ) : (
                                    <div className="friends-list">
                                        {friendsList.map((friend) => (
                                            <div key={friend.slug} className="friend-card">
                                                <div className="friend-avatar-container">
                                                    <img
                                                        src={friend.img.avatar}
                                                        alt={`${friend.name}'s Avatar`}
                                                        className="friend-avatar"
                                                    />
                                                    <img
                                                        src={friend.img.hat}
                                                        alt={`${friend.name}'s Hat`}
                                                        className="friend-hat"
                                                    />
                                                </div>
                                                <div className="friend-info">
                                                    <p>Name: {friend.name}</p>
                                                    <p>Favorite Animal: {friend.animal}</p>
                                                    <p>Coins: {friend.balance}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                        {showModal === 'friendInvites' && (
                            <>
                                <h3>Friend Invites</h3>
                                {loadingInvites ? (
                                    <p>Loading invites...</p>
                                ) : (
                                    <div className="friends-list">
                                        {friendInvites.map((invite) => (
                                            <div key={invite.slug} className="friend-card">
                                                <div className="friend-avatar-container">
                                                    <img
                                                        src={invite.img.avatar}
                                                        alt={`${invite.name}'s Avatar`}
                                                        className="friend-avatar"
                                                    />
                                                    <img
                                                        src={invite.img.hat}
                                                        alt={`${invite.name}'s Hat`}
                                                        className="friend-hat"
                                                    />
                                                </div>
                                                <div className="friend-info">
                                                    <p>Name: {invite.name}</p>
                                                    <p>Favorite Animal: {invite.animal}</p>
                                                    <p>Coins: {invite.balance}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleAcceptInvite(invite.slug)}
                                                >
                                                    Accept
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                        {showModal === 'changeDetails' && (
                            <>
                                <h3>Change Details</h3>
                                <form>
                                    <label>
                                        Name:
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Favorite Animal:
                                        <input
                                            type="text"
                                            name="animal"
                                            value={formData.animal}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                </form>
                                <div className="modal-actions">
                                    <button onClick={handleSave}>Save</button>
                                    <button onClick={closeModal}>Cancel</button>
                                </div>
                            </>
                        )}
                        {showModal === 'shop' && (
                            <>
                                <h3>Shop</h3>
                                {loadingShop && <p>Loading shop items...</p>}

                                {/* Hats Section */}
                                <h4>Hats</h4>
                                <div className="shop-items">
                                    {shopHats.map((hat) => (
                                        <div key={hat.hat_id} className="shop-item">
                                            <img src={hat.url} alt="Hat" className="shop-item-img" />

                                            {hat.owned ? (
                                                <button onClick={() => handleSelectHat(hat.hat_id)}>Select</button>
                                            ) : (
                                                <>
                                                    <p>Price: {hat.price}</p>
                                                    <button onClick={() => handleBuyHat(hat.hat_id)}>Buy</button>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Avatars Section */}
                                <h4>Avatars</h4>
                                <div className="shop-items">
                                    {shopAvatars.map((avatar) => (
                                        <div key={avatar.avatar_id} className="shop-item">
                                            <img src={avatar.url} alt="Avatar" className="shop-item-img" />

                                            {avatar.owned ? (
                                                <button onClick={() => handleSelectAvatar(avatar.avatar_id)}>Select</button>
                                            ) : (
                                                <>
                                                    <p>Price: {avatar.price}</p>
                                                    <button onClick={() => handleBuyAvatar(avatar.avatar_id)}>Buy</button>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;