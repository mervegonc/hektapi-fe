import React from "react";
import ProductUploadPage from "../../pages/ProductUploadPage/ProductUploadPage";
import CategoryPage from "../../pages/CategoryPage/CategoryPage";
import styles from "./ContentManagment.module.css";

const ContentManagement = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftCard}>
        <ProductUploadPage />
      </div>
      <div className={styles.rightCard}>
        <CategoryPage />
      </div>
    </div>
  );
};

export default ContentManagement;
