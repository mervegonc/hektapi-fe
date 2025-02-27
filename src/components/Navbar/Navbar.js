import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import logo from "../../assets/images/logo.png";

const Navbar = () => {
  const token = localStorage.getItem("token"); // Kullanıcı oturumu kontrolü
  const userId = localStorage.getItem("userId"); // Kullanıcının ID'sini al
  const [role, setRole] = useState(localStorage.getItem("role") || "USER");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <img src={logo} alt="Logo" className={styles.logo} />
      </div>

      {/* Menü Linkleri */}
      <ul className={styles.navLinks}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/product">Product</Link></li>

        {/* 🔒 Yalnızca Admin'lere Görünecek */}
        {role === "ROLE_ADMIN" && (
          <li><Link to="/productupload">Product Upload</Link></li>
        )}

        <li><Link to="/help">Help</Link></li>
        <li><Link to="/about">About Us</Link></li>
      </ul>

      {/* Sağ Menü */}
      <div className={styles.rightMenu}>
        <input type="text" placeholder="Search..." className={styles.searchBar} />

        {/* Kullanıcı giriş yaptıysa "Profile" butonu, yoksa "Login" butonu göster */}
        {token ? (
          <Link to={`/profile/${userId}`} className={styles.loginButton}>Profile</Link>
        ) : (
          <Link to="/login" className={styles.loginButton}>Login</Link>
        )}

        <Link to="/cart" className={styles.loginButton}>Sepetim</Link>
      </div>
    </nav>
  );
};

export default Navbar;
