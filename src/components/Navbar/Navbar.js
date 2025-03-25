import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import logo from "../../assets/images/logo.png";

const Navbar = ({ token, role, userId }) => {
  // 👉 BURAYA EKLE
  console.log("Navbar role:", role);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <span className={styles.brandName}>HEKTAPİ</span>
      </div>

      <ul className={styles.navLinks}>
        <li><Link to="/">Ana Sayfa</Link></li>
        <li><Link to="/product">Ürünler</Link></li>
        {token && role === "ROLE_ADMIN" && (
          <li><Link to="/productupload">Ürün Yükleme</Link></li>
        )}
      </ul>

      <div className={styles.rightMenu}>
        <input type="text" placeholder="Search..." className={styles.searchBar} />
        {token && (
          <Link to={`/profile/${userId}`} className={styles.loginButton}>Profil</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
