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
        <span className={styles.brandName}>HEKTAPİ</span>
      </div>

      {/* Menü Linkleri */}
      <ul className={styles.navLinks}>
        <li><Link to="/">Ana Sayfa</Link></li>
        <li><Link to="/product">Ürünler</Link></li>

        {/* 🔒 Yalnızca Admin'lere Görünecek */}
        {role === "ROLE_ADMIN" && (
          <li><Link to="/productupload">Ürün Yükleme</Link></li>
        )}

       {/* <li><Link to="/about">İletişim</Link></li>*/}
      </ul>

      {/* Sağ Menü */}
      <div className={styles.rightMenu}>
        <input type="text" placeholder="Search..." className={styles.searchBar} />

        {/* Kullanıcı giriş yaptıysa "Profile" butonu, yoksa "Login" butonu göster */}
        {token ? (
          <Link to={`/profile/${userId}`} className={styles.loginButton}>Profil</Link>
        ) : (
          <Link to="/login" className={styles.loginButton}>Giriş</Link>
        )}

       
      </div>
    </nav>
  );
};

export default Navbar;
