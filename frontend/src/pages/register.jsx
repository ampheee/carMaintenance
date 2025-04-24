// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../utils/api";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const result = await apiRequest("POST", "/register", { email, password });

    if (result.success) {
      setMessage(`Пользователь с почтой ${email} успешно зарегистрирован!`);
      setTimeout(() => navigate("/"), 3000);
    } else {
      setMessage(result.message || "Ошибка при регистрации. Попробуйте снова.");
    }
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

      {/* Message Box Section */}
      {message && (
        <div className={`message-box ${message.includes("Ошибка") ? "error" : "success"}`}>
          <p>{message}</p>
        </div>
      )}

      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        Уже есть аккаунт?{" "}
        <Link to="/login" style={{ color: "#3498db", textDecoration: "underline" }}>
          Войти
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;