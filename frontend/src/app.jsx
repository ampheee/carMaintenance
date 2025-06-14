import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/header';
import Footer from './components/footer';
import HomePage from './pages/home';
import ServicePage from './pages/service';
import UserPage from './pages/user';
import ProductsPage from './pages/products';
import CartPage from './pages/cart';
import BookingsPage from './pages/bookings';
import BookingDetailPage from './pages/bookingsDetail';
import NotificationPage from './pages/notifications';
import SingInPage from './pages/signin';
import SignUpPage from './pages/signup';
import ResetPage from './pages/reset';
import NotFoundPage from './pages/notfound';

import './app.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
    <Router>
      <Header isLoggedIn={isLoggedIn} />
      <main className='App-main'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SingInPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signout" element={<SingInPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/reset" element={<ResetPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductsPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/bookings/:id" element={<BookingDetailPage />} />
          <Route path="/service" element={<ServicePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/notifications" element={<NotificationPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
    </div>
  );
}

export default App;
