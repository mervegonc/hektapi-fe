import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Navbar.module.css";
import logo from "../../assets/images/logo.png";
import { User } from "lucide-react";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = ({ token, role, userId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryResults, setCategoryResults] = useState([]);
  const [productResults, setProductResults] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        axios
          .get(`http://localhost:8080/api/categories/search?keyword=${searchTerm}`)
          .then((res) => Array.isArray(res.data) ? setCategoryResults(res.data) : setCategoryResults([]))
          .catch(() => setCategoryResults([]));

        axios
          .get(`http://localhost:8080/api/products/search?keyword=${searchTerm}`)
          .then((res) => Array.isArray(res.data) ? setProductResults(res.data) : setProductResults([]))
          .catch(() => setProductResults([]));
      } else {
        setCategoryResults([]);
        setProductResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setCategoryResults([]);
        setProductResults([]);
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

      <div className={styles.hamburger} onClick={toggleMenu}>
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>

      <ul className={styles.navLinks}>
        <li><Link to="/">Ana Sayfa</Link></li>
        <li><Link to="/product">Ürünler</Link></li>
        {token && role === "ROLE_ADMIN" && (
          <li><Link to="/contentmanagment">İçerik Yönetimi</Link></li>
        )}
      </ul>

      <div className={styles.rightMenu} ref={searchRef}>
        <input
          type="text"
          placeholder="Kategori veya Ürün ara..."
          className={styles.searchBar}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {(categoryResults.length > 0 || productResults.length > 0) && (
          <div className={styles.searchResults}>
            {categoryResults.length > 0 && (
              <>
                <div className={styles.resultTitle}>Kategoriler</div>
                {categoryResults.map((cat) => (
                  <div
                    key={cat.id}
                    className={styles.resultItem}
                    onClick={() => {
                      localStorage.setItem("selectedCategoryId", cat.id);
                      setSearchTerm("");
                      setCategoryResults([]);
                      setProductResults([]);
                      navigate("/product");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {cat.name}
                  </div>
                ))}
              </>
            )}

            {productResults.length > 0 && (
              <>
                <div className={styles.resultTitle}>Ürünler</div>
                {productResults.map((product) => (
                  <Link
                    to={`/product/${product.id}`}
                    key={product.id}
                    className={styles.resultItem}
                    onClick={() => {
                      setSearchTerm("");
                      setProductResults([]);
                      setCategoryResults([]);
                    }}
                  >
                    {product.name} ({product.code})
                  </Link>
                ))}
              </>
            )}
          </div>
        )}

        {token && (
          <Link to={`/profile/${userId}`} className={styles.profileIcon}>
            <User size={24} />
          </Link>
        )}
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/" onClick={toggleMenu}>Ana Sayfa</Link>
          <Link to="/product" onClick={toggleMenu}>Ürünler</Link>
          {token && role === "ROLE_ADMIN" && (
            <Link to="/contentmanagment" onClick={toggleMenu}>İçerik Yönetimi</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
