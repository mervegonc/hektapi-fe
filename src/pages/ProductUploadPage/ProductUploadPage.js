import React, { useState, useEffect } from "react";
import axios from "../../axios/AxiosInstance"; // Token'i ekleyen axios instance

import styles from "./ProductUploadPage.module.css";

const ProductUploadPage = () => {
  const [product, setProduct] = useState({
    name: "",
    information: "",
    code: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]);
  const [attributes, setAttributes] = useState([{ key: "", value: "" }]);

  // 📌 1️⃣ Kategorileri yükle
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories/all");
        setCategories(response.data);
      } catch (error) {
        console.error("Kategoriler yüklenirken hata oluştu!", error);
      }
    };
    fetchCategories();
  }, []);

  // 📌 2️⃣ Kullanıcının girdiği değerleri state'e kaydet
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // 📌 3️⃣ Kullanıcının seçtiği kategori ID'sini kaydet
  const handleCategoryChange = (e) => {
    setProduct({ ...product, categoryId: e.target.value });
  };

  // 📌 4️⃣ Dosya seçildiğinde listeye ekle
  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  // 📌 5️⃣ Özellikleri güncelle
  const handleAttributeChange = (index, field, value) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  // 📌 6️⃣ Yeni özellik ekle
  const addAttributeField = () => {
    setAttributes([...attributes, { key: "", value: "" }]);
  };

  // 📌 7️⃣ Özelliği sil
  const removeAttributeField = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
  
    // ✅ JSON olarak `product` ekleyelim
    const productData = {
      name: product.name,
      information: product.information,
      code: product.code,
      categoryId: product.categoryId,
      attributes: attributes
    };
  
    formData.append("product", new Blob([JSON.stringify(productData)], { type: "application/json" }));
  
    // ✅ Dosyaları ekleyelim
    files.forEach((file) => {
      formData.append("files", file);
    });
  
    try {
      const response = await axios.post("/products/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
  
      console.log("✅ Ürün başarıyla yüklendi:", response.data);
      alert("✅ Ürün başarıyla eklendi!");
    } catch (error) {
      console.error("🚨 Ürün yükleme hatası:", error.response?.data || error.message);
      alert("❌ Ürün yüklenirken hata oluştu!");
    }
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Ürün Yükleme Sayfası</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder="Ürün Adı"
            value={product.name}
            onChange={handleChange}
            required
          />
          <input
            className={styles.input}
            type="text"
            name="information"
            placeholder="Bilgi"
            value={product.information}
            onChange={handleChange}
            required
          />
          <input
            className={styles.input}
            type="text"
            name="code"
            placeholder="Ürün Kodu"
            value={product.code}
            onChange={handleChange}
            required
          />
  
          <select
            className={styles.select}
            name="categoryId"
            value={product.categoryId}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Kategori Seçin</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
  
          <h3>Ürün Özellikleri</h3>
          {attributes.map((attr, index) => (
            <div className={styles.attributeContainer} key={index}>
              <input
                className={styles.attributeInput}
                type="text"
                placeholder="Özellik Adı"
                value={attr.key}
                onChange={(e) => handleAttributeChange(index, "key", e.target.value)}
                required
              />
              <input
                className={styles.attributeInput}
                type="text"
                placeholder="Özellik Değeri"
                value={attr.value}
                onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                required
              />
              <button
                className={styles.removeButton}
                type="button"
                onClick={() => removeAttributeField(index)}
              >
                Sil
              </button>
            </div>
          ))}
          <button
            className={styles.addButton}
            type="button"
            onClick={addAttributeField}
          >
            + Özellik Ekle
          </button>
  
          <input
            className={styles.fileInput}
            type="file"
            multiple
            onChange={handleFileChange}
          />
  
          <button className={styles.submitButton} type="submit">
            Ürünü Yükle
          </button>
        </form>
      </div>
    </div>
  );
  
};

export default ProductUploadPage;
