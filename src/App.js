import React, { useEffect } from 'react';
import "./index.css";  // index.css dosyanın dahil olduğundan emin ol

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/LoginPage/AuthPage';
import HomePage from './pages/HomePage/HomePage';
import AxiosInstance from './axios/AxiosInstance';
import ProfilePage from './pages/ProfilePage/ProfilePage'
import ProductUploadPage from './pages/ProductUploadPage/ProductUploadPage';
import ProductPage from './pages/ProductPage/ProductPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
function App() {

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    AxiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}, []);



  return (
    <Router>
      <Routes>
      <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/productuplaoad" element={<ProductUploadPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />



      </Routes>
    </Router>
  );
}

export default App;
