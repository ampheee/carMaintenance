import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <h2>404</h2>
      <h2>Ой! Страница не найдена :/</h2>
      <p>Страница, на которую Вы пытаетесь попасть могла быть удалена, изменена или просто временно недоступна.</p>
      <Link to="/" className="home-link">
        <h3> Вернуться на главную</h3>
      </Link>
    </div>
  );
};

export default NotFoundPage;