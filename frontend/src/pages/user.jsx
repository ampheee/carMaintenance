import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, User, ArrowRight } from 'lucide-react';
import '../styles/user.css';

const initialUserData = {
  name: "Назипов Рустам",
  email: "self.fishkid@example.com", 
  phone: "+1 234 567 890",
  address: "123 Main St, City, Country",
  role: "Клиент"
};

const ProfilePage = () => {
  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Updated User Data:", userData);
    alert("Profile updated successfully!");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const quickActions = [
    { label: "Мои записи", path: "/bookings" },
    { label: "Мои заказы", path: "/orders" },
    { label: "Уведомления", path: "/notifications" }
  ];

  return (
    <div className="App-profile">
      <h2></h2>
      
      <div className="profile-container">
        <div className="left-section">
          <div className="user-photo">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5Dh-hCRQx8d2VZzrmMMLcpUhAh53KlS1s5A&s" alt="User" />
          </div>

          <div className="buttons-block">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(action.path)}
                className="nav-btn"
              >
                <ArrowRight className="w-4 h-4" style={{ marginRight: '8px' }} />
                {action.label}
              </button>
            ))}
          </div>
        </div>

        <div className="right-section">
          <div className="profile-card">
            <h3>Информация о пользователе</h3>
            
            <div className="info-group">
              <label>Полное имя</label>
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
              <label>Почтовый адрес</label>
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
              <label>Номер телефона</label>
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
              <label>Роль</label>
              {isEditing ? (
                <input
                  type="text"
                  name="role"
                  value={userData.role}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{userData.role}</span>
              )}
            </div>

            {isEditing ? (
              <div className="profile-actions">
                <button onClick={handleSave} className="save-btn">
                  Сохранить изменения
                </button>
                <button onClick={() => setIsEditing(false)} className="cancel-btn">
                  Отменить изменения
                </button>
              </div>
            ) : (
              <div className="profile-actions">
                <button onClick={() => setIsEditing(true)} className="nav-btn">
                  <Edit className="w-4 h-4" style={{ marginRight: '8px' }} />
                  Отредактировать профиль
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