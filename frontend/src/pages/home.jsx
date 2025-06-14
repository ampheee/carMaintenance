import React from 'react';
import "../styles/home.css";

const HomePage = () => {
  return (
    <div className="homepage">

      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Ваш надежный автосервис</h1>
            <p>
              Качественный ремонт и диагностика — профессионально,<br></br>
              быстро и по приемлемой цене
            </p>
            <button className="cta-button">Записаться на осмотр</button>
          </div>
          <div className="hero-image">
            <img 
              src="https://resp-avto.ru/wp-content/uploads/2025/05/6318b1c55d84c1ffb7b7bf305b1bc837.jpg" 
              alt="Car maintenance service"
            />
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Почему выбирают наш автосервис</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Опытные специалисты</h3>
            <p>
              Каждый наш мастер имеет сертификат и 5+ лет опыта в
              автомобильной сфере
            </p>
          </div>
          <div className="feature-card">
            <h3>Современное оборудование</h3>
            <p>
              Только современное диагностическое и ремонтное
              оборудование ведущих мировых брендов
            </p>
          </div>
          <div className="feature-card">
            <h3>Гарантия на работы</h3>
            <p>
              На все оказанные работы мы
              предоставляем гарантию сроком на
              12 месяцев или 15 000 км
            </p>
          </div>
          <div className="feature-card">
            <h3>Прозрачные цены</h3>
            <p>
              Вы знаете цену до начала работ
              — без скрытых доплат и неожиданных
              расходов
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;