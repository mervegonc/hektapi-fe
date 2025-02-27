import React, { useState, useEffect, useRef } from "react";
import AxiosInstance from "../../axios/AxiosInstance";
import styles from "./EditPanel.module.css";

const EditImagePanel = ({ product, closePanel }) => {
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewNewImages, setPreviewNewImages] = useState([]);
  const panelRef = useRef(null);

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
    const files = Array.from(event.target.files);
    setNewImages(files);
    setPreviewNewImages(files.map((file) => URL.createObjectURL(file)));
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
    <div className={styles.overlay}>
      <div className={styles.editPanel} ref={panelRef}>
        <h2>Ürün Resimlerini Yönet</h2>
        <div className={styles.imagePreviewContainer}>
          {/* Mevcut resimler */}
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
          {/* Yeni seçilen resimler */}
          {previewNewImages.map((img, index) => (
            <div key={`new-${index}`} className={styles.imageWrapper}>
              <img src={img} alt={`Yeni Resim ${index}`} className={styles.previewImage} />
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" multiple onChange={handleImageChange} />
        <div className={styles.buttonContainer}>
          <button onClick={handleUploadImage} className={styles.uploadButton}>Resimleri Kaydet</button>
          <button onClick={closePanel} className={styles.cancelButton}>İptal</button>
        </div>
      </div>
    </div>
  );
};

export default EditImagePanel;
