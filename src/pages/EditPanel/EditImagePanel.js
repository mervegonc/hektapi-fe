import React, { useState, useEffect } from "react";
import AxiosInstance from "../../axios/AxiosInstance";
import styles from "./EditPanel.module.css";

const EditImagePanel = ({ product, closePanel }) => {
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewNewImage, setPreviewNewImage] = useState(null);

  useEffect(() => {
    if (product && product.id) {
      AxiosInstance.get(`/products/${product.id}`)
        .then((response) => {
          setImages(response.data.images || []);
        })
        .catch(() => {
          alert("Ürün resimleri yüklenirken hata oluştu!");
        });
    }
  }, [product]);

  const handleDeleteImage = (index) => {
    const fileName = images[index].split("/").pop();
    const token = localStorage.getItem("token");

    AxiosInstance.delete(`/products/${product.id}/delete-image`, {
      params: { fileName },
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        alert("Resim başarıyla silindi!");
        setImages(images.filter((_, i) => i !== index));
      })
      .catch(() => {
        alert("Resim silinirken hata oluştu!");
      });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewImages([file]);
      setPreviewNewImage(URL.createObjectURL(file));
    }
  };

  const handleUploadImage = () => {
    if (newImages.length === 0) {
      alert("Lütfen en az bir resim seçin!");
      return;
    }

    const formData = new FormData();
    newImages.forEach((image) => {
      formData.append("files", image);
    });

    const token = localStorage.getItem("token");

    AxiosInstance.post(`/products/${product.id}/upload-images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        alert("Resimler başarıyla yüklendi!");
        closePanel();
      })
      .catch(() => {
        alert("Resim yüklenirken hata oluştu!");
      });
  };

  return (
    <div className={styles.editPanel}>
      <h2>Ürün Resimlerini Yönet</h2>
      <div className={styles.imagePreviewContainer}>
        {images.map((img, index) => (
          <div key={index} className={styles.imageWrapper}>
            <img
              src={`http://localhost:8080/api/products/uploads/products/${product.id}/${img.split("/").pop()}`}
              alt={`Ürün ${index}`}
              className={styles.previewImage}
            />
            <button 
              className={styles.imageDeleteButton} 
              onClick={() => handleDeleteImage(index)}
            >✖</button>
          </div>
        ))}
      </div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {previewNewImage && (
        <div className={styles.newImagePreview}>
          <h3>Yeni Seçilen Resim:</h3>
          <img src={previewNewImage} alt="Önizleme" className={styles.previewImage} />
        </div>
      )}
      <div className={styles.buttonContainer}>
        <button onClick={handleUploadImage} className={styles.uploadButton}>Resimleri Kaydet</button>
        <button onClick={closePanel} className={styles.cancelButton}>İptal</button>
      </div>
    </div>
  );
};

export default EditImagePanel;