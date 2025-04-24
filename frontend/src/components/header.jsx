import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaBell } from 'react-icons/fa';
import '../styles/cart.css';
import "../styles/notifications.css";

const Header = ({ isLoggedIn }) => {
  const notifications = [
    // { id: 1, read: false },
    // { id: 2, read: true },
    // { id: 3, read: false },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;
  const cartItemsCount = 0;
  const originalSize = 24;
  const resizedSize = Math.floor(originalSize * 0.8);

  return (
    <header className="App-header">
      <nav>
        <div>
          <Link to="/">Главная</Link>
          <Link to="/service">Сервис</Link>
          <Link to="/products">Автотовары</Link>
        </div>
        <div>
          {isLoggedIn ? (
            <span>Welcome, User!</span>
          ) : (
            <>
              <Link to="/login">Войти</Link>
              <Link to="/register">Зарегистрироваться</Link>
            </>
          )}

          <Link to="/cart" className="cart-icon">
            <FaShoppingCart/>
            {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
          </Link>

          <Link to="/notifications" className="notification-icon">
            <FaBell/>
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;