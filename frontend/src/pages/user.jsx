import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/user.css";

const initialUserData = {
  name: "John Doe",
  email: "johndoe@example.com",
  phone: "+1 234 567 890",
  address: "123 Main St, City, Country",
};

const ProfilePage = () => {
  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Handle input changes during editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Save changes and exit edit mode
  const handleSave = () => {
    setIsEditing(false);
    console.log("Updated User Data:", userData);
    alert("Profile updated successfully!");
  };

  // Navigate to other pages
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="App-profile">
      <h2>User Profile</h2>

      <div className="profile-container">
        {/* Left Section: Photo and Buttons */}
        <div className="left-section">
          <div className="user-photo">
            <img src="https://via.placeholder.com/300" alt="User" />
          </div>
          <div className="buttons-block">
            <button className="nav-btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
            <button className="nav-btn" onClick={() => handleNavigation("/garage")}>
              Go to Garage
            </button>
            <button className="nav-btn" onClick={() => handleNavigation("/bookings")}>
              My Bookings
            </button>
            <button className="nav-btn" onClick={() => handleNavigation("/orders")}>
              My Orders
            </button>
          </div>
        </div>

        {/* Right Section: Profile Information */}
        <div className="right-section">
          <div className="profile-card">
            <h3>Profile Information</h3>
            <div className="info-group">
              <label>Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{userData.name}</span>
              )}
            </div>
            <div className="info-group">
              <label>Email:</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{userData.email}</span>
              )}
            </div>
            <div className="info-group">
              <label>Phone:</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{userData.phone}</span>
              )}
            </div>
            <div className="info-group">
              <label>Address:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={userData.address}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{userData.address}</span>
              )}
            </div>
            {isEditing && (
              <div className="profile-actions">
                <button className="save-btn" onClick={handleSave}>
                  Save Changes
                </button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;