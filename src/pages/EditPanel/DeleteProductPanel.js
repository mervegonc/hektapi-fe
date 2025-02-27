import React from "react";
import AxiosInstance from "../../axios/AxiosInstance";
import styles from "./EditPanel.module.css";

const DeleteProductPanel = ({ productId, closePanel, setEditMode }) => {
  const handleDeleteProduct = async () => {
    if (!window.confirm("Bu ürünü tamamen silmek istediğinize emin misiniz?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Yetkilendirme hatası: Lütfen tekrar giriş yapın.");
        return;
      }

      await AxiosInstance.delete(`/products/${productId}/delete-completely`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Ürün başarıyla silindi!");
      window.location.reload();
      closePanel();
    } catch (error) {
      console.error("Silme işlemi başarısız:", error);
      alert(`Ürün silinirken hata oluştu! \n${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className={styles.editPanel}>
      <h2>Ürünü Sil</h2>
      <p>Bu işlemi gerçekleştirmek istediğinize emin misiniz?</p>
      <div className={styles.buttonContainer}>
        <button onClick={handleDeleteProduct} className={styles.deleteButton}>
          Sil
        </button>
        <button
          onClick={() => {
            closePanel();
            if (setEditMode) setEditMode(null);
          }}
          className={styles.cancelButton}
        >
          İptal
        </button>
      </div>
    </div>
  );
};

export default DeleteProductPanel;
