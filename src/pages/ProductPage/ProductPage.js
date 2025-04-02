import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AxiosInstance from "../../axios/AxiosInstance";
import styles from "./ProductPage.module.css";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoryFromQuery = searchParams.get("category");

  useEffect(() => {
    AxiosInstance.get("/products")
      .then((res) => {
        setProducts(res.data);

        if (categoryFromQuery) {
          AxiosInstance.get(`/products/category/${categoryFromQuery}`)
            .then((catRes) => setFilteredProducts(catRes.data))
            .catch((err) => console.error("Kategori ürünleri çekilemedi:", err));
        } else {
          setFilteredProducts(res.data);
        }
      })
      .catch((err) => console.error("Ürünler çekilemedi:", err));
  }, [categoryFromQuery]);

  return (
    <div className={styles.productPage}>
      <div className={styles.productContainer}>
        <ul className={styles.productList}>
          {filteredProducts.map((product) => (
            <li
              key={product.id}
              className={styles.productItem}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              {product.firstImageUrl ? (
                <img
                  src={`http://localhost:8080/api/products/uploads/products/${product.id}/${product.firstImageUrl.split("/").pop()}`}
                  alt={product.name}
                  className={styles.productImage}
                />
              ) : (
                <div className={styles.productImage} style={{ backgroundColor: "#eee", height: "150px" }}>
                  <p style={{ color: "#666" }}>Resim Yok</p>
                </div>
              )}
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
