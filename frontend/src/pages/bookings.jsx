import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/bookings.css';

const mockBookings = [
  {
    id: 'SL74983160664',
    date: '2025-06-17 в 14:20',
    car: 'Toyota GT 86',
    service: 'Услуги шиномонтажа',
    amount: '1800₽',
    status: 'Подтверждена',
    description: 'Замена летних шин на зимние, балансировка колес, проверка давления'
  },
  {
    id: 'SL74983160667',
    date: '2025-06-17 в 15:30',
    car: 'LADA Vesta',
    service: 'Услуги шиномонтажа',
    amount: '1200₽',
    status: 'Подтверждена',
    description: 'Ремонт прокола шины, балансировка'
  }
];

const BookingCard = ({ booking }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/bookings/${booking.id}`);
  };

  return (
    <div className="booking-card" onClick={handleCardClick}>
      <div className="booking-header">
        <span className="booking-number">Запись №{booking.id}</span>
      </div>
      
      <div className="booking-details">
        <div className="booking-row">
          <span className="booking-label">Дата записи:</span>
          <span className="booking-value">{booking.date}</span>
        </div>
        
        <div className="booking-row">
          <span className="booking-label">Авто:</span>
          <span className="booking-value">{booking.car}</span>
        </div>
        
        <div className="booking-row">
          <span className="booking-label">Услуги выбранные:</span>
          <span className="booking-value">{booking.service}</span>
        </div>
        
        <div className="booking-row">
          <span className="booking-label">Сумма:</span>
          <span className="booking-value">{booking.amount}</span>
        </div>
        
        <div className="booking-row">
          <span className="booking-label">Статус записи:</span>
          <span className={`booking-status ${booking.status === 'Подтверждена' ? 'confirmed' : ''}`}>
            {booking.status}
          </span>
        </div>
      </div>
    </div>
  );
};


const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const booking = mockBookings.find(b => b.id === id);
  
  if (!booking) {
    return (
      <div className="booking-detail-page">
        <div className="booking-detail-container">
          <h1>Запись не найдена</h1>
          <button onClick={() => navigate('/bookings')} className="back-button">
            Назад к записям
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-detail-page">
      <div className="booking-detail-container">
        <button onClick={() => navigate('/bookings')} className="back-button">
          ← Назад к записям
        </button>
        
        <h1 className="booking-detail-title">Запись №{booking.id}</h1>
        
        <div className="booking-detail-card">
          <div className="booking-detail-section">
            <h3>Информация о записи</h3>
            <div className="booking-detail-row">
              <span className="booking-detail-label">Дата записи:</span>
              <span className="booking-detail-value">{booking.date}</span>
            </div>
            
            <div className="booking-detail-row">
              <span className="booking-detail-label">Автомобиль:</span>
              <span className="booking-detail-value">{booking.car}</span>
            </div>
            
            <div className="booking-detail-row">
              <span className="booking-detail-label">Услуги:</span>
              <span className="booking-detail-value">{booking.service}</span>
            </div>
            
            <div className="booking-detail-row">
              <span className="booking-detail-label">Описание:</span>
              <span className="booking-detail-value">{booking.description}</span>
            </div>
            
            <div className="booking-detail-row">
              <span className="booking-detail-label">Сумма:</span>
              <span className="booking-detail-value amount">{booking.amount}</span>
            </div>
            
            <div className="booking-detail-row">
              <span className="booking-detail-label">Статус:</span>
              <span className={`booking-detail-status ${booking.status === 'Подтверждена' ? 'confirmed' : ''}`}>
                {booking.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingsPage = () => {
  return (
    <div className="bookings-page">
      <div className="bookings-container">
        <h1 className="bookings-title">Мои записи</h1>
        <div className="bookings-grid">
          {mockBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;