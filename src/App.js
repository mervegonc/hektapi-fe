import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import AuthPage from "./pages/LoginPage/AuthPage";
import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ProductPage from "./pages/ProductPage/ProductPage";
import ProductDetailPage from "./pages/ProductDetailPage/ProductDetailPage";
import ContentManagement from "./components/Content/ContentManagement";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

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
  path="/contentmanagment"
  element={token && role === "ROLE_ADMIN" ? <ContentManagement /> : <Navigate to="/login" replace />}
/>


      </Routes>
    </Router>
  );
}

export default App;
