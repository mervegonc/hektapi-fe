



import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import logo from "../../assets/images/logo.png";

const Navbar = () => {
  const token = localStorage.getItem("token"); // Kullanıcı oturumu kontrolü
  const userId = localStorage.getItem("userId"); // Kullanıcının ID'sini al

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <img src={logo} alt="" className={styles.logo} />
        <span className={styles.brandName}></span>
      </div>

      {/* Menü Linkleri */}
      <ul className={styles.navLinks}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/product">Product</Link></li>
        <li><Link to="/productuplaoad">Products</Link></li>
      
        <li><Link to="/help">Help</Link></li>
        <li><Link to="/about">About Us</Link></li>
      </ul>

      {/* Arama ve Dinamik Giriş / Profil Butonları */}
      <div className={styles.rightMenu}>
        <input type="text" placeholder="Search..." className={styles.searchBar} />

        {/* Kullanıcı giriş yaptıysa sadece "Profile" butonu göster */}
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
