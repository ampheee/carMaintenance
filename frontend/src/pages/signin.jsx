import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SignInPage = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = (e) => {
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
      <form onSubmit={handleSignIn}>
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
    
        <p className="SignIn-link">
          Забыли пароль?{" "}
          <Link to="/reset">Восстановить</Link>
        </p>
    </div>
  );
};

export default SignInPage;