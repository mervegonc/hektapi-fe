import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AxiosInstance from "../../axios/AxiosInstance";
import { SlidersHorizontal } from "lucide-react";
import Filter from "../../components/Filter/Filter";
import styles from "./ProductPage.module.css";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryIdFromUrl = searchParams.get("category");

  const handleFilter = (categoryId) => {
    if (!categoryId) {
      setFilteredProducts(products);
      setSelectedCategory("");
      return;
    }

    setSelectedCategory(categoryId); // filtrede seçili göstermek için
    AxiosInstance.get(`/products/category/${categoryId}`)
      .then((res) => {
        setFilteredProducts(res.data);
      })
      .catch((err) => {
        console.error("Filtreleme hatası:", err);
      });
  };
  useEffect(() => {
    const selectedCategoryId = localStorage.getItem("selectedCategoryId");
  
    AxiosInstance.get("/products")
      .then((response) => {
        setProducts(response.data);
  
        if (selectedCategoryId) {
          handleFilter(selectedCategoryId);
          setSelectedCategory(selectedCategoryId);
          localStorage.removeItem("selectedCategoryId");
        } else {
          setFilteredProducts(response.data);
        }
      })
      .catch((error) => {
        console.error("Ürünleri çekerken hata oluştu:", error);
      });
  }, []);
  
  
  
  return (
    <div className={styles.productPage}>
      <div className={styles.filterContainer}>
      
        <Filter onFilter={handleFilter} defaultCategory={selectedCategory} />
      </div>

      <div className={styles.productContainer}>
        <ul className={styles.productList}>
          {filteredProducts.map((product) => (
            <li
              key={product.id}
              className={styles.productItem}
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ cursor: "pointer" }}
            >
              {product.firstImageUrl ? (
                <img
                  src={`http://localhost:8080/api/products/uploads/products/${product.id}/${product.firstImageUrl.split("/").pop()}`}
                  alt={product.name}
                  className={styles.productImage}
                />
              ) : (
                <div
                  className={styles.productImage}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#eee",
                    height: "150px",
                  }}
                >
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
