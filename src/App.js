import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import AuthPage from "./pages/LoginPage/AuthPage";
import HomePage from "./pages/HomePage/HomePage";
import AxiosInstance from "./axios/AxiosInstance";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ProductUploadPage from "./pages/ProductUploadPage/ProductUploadPage";
import ProductPage from "./pages/ProductPage/ProductPage";
import ProductDetailPage from "./pages/ProductDetailPage/ProductDetailPage";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      AxiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const role = localStorage.getItem("role");

  return (
    <Router>
      {/* ✅ Layout'u Routes içine sarıyoruz */}
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />

          {/* 🔒 Yalnızca Admin'lere Açık Sayfa */}
          <Route
            path="/productupload"
            element={role === "ROLE_ADMIN" ? <ProductUploadPage /> : <Navigate to="/" />}
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
