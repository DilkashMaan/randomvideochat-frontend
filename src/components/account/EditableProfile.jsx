import React, { useState, useRef, useEffect, useCallback } from "react";
import "./style/EditableProfile.css";
import { Link } from "react-router-dom";
import AxiosInstance from "../axios/AxiosInstance";
import { useAuth } from "../auth/AuthContext";
import Spinner from "../spinner/spinner";

const EditableProfile = ({ onClose, onImageUpdate }) => {
    const { userId } = useAuth();
    const [loading, setLoading] = useState(true);
    const [selectedImageFile, setSelectedImageFile] = useState(null);

    const [profile, setProfile] = useState({
        username: "",
        email: "",
        dob: "",
        gender: "",
        memberSince: "",
        image: "",
    });

    const [editMode, setEditMode] = useState(false);
    const fileInputRef = useRef(null);

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", options);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImageFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfile((prev) => ({
                    ...prev,
                    image: event.target.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append("username", profile.username);
            if (selectedImageFile) {
                formData.append("profile_photo", selectedImageFile);
            }

            await AxiosInstance.patch("update_profile/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setEditMode(false);
            fetchUser();
            if (selectedImageFile) {
                const imageUrl = URL.createObjectURL(selectedImageFile);
                onImageUpdate(imageUrl);
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    const handleCancel = () => {
        setEditMode(false);
        fetchUser();
    };

    const fetchUser = useCallback(async () => {



        try {
            const response = await AxiosInstance.get(`user/${userId}/`);
            console.log("userId editttttttttttttttttttt", response);

            const data = response.data;
            const imageUrl = data.profile_photo
                ? `${import.meta.env.VITE_API_URL}${data.profile_photo}`
                : "../home-images/account.png";

            setProfile({
                username: data.username || "",
                email: data.email || "",
                dob: data.dob || "",
                gender: data.gender || "",
                memberSince: data.date_joined || "",
                image: imageUrl,
            });
        } catch (error) {
            console.error("Failed to fetch user:", error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const handleDeleteProfileImage = async () => {
        try {
            await AxiosInstance.delete("delete_pf/");
            const defaultImg = "../home-images/account.png";
            setProfile((prev) => ({ ...prev, image: defaultImg }));
            setSelectedImageFile(null);
            onImageUpdate(defaultImg);
        } catch (error) {
            console.error("Failed to delete profile image:", error);
        }
    };

    // if (loading) return <div>Loading profile...</div>;

    return (
        <div className="profile-overlay">

            {loading ? <>
                <Spinner />
            </> :
                <>
                    {/* <div className="profile-page">
                        <div className="profile-card">
                        <div className="profile-close-btn">
                            <Link to="/dashboard">
                            <button className="close-btn" onClick={onClose}>✕</button>
                            </Link>
                        </div>

                        <div className="profile-image-container">
                            <div className="image-wrapper">
                            <img
                                src={profile.image}
                                alt="Profile"
                                className="profile-image"
                                onClick={() => editMode && fileInputRef.current.click()}
                            />
                            {editMode && (
                                <button
                                className="change-image-btn"
                                onClick={() => fileInputRef.current.click()}
                                >
                                +
                                </button>
                            )}
                            </div>

                            {editMode && profile.image !== "../home-images/account.png" && (
                            <button className="delete-image-btn" onClick={handleDeleteProfileImage}>
                                Delete
                            </button>
                            )}

                            <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageUpload}
                            />
                        </div>

                        <div className="profile-info">
                            {editMode ? (
                            <input
                                type="text"
                                className="edit-input"
                                name="username"
                                value={profile.username}
                                onChange={handleInputChange}
                            />
                            ) : (
                            <h2 className="profile-name">{profile.username}</h2>
                            )}

                            {editMode ? (
                            <input
                                type="email"
                                className="edit-input2"
                                name="email"
                                value={profile.email}
                                onChange={handleInputChange}
                                disabled
                            />
                            ) : (
                            <p className="profile-email">{profile.email}</p>
                            )}

                            <div className="button-group">
                            {!editMode ? (
                                <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
                            ) : (
                                <>
                                <button className="save-btn" onClick={handleSave}>Save Changes</button>
                                <button className="edit-btn cancel-btn" onClick={handleCancel}>Cancel</button>
                                </>
                            )}
                            </div>
                        </div>

                        <div className="profile-details">
                            <div className="detail-item">
                            <div className="detail-label">Date of Birth</div>
                            <div className="detail-value">{formatDate(profile.dob)}</div>
                            </div>
                            <div className="detail-item">
                            <div className="detail-label">Gender</div>
                            <div className="detail-value">{profile.gender}</div>
                            </div>
                            <div className="detail-item">
                            <div className="detail-label">Plan Type</div>
                            <div className="detail-value">{profile.is_premium ? "Premium" : "Free"}</div>
                            </div>
                        </div>
                        </div>
                    </div> */}

                    <div className="profile-page">
                        <div className="profile-card">

                            <div className="profile-header">
                                <div className="avatar-section">
                                    <img src={profile.image} alt="Profile" className="profile-avatar" />
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={handleImageUpload}
                                    />
                                    {editMode && (
                                        <button
                                            className="change-photo-btn"
                                            onClick={() => fileInputRef.current.click()}
                                        >
                                            Click to replace
                                        </button>
                                    )}


                                </div>

                                <div className="profile-actions">
                                    {/* <button className="copy-link">📋 Copy link</button>
                                    <button className="view-profile">View profile</button> */}
                                    <h3>{profile.username?.charAt(0).toUpperCase() + profile.username?.slice(1)}</h3>
                                    <h4>{profile.email}</h4>
                                </div>
                                <div className="close-btn">
                                    <button className="view-profile" onClick={() => {onClose() }} >X</button>
                                </div>
                            </div>

                            <form className="profile-form">
                                <div className="form-group">
                                    <label>Email address</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        name="email"
                                        value={profile.email}
                                        disabled
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Username</label>
                                    <div className="username-wrapper">
                                        <input
                                            type="text"
                                            className="form-input"
                                            name="username"
                                            value={profile.username}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Date of Birth</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        name="dob"
                                        value={profile.dob || ""}
                                        onChange={handleInputChange}
                                        disabled
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Plan Type</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        name="planType"
                                        value={profile.planType || "Free"}
                                        onChange={handleInputChange}
                                        disabled
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="delete-btn" onClick={handleDeleteProfileImage}>
                                        🗑 Delete user
                                    </button>
                                    <div className="action-buttons">
                                        <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
                                        <button type="button" className="save-btn" onClick={handleSave}>Save changes</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </>}

        </div>

    );
};

export default EditableProfile;
