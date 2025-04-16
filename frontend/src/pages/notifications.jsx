import React from 'react';
import { Link } from 'react-router-dom';

const notifications = [
  {
    id: 1,
    title: "Your Order Has Been Shipped",
    message: "Your order #12345 has been shipped and is on its way.",
    timestamp: "2023-10-01",
    read: false,
  },
  {
    id: 2,
    title: "Special Discount Alert!",
    message: "Enjoy 20% off on all automotive products this week.",
    timestamp: "2023-10-02",
    read: true,
  },
  {
    id: 3,
    title: "Service Reminder",
    message: "Your car is due for maintenance. Book now!",
    timestamp: "2023-10-03",
    read: false,
  },
];

const NotificationsPage = () => {
  return (
    <div className="notifications-page">
      <h2>Уведомления</h2>
      {notifications.length === 0 ? (
        <p>Новых уведомлений нет.</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map((notification) => (
            <li key={notification.id} className={notification.read ? "read" : "unread"}>
              <h4>{notification.title}</h4>
              <p>{notification.message}</p>
              <small>{notification.timestamp}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;