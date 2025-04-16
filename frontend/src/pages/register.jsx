import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    alert(`Пользователь с почтой ${email} успешно зарегистрирован!`);
    navigate('/login');
  };

  return (
    <div className="App-form">
      <h2>Регистрация</h2>
      <form onSubmit={handleRegister}>
        <label htmlFor="email">Почтовый адрес:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Введите вашу почту"
          required
        />
        <label htmlFor="password">Пароль:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Введите пароль"
          required
        />
        <button type="submit">Зарегистрироваться</button>
      </form>

      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Уже есть аккаунт?{' '}
        <Link to="/login" style={{ color: '#3498db', textDecoration: 'underline' }}>
          Войти
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;