import React from 'react';
import "../styles/home.css";

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Ваш надежный автосервис</h1>
            <p>
              Качественный ремонт и диагностика — профессионально, быстро и по
              приемлемой цене
            </p>
            <button className="cta-button">Записаться на осмотр</button>
          </div>
          <div className="hero-image">
            <img 
              src="/lovable-uploads/4da2b510-db4e-4600-bf8b-719ef1946750.png" 
              alt="Car maintenance service"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
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