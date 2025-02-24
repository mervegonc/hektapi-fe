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
  const [isAdmin, setIsAdmin] = useState(false);
  const [newImages, setNewImage] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    information: "",
    code: "",
    categoryId: "",
    attributes: [],
  });

  useEffect(() => {
    const userRole = localStorage.getItem("role");
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
            id: attr.id,  
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

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };
// 🔥 Resmi Silme İşlemi

const handleDeleteImage = () => {
  if (!images[currentImageIndex]) {
    alert("Silinecek bir resim bulunamadı!");
    return;
  }

  const fileName = images[currentImageIndex].split('/').pop();
  const token = localStorage.getItem("token"); // 🔥 Token eklemeyi unutma

  AxiosInstance.delete(`/products/${id}/delete-image`, {
    params: { fileName },
    headers: { Authorization: `Bearer ${token}` } // 🔥 Yetkilendirme ekle
  })
    .then(() => {
      alert("Resim başarıyla silindi!");
      window.location.reload();
    })
    .catch((error) => {
      if (error.response) {
        if (error.response.status === 404) {
          alert("Resim bulunamadı!");
        } else if (error.response.status === 500) {
          alert("Sunucu hatası: Resim silinemedi!");
        }
      } else {
        alert("Bağlantı hatası!");
      }
    });
};

const handleAddAttribute = () => {
  setUpdatedProduct({
    ...updatedProduct,
    attributes: [...updatedProduct.attributes, { key: "", value: "" }],
  });
};



  const handleInputChange = (e) => {
    setUpdatedProduct({ ...updatedProduct, [e.target.name]: e.target.value });
  };

  const handleAttributeChange = (index, field, value) => {
    const newAttributes = [...updatedProduct.attributes];
    newAttributes[index][field] = value;
    setUpdatedProduct({ ...updatedProduct, attributes: newAttributes });
  };

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


  const handleDeleteProduct = () => {
    if (!window.confirm("Bu ürünü ve tüm ilişkili verileri silmek istediğinize emin misiniz?")) {
      return;
    }
  
    AxiosInstance.delete(`/products/${id}/delete-completely`) // ✅ Token otomatik ekleniyor
      .then(() => {
        alert("Ürün ve tüm ilişkili veriler başarıyla silindi!");
        navigate("/products"); 
      })
      .catch((error) => {
        console.error("Ürün silme hatası:", error);
        if (error.response) {
          if (error.response.status === 404) {
            alert("Ürün bulunamadı!");
          } else if (error.response.status === 403) {
            alert("Yetkiniz yok! Lütfen tekrar giriş yapın.");
          } else if (error.response.status === 500) {
            alert("Sunucu hatası: Ürün silinemedi!");
          }
        } else {
          alert("Bağlantı hatası!");
        }
      });
  };
  
  
  


  
  const handleImageChange = (event) => {
    setNewImage(Array.from(event.target.files)); // 🔥 Tüm dosyaları diziye çevir
};


const handleUploadImage = () => {
  if (newImages.length === 0) {
    alert("Lütfen en az bir resim seçin!");
    return;
  }

  const formData = new FormData();
  newImages.forEach((image) => {
    formData.append("files", image); // ✅ Çoklu dosya ekleme
  });

  const token = localStorage.getItem("token"); // 🔥 Token eklemeyi unutma

  AxiosInstance.post(`/products/${id}/upload-images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`, // 🔥 Yetkilendirme ekle
    },
  })
    .then(() => {
      alert("Resimler başarıyla yüklendi!");
      window.location.reload();
    })
    .catch((error) => {
      if (error.response) {
        if (error.response.status === 401) {
          alert("Yetkilendirme hatası! Lütfen tekrar giriş yapın.");
        } else if (error.response.status === 404) {
          alert("Endpoint bulunamadı! Backend'e `upload-images` endpointini ekleyin.");
        } else {
          alert("Bir hata oluştu!");
        }
      } else {
        alert("Bağlantı hatası!");
      }
    });
};

  
const handleAddNewAttribute = () => {
  const newAttribute = {
    id: null, // Yeni eklenenler için ID olmayacak
    key: "",
    value: ""
  };
  setUpdatedProduct({
    ...updatedProduct,
    attributes: [...updatedProduct.attributes, newAttribute]
  });
};
const handleSaveNewAttributes = () => {
  const newAttributes = updatedProduct.attributes.filter(attr => attr.id === null);
  newAttributes.forEach(attr => {
    AxiosInstance.post("/products/add-attribute", {
      productId: id,
      key: attr.key,
      value: attr.value
    })
      .then(() => {
        alert(`"${attr.key}" eklendi!`);
      })
      .catch(() => {
        alert(`"${attr.key}" eklenirken hata oluştu.`);
      });
  });
};

  return (
    <div>
      <Navbar />
      <div className={styles.productDetail}>
        <div className={styles.productContainer}>

          {/* 🔥 Büyük Resim ve Thumbnail Bölümü */}
          <div className={styles.imageSection}>
            <div className={styles.mainImageWrapper}>
              {/* 🆕 Resmi Sil Butonu */}
{isAdmin && isEditing && images.length > 0 && (
  <button onClick={handleDeleteImage} className={styles.deleteButton}>
    Resmi Sil
  </button>
)}

              {images.length > 0 ? (
                <>
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
                </>
              ) : (
                <div className={styles.noImage}>Resim Yok</div>
              )}
            </div>

            {/* 🔥 Thumbnail Önizlemeleri (ALT ve SOLDA) */}
            {images.length > 1 && (
              <div className={styles.thumbnailContainer}>
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={`http://localhost:8080/api/products/uploads/products/${product.id}/${img.split('/').pop()}`}
                    alt={`Thumbnail ${index}`}
                    className={`${styles.thumbnail} ${currentImageIndex === index ? styles.activeThumbnail : ""}`}
                    onClick={() => handleThumbnailClick(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 🔥 Ürün Bilgileri */}
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
            {/* 🆕 "Yeni Özellik Ekle" Butonu */}
        {isAdmin && isEditing && (
          <div className={styles.buttonContainer}>
            <button onClick={handleAddNewAttribute} className={styles.addButton}>Yeni Özellik Ekle</button>
          </div>
        )}

        {/* 🆕 "Yeni Özellikleri Kaydet" Butonu */}
        {isAdmin && isEditing && (
          <div className={styles.buttonContainer}>
            <button onClick={handleSaveNewAttributes} className={styles.saveButton}>Yeni Özellikleri Kaydet</button>
          </div>
        )}
        </div>

        {/* 🆕 Yeni Resim Yükleme */}
        {isAdmin && isEditing && (
          <div className={styles.imageUploadContainer}>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} />

            <button onClick={handleUploadImage} className={styles.uploadButton}>Resmi Kaydet</button>
          </div>
        )}

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
        {isAdmin && (
  <div className={styles.buttonContainer}>
    <button onClick={handleDeleteProduct} className={styles.deleteButton}>
      Ürünü Sil
    </button>
  </div>
)}

      </div>
    </div>
  );
};

export default ProductDetailPage;
