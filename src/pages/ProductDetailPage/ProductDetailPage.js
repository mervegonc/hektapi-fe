import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AxiosInstance from "../../axios/AxiosInstance";
import styles from "./ProductDetailPage.module.css";
import Navbar from "../../components/Navbar/Navbar";
import { FaEllipsisV, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import EditProductPanel from "../EditPanel/EditProductPanel";
import EditImagePanel from "../EditPanel/EditImagePanel";
import EditAttributesPanel from "../EditPanel/EditAttributesPanel";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [editMode, setEditMode] = useState(null);

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

  if (!product) return <p>Yükleniyor...</p>;

  const images = product.images || [];

  const toggleOptionsMenu = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  const toggleEditMode = (mode) => {
    setEditMode((prevMode) => (prevMode === mode ? null : mode));
  };

  return (
    <div>
      <Navbar />
      <div className={styles.productDetail}>
        {/* 3 Noktalı Menü */}
        {isAdmin && (
          <div className={styles.optionsContainer}>
            <FaEllipsisV className={styles.optionsIcon} onClick={toggleOptionsMenu} />
            {isOptionsOpen && (
              <div className={styles.optionsPanel}>
                <button onClick={() => toggleEditMode("details")}>Ürün Bilgilerini Düzenle</button>
                <button onClick={() => toggleEditMode("attributes")}>Özellikleri Düzenle</button>
                <button onClick={() => toggleEditMode("images")}>Resimleri Yönet</button>
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
        </div>

        {/* Ürün Bilgileri */}
        <div className={styles.infoSection}>
          <h2>{product.name}</h2>
          <p><strong>Kod:</strong> {product.code}</p>
          <p><strong>Kategori:</strong> {product.categoryName}</p>
          <p><strong>Açıklama:</strong> {product.information}</p>
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
    </div>
  );
};

export default ProductDetailPage;