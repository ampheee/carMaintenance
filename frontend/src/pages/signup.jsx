import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../utils/api";

import '../styles/signup.css';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Почтовый адрес обязателен";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Введите корректный адрес электронной почты";
    }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Подтверждение пароля обязательно";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await apiRequest("POST", "/signup", {
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        setMessage(`Пользователь с почтой ${formData.email} успешно зарегистрирован!`);
        setTimeout(() => navigate("/signin"), 1000);
      } else {
        setMessage(result.message || "Ошибка при регистрации. Попробуйте снова.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Ошибка при регистрации. Попробуйте снова.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="App-form">
        <h2>Регистрация</h2>
        
        <form onSubmit={handleSignUp}>
            <label htmlFor="email">Почтовый адрес:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Введите вашу почту"
              className={errors.email ? "error" : ""}
              disabled={isLoading}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}

            <label htmlFor="password">Пароль:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Введите пароль"
              className={errors.password ? "error" : ""}
              disabled={isLoading}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}

            <label htmlFor="confirmPassword">Подтвердите пароль:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Подтвердите пароль"
              className={errors.confirmPassword ? "error" : ""}
              disabled={isLoading}
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}

          <button 
            type="submit" 
            className="signup-button"
            disabled={isLoading}
          >
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>

        {message && (
          <div className={`message-box ${message.includes("Ошибка") ? "error" : "success"}`}>
            <p>{message}</p>
          </div>
        )}

        <p className="login-link">
          Уже есть аккаунт?{" "}
          <Link to="/login">Войти</Link>
        </p>
      </div>
  );
};

export default SignUpPage;