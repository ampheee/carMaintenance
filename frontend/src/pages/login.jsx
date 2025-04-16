import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'user@example.com' && password === 'password') {
      setIsLoggedIn(true);
      navigate('/');
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="App-form">
      <h2>Вход</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Почтовый адрес:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Пароль:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Войти</button>
      </form>
      {/* Forgot Password Link */}
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        <Link to="/reset">Забыли пароль?</Link>
      </p>
    </div>
  );
};

export default LoginPage;