import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../axios/AxiosInstance";
import Navbar from "../../components/Navbar/Navbar"; 
import styles from "./ProductPage.module.css";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    AxiosInstance.get("/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Ürünleri çekerken hata oluştu:", error);
      });
  }, []);

  return (
    <div className={styles.productPage}>
      <Navbar />
      <div className={styles.productContainer}>
        <ul className={styles.productList}>
          {products.map((product) => (
            <li 
              key={product.id} 
              className={styles.productItem} 
              onClick={() => navigate(`/product/${product.id}`)} 
              style={{ cursor: "pointer" }} // ✅ Mouse ile tıklanabilir olduğunu gösterir
            >
              {/* 📌 Ürün Resmi */}
              {product.firstImageUrl ? (
                <img
                  src={`http://localhost:8080/api/products/uploads/products/${product.id}/${product.firstImageUrl.split('/').pop()}`}
                  alt={product.name}
                  className={styles.productImage}
                />
              ) : (
                <div 
                  className={styles.productImage} 
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#eee", height: "150px" }}
                >
                  <p style={{ color: "#666" }}>Resim Yok</p>
                </div>
              )}

              {/* 📌 Ürün Bilgileri */}
              <div className={styles.productInfo}>
                <p className={styles.productName}>{product.name}</p>
                <p className={styles.productCode}>Kod: {product.code}</p>
                <p className={styles.productDescription}>{product.information}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductPage;
