import React, { useState } from "react";
import AxiosInstance from "../../axios/AxiosInstance";
import styles from "./EditPanel.module.css";

const EditProductPanel = ({ product, closePanel }) => {
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });

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
    <div className={styles.editPanel}>
      <h2>Ürün Bilgilerini Düzenle</h2>
      <label>Ürün Adı:</label>
      <input type="text" name="name" value={updatedProduct.name} onChange={handleInputChange} />

      <label>Ürün Kodu:</label>
      <input type="text" name="code" value={updatedProduct.code} onChange={handleInputChange} />

      <label>Açıklama:</label>
      <textarea name="information" value={updatedProduct.information} onChange={handleInputChange} />

      <label>Kategori:</label>
      <input type="text" name="categoryName" value={updatedProduct.categoryName} onChange={handleInputChange} />

      <div className={styles.buttonContainer}>
        <button onClick={handleUpdateProduct} className={styles.saveButton}>Kaydet</button>
        <button onClick={closePanel} className={styles.cancelButton}>İptal</button>
      </div>
    </div>
  );
};

export default EditProductPanel;