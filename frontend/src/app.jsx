import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/header';
import Footer from './components/footer';
import HomePage from './pages/home';
import ServicePage from './pages/service';
import UserPage from './pages/user';
import ProductsPage from './pages/products';
import CartPage from './pages/cart';
import NotificationPage from './pages/notifications';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
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
          <Route path="/services" element={<ServicePage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/logout" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/products/:id" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset" element={<ResetPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
    </div>
  );
}

export default App;
