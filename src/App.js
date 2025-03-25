import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import AuthPage from "./pages/LoginPage/AuthPage";
import HomePage from "./pages/HomePage/HomePage";
import AxiosInstance from "./axios/AxiosInstance";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ProductUploadPage from "./pages/ProductUploadPage/ProductUploadPage";
import ProductPage from "./pages/ProductPage/ProductPage";
import ProductDetailPage from "./pages/ProductDetailPage/ProductDetailPage";

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const handleLoginSuccess = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const userId = localStorage.getItem("userId");

      setToken(token);
      setRole(role);
      setUserId(userId);
    };

    window.addEventListener("loginSuccess", handleLoginSuccess);
    return () => window.removeEventListener("loginSuccess", handleLoginSuccess);
  }, []);

  return (
    <Router>
      <Navbar key={token + role + userId} token={token} role={role} userId={userId} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route
          path="/productupload"
          element={token && role === "ROLE_ADMIN" ? <ProductUploadPage /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
