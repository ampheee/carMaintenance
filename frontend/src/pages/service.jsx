import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/service.css";

const services = [
  {
    category: "Вокруг колеса",
    options: [
      { id: 1, name: "Шиномонтаж", price: 50 },
      { id: 2, name: "Правка дисков", price: 80 },
      { id: 3, name: "Ремонтная ошиповка шин", price: 120 },
      { id: 4, name: "Ремонт шин", price: 60 },
      { id: 5, name: "Установка датчиков давления шин", price: 30 },
      { id: 6, name: "Подготовка шин к утилизации", price: 20 },
      { id: 8, name: "Сварка аргоном", price: 100 },
      { id: 9, name: "Покраска и реставрация дисков", price: 150 },
    ],
  },
  {
    category: "Диагностика",
    options: [
      { id: 10, name: "Комплексная оперативная диагностика автомобиля", price: 50},
      { id: 11, name: "Диагностика двигателя", price: 70 },
      { id: 12, name: "Диагностика тормозной системы", price: 60 },
      { id: 13, name: "Диагностика подвески", price: 80 },
      { id: 14, name: "Диагностика трансмиссии", price: 90 },
      { id: 15, name: "Диагностика электрооборудования", price: 40 },
      { id: 16, name: "Диагностика системы охлаждения", price: 50 },
      { id: 17, name: "Диагностика системы питания", price: 70 },
      { id: 18, name: "Диагностика системы выхлопа", price: 60 },
      { id: 19, name: "Диагностика системы управления двигателем", price: 80 },
      { id: 20, name: "Диагностика системы ABS", price: 70 },
      { id: 21, name: "Диагностика системы ESP", price: 60 },
      { id: 22, name: "Диагностика системы SRS", price: 50 },
      { id: 23, name: "Диагностика системы кондиционирования", price: 40 },
      { id: 24, name: "Диагностика системы отопления", price: 30 },
    ],
  },
  {
    category: "Техническое обслуживание",
    options: [
      { id: 25, name: "Замена масла в двигателе", price: 50 },
      { id: 26, name: "Замена тормозной жидкости", price: 60 },
      { id: 27, name: "Развал-схождение", price: 70 },
      { id: 28, name: "Заправка автокондиционера", price: 80 },
      { id: 29, name: "Замена свечей зажигания", price: 40 },
      { id: 30, name: "Техническое обслуживание автомобиля", price: 90 },
      { id: 31, name: "Замена антифриза", price: 50 },
      { id: 32, name: "Замена масла в АКПП", price: 100 },
      { id: 33, name: "Замена масла в МКПП", price: 100 },
      { id: 33, name: "Промывка форсунок", price: 63},
      { id: 34, name: "Замена воздушного фильтра", price: 30 },
      { id: 36, name: "Замена салонного фильтра", price: 30 },
      { id: 37, name: "Замена аккумулятора автомобиля", price: 50 },
      { id: 38, name: "Замена топливного фильтра", price: 40 },
      { id: 39, name: "Замена жидкости ГУР", price: 50 },
      { id: 40, name: "Замена ремня ГРМ", price: 120 },
    ],
  },
  {
    category: "Ремонт",
    options: [
      { id: 41, name: "Ремонт подвески", price: 50 },
      { id: 42, name: "Ремонт трансмиссии", price: 80 },
      { id: 43, name: "Ремонт двигателя", price: 120 },
      { id: 44, name: "Ремонт тормозной системы", price: 60 },
      { id: 45, name: "Ремонт электрооборудования", price: 70 },
      { id: 46, name: "Ремонт кузова", price: 150 },
      { id: 47, name: "Ремонт системы охлаждения", price: 90 },
      { id: 48, name: "Ремонт системы выхлопа", price: 100 },
      { id: 49, name: "Ремонт системы кондиционирования", price: 80 },
      { id: 50, name: "Ремонт системы отопления", price: 70 },
      { id: 51, name: "Ремонт стартеров и генераторов", price: 60 },
      { id: 52, name: "Ремонт рулевой рейки", price: 90 },
      { id: 53, name: "Ремонт турбокомпрессора", price: 120 },
    ],
  },
  {
    category: "Замена узлов",
    options: [
      { id: 54, name: "Замена амортизаторов", price: 50 },
      { id: 55, name: "Замена тормозных дисков", price: 80 },
      { id: 56, name: "Замена тормозных колодок", price: 60 },
      { id: 57, name: "Замена сцепления", price: 120 },
      { id: 58, name: "Замена генератора", price: 100 },
      { id: 59, name: "Замена стартера", price: 90 },
      { id: 60, name: "Замена радиатора", price: 80 },
      { id: 61, name: "Замена масла в трансмиссии", price: 70 },
      { id: 62, name: "Замена масла в редукторе", price: 60 },
      { id: 63, name: "Замена фильтров", price: 50 },
    ],
  },
];

const ServicePage = () => {
  const [selectedServices, setSelectedServices] = useState([]);
  const navigate = useNavigate();

  const handleServiceSelection = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices((prev) => prev.filter((id) => id !== serviceId));
    } else {
      setSelectedServices((prev) => [...prev, serviceId]);
    }
  };

  const calculateSubtotal = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services
        .flatMap((section) => section.options)
        .find((s) => s.id === serviceId);
      return total + (service ? service.price : 0);
    }, 0);
  };

  const handleConfirmBooking = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service.");
      return;
    }

    console.log("Booking Confirmed:", {
      selectedServices,
      total: calculateSubtotal(),
    });

    alert("Booking confirmed successfully!");
    navigate("/");
  };

  const handleExistsBooking = () => {
    navigate("/bookings");
  };

  return (
    <div className="App-services">
      <h2>Book Your Car Repair</h2>

      <div className="booking-container">
        <div className="service-options-section">
          {services.map((section, index) => (
            <div key={index} className="service-category">
              <h4>{section.category}</h4>
              <div className="service-grid">
                {section.options.map((service) => (
                  <div key={service.id} className="service-item">
                    <label className="switchbox">
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service.id)}
                        onChange={() => handleServiceSelection(service.id)}
                      />
                      <span className="slider"></span>
                    </label>
                    <div className="service-details">
                      <span className="service-name">{service.name}</span>
                      <span className="service-price">${service.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="booking-summary-section">
          <h3>Booking Summary</h3>
          <div className="summary-details">
            {selectedServices.length > 0 ? (
              <>
                {selectedServices.map((serviceId) => {
                  const service = services
                    .flatMap((section) => section.options)
                    .find((s) => s.id === serviceId);
                  return (
                    <div key={serviceId} className="summary-item">
                      <span>{service.name}</span>
                      <span>${service.price}</span>
                    </div>
                  );
                })}
                <div className="summary-total">
                  <strong>Total:</strong>
                  <strong>${calculateSubtotal()}</strong>
                </div>
              </>
            ) : (
              <p>No services selected.</p>
            )}
          </div>

          <button className="confirm-booking-btn" onClick={handleConfirmBooking}>
            Confirm Booking
          </button>

          <button className="exists-bookings-btn" onClick={handleExistsBooking}>
            My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;