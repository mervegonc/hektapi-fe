import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import AxiosInstance from "../../axios/AxiosInstance";
import styles from "./ProductDetailPage.module.css";

import { FaEllipsisV, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import EditProductPanel from "../EditPanel/EditProductPanel";
import EditImagePanel from "../EditPanel/EditImagePanel";
import EditAttributesPanel from "../EditPanel/EditAttributesPanel";
import DeleteProductPanel from "../EditPanel/DeleteProductPanel";
import EmailCard from "../../components/Email/EmailCard";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const optionsRef = useRef(null);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setIsAdmin(userRole === "ROLE_ADMIN");

    AxiosInstance.get(`/products/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch(() => {
        alert("Ürün detayları yüklenirken bir hata oluştu!");
      });
  }, [id]);

  // **Panel dışına tıklanınca kapatma fonksiyonu**
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setIsOptionsOpen(false);
      }
    };

    if (isOptionsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOptionsOpen]);

  if (!product) {
    return <p>Yükleniyor...</p>;
  }

  const images = product.images || [];

  const toggleOptionsMenu = () => {
    setIsOptionsOpen((prev) => !prev);
  };

  const toggleEditMode = (mode) => {
    setEditMode((prevMode) => (prevMode === mode ? null : mode));
    setIsOptionsOpen(false);
  };

  return (
    <div>
      
      <div className={styles.productDetail}>
        {/* Üst Bölüm: Resim + Ürün Bilgileri */}
        <div className={styles.topSection}>
          {/* 3 Noktalı Menü */}
          {isAdmin && (
            <div className={styles.optionsContainer} ref={optionsRef}>
              <FaEllipsisV className={styles.optionsIcon} onClick={toggleOptionsMenu} />
              {isOptionsOpen && (
                <div className={styles.optionsPanel}>
                  <button onClick={() => toggleEditMode("details")}>Ürün Bilgilerini Düzenle</button>
                  <button onClick={() => toggleEditMode("attributes")}>Özellikleri Düzenle</button>
                  <button onClick={() => toggleEditMode("images")}>Resimleri Yönet</button>
                  <button onClick={() => toggleEditMode("delete")}>Ürünü Sil</button> {/* ✅ DELETE BUTONU EKLENDİ */}
                </div>
              )}
            </div>
          )}

          {/* Ürün Resmi */}
          <div className={styles.imageSection}>
            {images.length > 0 && (
              <img
                src={`http://localhost:8080/api/products/uploads/products/${product.id}/${images[currentImageIndex].split("/").pop()}`}
                alt={product.name}
                className={styles.productImage}
              />
            )}
            <button className={styles.leftArrow} onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}>
              <FaChevronLeft />
            </button>
            <button className={styles.rightArrow} onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}>
              <FaChevronRight />
            </button>

            {/* Küçük Önizleme Resimleri */}
            <div className={styles.imagePreviewContainer}>
              {images.map((img, index) => (
                <img
                  key={index}
                  src={`http://localhost:8080/api/products/uploads/products/${product.id}/${img.split("/").pop()}`}
                  alt={`Önizleme ${index}`}
                  className={`${styles.previewImage} ${currentImageIndex === index ? styles.selectedImage : ""}`}
                  onClick={() => setCurrentImageIndex(index)} style={{ transition: 'none' }}

                />
              ))}
            </div>
          </div>

          {/* Ürün Bilgileri */}
          <div className={styles.infoSection}>
            <h2>{product.name}</h2>
            <p><strong>Kod:</strong> {product.code}</p>
            <p><strong>Kategori:</strong> {product.categoryName}</p>
            <p><strong></strong> {product.information}</p>
          </div>
        </div>

        {/* Özellikler Tablosu */}
        <div className={styles.detailsSection}>
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

        <EmailCard productName={product.name} productCode={product.code} />
      </div>

      {/* Edit Panelleri */}
      {editMode === "details" && (
        <EditProductPanel
          product={product}
          closePanel={() => setEditMode(null)}
        />
      )}

      {editMode === "attributes" && (
        <EditAttributesPanel
          product={product}
          closePanel={() => setEditMode(null)}
        />
      )}

      {editMode === "images" && (
        <EditImagePanel
          product={product}
          closePanel={() => setEditMode(null)}
        />
      )}
      {editMode === "delete" && (
  <DeleteProductPanel
    productId={product.id}
    closePanel={() => setEditMode(null)}
    setEditMode={setEditMode} // ✅ `setEditMode` prop olarak gönderildi
  />
)}


    </div>
  );
};

export default ProductDetailPage;
