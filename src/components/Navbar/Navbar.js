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
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef(null);
  const menuRef = useRef(null);

// Panel dışına tıklanınca menüyü kapat
useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [menuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoryOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
    
  useEffect(() => {
    axios.get("http://localhost:8080/api/categories/all")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Kategoriler alınamadı:", err));
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        axios
          .get(`http://localhost:8080/api/categories/search?keyword=${searchTerm}`)
          .then(res => Array.isArray(res.data) ? setCategoryResults(res.data) : setCategoryResults([]))
          .catch(() => setCategoryResults([]));

        axios
          .get(`http://localhost:8080/api/products/search?keyword=${searchTerm}`)
          .then(res => Array.isArray(res.data) ? setProductResults(res.data) : setProductResults([]))
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
  {!menuOpen && (
  <div className={styles.hamburger} onClick={() => setMenuOpen(true)}>
    <FaBars size={24} />
  </div>
)}


      <div className={styles.logoContainer}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <span className={styles.brandName}>HEKTAPİ</span>
      </div>

      <ul className={styles.navLinks}>
        <li><Link to="/">Ana Sayfa</Link></li>
        <li><Link to="/product">Ürünler</Link></li>

        <li className={styles.dropdown} ref={categoryRef}>
  <Link
    to="#"
    className={styles.navLink} // bu aynı stil, navLinks li a stilini kapsıyor
    onClick={(e) => {
      e.preventDefault();
      setCategoryOpen(!categoryOpen);
    }}
  >
    Kategoriler
  </Link>

  {categoryOpen && (
    <ul className={styles.dropdownContent}>
      {categories.map((cat) => (
        <li key={cat.id}>
          <Link
            to={`/product?category=${cat.id}`}
            onClick={() => setCategoryOpen(false)}
          >
            {cat.name}
          </Link>
        </li>
      ))}
    </ul>
  )}
</li>




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
                      navigate("/product");
                      setSearchTerm("");
                    }}
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
                    onClick={() => setSearchTerm("")}
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
  <div className={styles.mobileMenu} ref={menuRef}>
<div className={styles.closeButton} onClick={() => setMenuOpen(false)}>
  <FaTimes size={24} />
</div>


    <Link to="/" onClick={() => setMenuOpen(false)}>Ana Sayfa</Link>
    <Link to="/product" onClick={() => setMenuOpen(false)}>Ürünler</Link>

    <div className={styles.mobileCategoryTitle}>Kategoriler</div>
    {categories.map((cat) => (
      <Link
        key={cat.id}
        to={`/product?category=${cat.id}`}
        onClick={() => setMenuOpen(false)}
        className={styles.mobileCategoryItem}
      >
        {cat.name}
      </Link>
    ))}

    {token && role === "ROLE_ADMIN" && (
      <Link to="/contentmanagment" onClick={() => setMenuOpen(false)}>İçerik Yönetimi</Link>
    )}
  </div>
)}



    </nav>
  );
};

export default Navbar;
