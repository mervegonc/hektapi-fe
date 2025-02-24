import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AxiosInstance from "../../axios/AxiosInstance";
import styles from "./ProductDetailPage.module.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // 🔥 Admin kontrolü için state
  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    information: "",
    code: "",
    categoryId: "",
    attributes: [],
  });
  useEffect(() => {
    // 🔥 Admin olup olmadığını kontrol et
    const userRole = localStorage.getItem("role"); // 🛠 Backend'den dönen ROLE_ADMIN'ı kontrol et
    setIsAdmin(userRole === "ROLE_ADMIN");

    AxiosInstance.get(`/products/${id}`)
        .then((response) => {
            setProduct(response.data);
            setUpdatedProduct({
                name: response.data.name,
                information: response.data.information,
                code: response.data.code,
                categoryId: response.data.categoryId,
                attributes: response.data.attributes.map(attr => ({
                    id: attr.id,  // ✅ ARTIK ID’Yİ DE EKLİYORUZ!
                    key: attr.key,
                    value: attr.value
                }))
            });
        })
        .catch(() => {
            setErrorMessage("Ürün detayları yüklenirken bir hata oluştu!");
        });
}, [id, navigate]);




  if (errorMessage) return <p>{errorMessage}</p>;
  if (!product) return <p>Yükleniyor...</p>;

  const images = product.images || [];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // 🔥 Form değişikliklerini yönet
  const handleInputChange = (e) => {
    setUpdatedProduct({ ...updatedProduct, [e.target.name]: e.target.value });
  };

  const handleAttributeChange = (index, field, value) => {
    const newAttributes = [...updatedProduct.attributes];
    newAttributes[index][field] = value;
    setUpdatedProduct({ ...updatedProduct, attributes: newAttributes });
  };

  // 🔥 Güncelleme isteği gönderme
  const handleUpdateProduct = () => {
    AxiosInstance.put(`/products/${id}`, updatedProduct)
      .then((response) => {
        alert("Ürün başarıyla güncellendi!");
        setProduct(response.data);
        setIsEditing(false);
      })
      .catch(() => {
        alert("Ürün güncellenirken hata oluştu!");
      });
  };

  return (
    <div>
      <Navbar />
      <div className={styles.productDetail}>
        <div className={styles.productContainer}>
          
          {/* 🔥 Sol tarafta resim bölümü */}
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

          {/* 🔥 Sağ tarafta ürün bilgileri */}
          <div className={styles.infoSection}>
            {isEditing ? (
              <>
                <label>Ürün Adı:</label>
                <input type="text" name="name" value={updatedProduct.name} onChange={handleInputChange} />
                <label>Ürün Kodu:</label>
                <input type="text" name="code" value={updatedProduct.code} onChange={handleInputChange} />
                <label>Açıklama:</label>
                <textarea name="information" value={updatedProduct.information} onChange={handleInputChange} />
                <label>Kategori ID:</label>
                <input type="text" name="categoryId" value={updatedProduct.categoryId} onChange={handleInputChange} />
              </>
            ) : (
              <>
                <h2>{product.name}</h2>
                <p><strong>Kod:</strong> {product.code}</p>
                <p><strong>Kategori:</strong> {product.categoryName}</p>
                <p><strong>Açıklama:</strong> {product.information}</p>
              </>
            )}
          </div>
        </div>

        {/* 🔥 Özellikler Tablosu */}
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
                {updatedProduct.attributes.map((attr, index) => (
                  <tr key={index}>
                    {isEditing ? (
                      <>
                        <td>
                          <input
                            type="text"
                            value={attr.key}
                            onChange={(e) => handleAttributeChange(index, "key", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={attr.value}
                            onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{attr.key}</td>
                        <td>{attr.value}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Bu ürüne ait özellik bulunmamaktadır.</p>
          )}
        </div>

        {/* 🔥 Butonlar (Sadece Admin İçin) */}
        {isAdmin && (
          <div className={styles.buttonContainer}>
            {isEditing ? (
              <>
                <button onClick={handleUpdateProduct} className={styles.saveButton}>Kaydet</button>
                <button onClick={() => setIsEditing(false)} className={styles.cancelButton}>İptal</button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className={styles.editButton}>Düzenle</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
