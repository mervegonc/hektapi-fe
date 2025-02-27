import React, { useState, useEffect, useRef } from "react";
import AxiosInstance from "../../axios/AxiosInstance";
import styles from "./EditPanel.module.css";

const EditProductPanel = ({ product, closePanel }) => {
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });
  const panelRef = useRef(null);
  const textareaRef = useRef(null);

  // Panel dışına tıklanınca kapatma
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        closePanel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closePanel]);

  // Açıklama metni değiştiğinde textarea'nın yüksekliğini otomatik ayarla
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Önce sıfırla
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // İçeriğe göre ayarla
    }
  }, [updatedProduct.information]);

  const handleInputChange = (e) => {
    setUpdatedProduct({ ...updatedProduct, [e.target.name]: e.target.value });
  };

  const handleUpdateProduct = () => {
    AxiosInstance.put(`/products/${product.id}`, updatedProduct)
      .then(() => {
        alert("Ürün başarıyla güncellendi!");
        window.location.reload();
        closePanel();
      })
      .catch(() => {
        alert("Ürün güncellenirken hata oluştu!");
      });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.editPanel} ref={panelRef}>
        <h2>Ürün Bilgilerini Düzenle</h2>
        <label>Ürün Adı:</label>
        <input type="text" name="name" value={updatedProduct.name} onChange={handleInputChange} />

        <label>Ürün Kodu:</label>
        <input type="text" name="code" value={updatedProduct.code} onChange={handleInputChange} />

        <label>Açıklama:</label>
        <textarea
          ref={textareaRef}
          name="information"
          value={updatedProduct.information}
          onChange={handleInputChange}
          className={styles.autoResizeTextarea}
        />

        <label>Kategori:</label>
        <input type="text" name="categoryName" value={updatedProduct.categoryName} onChange={handleInputChange} />

        <div className={styles.buttonContainer}>
          <button onClick={handleUpdateProduct} className={styles.saveButton}>Kaydet</button>
          <button onClick={closePanel} className={styles.cancelButton}>İptal</button>
        </div>
      </div>
    </div>
  );
};

export default EditProductPanel;
