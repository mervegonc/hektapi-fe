import React from "react";
import AxiosInstance from "../../axios/AxiosInstance";
import styles from "./EditPanel.module.css";

const DeleteProductPanel = ({ productId, closePanel }) => {
  const handleDeleteProduct = () => {
    if (!window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;

    AxiosInstance.delete(`/products/${productId}/delete`)
      .then(() => {
        alert("Ürün başarıyla silindi!");
        window.location.reload();
        closePanel();
      })
      .catch(() => {
        alert("Ürün silinirken hata oluştu!");
      });
  };

  return (
    <div className={styles.editPanel}>
      <h2>Ürünü Sil</h2>
      <p>Bu işlemi gerçekleştirmek istediğinize emin misiniz?</p>
      <div className={styles.buttonContainer}>
        <button onClick={handleDeleteProduct} className={styles.deleteButton}>Sil</button>
        <button onClick={closePanel} className={styles.cancelButton}>İptal</button>
      </div>
    </div>
  );
};

export default DeleteProductPanel;
