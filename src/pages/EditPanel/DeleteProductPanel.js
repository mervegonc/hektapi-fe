import React from "react";
import { useNavigate } from "react-router-dom"; // 🚀 useNavigate import edildi
import AxiosInstance from "../../axios/AxiosInstance";
import styles from "./EditPanel.module.css";

const DeleteProductPanel = ({ productId, closePanel, setEditMode }) => {
  const navigate = useNavigate(); // 🚀 Navigasyon için hook kullanılıyor

  const handleDeleteProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return; // Eğer token yoksa işlem yapma

      await AxiosInstance.delete(`/products/${productId}/delete-completely`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      closePanel();
      navigate("/product"); // 🚀 Silindikten sonra yönlendir
    } catch (error) {
      console.error("Silme işlemi başarısız:", error);
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
