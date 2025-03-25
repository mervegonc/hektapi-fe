import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./Navbar.module.css";
import logo from "../../assets/images/logo.png";

const Navbar = ({ token, role, userId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryResults, setCategoryResults] = useState([]);
  const searchRef = useRef(null); // Arama alanı için ref

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        axios
          .get(`http://localhost:8080/api/categories/search?keyword=${searchTerm}`)
          .then((res) => Array.isArray(res.data) ? setCategoryResults(res.data) : setCategoryResults([]))
          .catch((err) => {
            console.error("Arama hatası:", err);
            setCategoryResults([]);
          });
      } else {
        setCategoryResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setCategoryResults([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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

      <div className={styles.rightMenu} ref={searchRef}>
        <input
          type="text"
          placeholder="Kategori ara..."
          className={styles.searchBar}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {categoryResults.length > 0 && (
          <div className={styles.searchResults}>
            {categoryResults.map((cat) => (
              <div key={cat.id} className={styles.resultItem}>
                {cat.name}
              </div>
            ))}
          </div>
        )}

        {token && (
          <Link to={`/profile/${userId}`} className={styles.loginButton}>Profil</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
