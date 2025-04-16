import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    alert(`A password reset link has been sent to ${email}.`);
    navigate('/login');
  };

  return (
    <div className="App-form">
      <h2>Восстановление пароля</h2>
      <form onSubmit={handleReset}>
        <label htmlFor="email">Почтовый адрес:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Введите свой почтовый адрес"
          required
        />
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
};

export default ResetPage;