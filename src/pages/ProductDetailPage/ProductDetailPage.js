import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AxiosInstance from "../../axios/AxiosInstance";
import styles from "./ProductDetailPage.module.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";

const ProductDetailPage = () => {
  const { id } = useParams(); // 🔥 URL'den id'yi alıyoruz
  const navigate = useNavigate(); // 🔥 Hata durumunda yönlendirme yapmak için
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log("Product ID:", id); // ✅ Debugging için id'yi kontrol et

    if (!id || id === "undefined") {
      console.error("HATA: productId 'undefined' geldi!");
      setErrorMessage("Geçersiz ürün ID!");
      setTimeout(() => navigate("/"), 3000); // 3 saniye sonra anasayfaya yönlendir
      return;
    }

    AxiosInstance.get(`/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        console.log("Ürün verisi başarıyla çekildi:", response.data);
      })
      .catch((error) => {
        console.error("Ürün detaylarını alırken hata oluştu:", error);
        setErrorMessage("Ürün detayları yüklenirken bir hata oluştu!");
      });
  }, [id, navigate]);

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  if (!product) {
    return <p>Yükleniyor...</p>;
  }

  const images = product.images || [];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div><Navbar/>
    <div className={styles.productDetail}>
      <div className={styles.productContainer}>
        
        <div className={styles.imageSection}>
          {images.length > 0 ? (
            <div className={styles.imageWrapper}>
              <img
                src={`http://localhost:8080/api/products/uploads/products/${product.id}/${images[currentImageIndex].split('/').pop()}`}
                alt={product.name}
                className={styles.productImage}
              />
              {images.length > 1 && (
                <>
                  <button className={styles.leftArrow} onClick={prevImage}>
                    <FaChevronLeft />
                  </button>
                  <button className={styles.rightArrow} onClick={nextImage}>
                    <FaChevronRight />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className={styles.noImage}>Resim Yok</div>
          )}
        </div>

        <div className={styles.infoSection}>
          <h2>{product.name}</h2>
          <p><strong>Kod:</strong> {product.code}</p>
          <p><strong>Kategori:</strong> {product.categoryName}</p>
          <p><strong>Açıklama:</strong> {product.information}</p>
        </div>
      </div>

      <div className={styles.detailsSection}>
        {images.length > 1 && (
          <div className={styles.thumbnailContainer}>
            {images.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:8080/api/products/uploads/products/${product.id}/${img.split('/').pop()}`}
                alt={`Thumbnail ${index}`}
                className={`${styles.thumbnail} ${index === currentImageIndex ? styles.activeThumbnail : ""}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        )}

        {product.attributes.length > 0 ? (
          <table className={styles.attributesTable}>
            <thead>
              <tr>
                <th>Özellik</th>
                <th>Değer</th>
              </tr>
            </thead>
            <tbody>
              {product.attributes.map((attr, index) => (
                <tr key={index}>
                  <td>{attr.key}</td>
                  <td>{attr.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Bu ürüne ait özellik bulunmamaktadır.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default ProductDetailPage;
