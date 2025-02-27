import React, { useState, useEffect, useRef } from "react";
import AxiosInstance from "../../axios/AxiosInstance";
import styles from "./EditAttributesPanel.module.css";

const EditAttributesPanel = ({ product, closePanel }) => {
  const [attributes, setAttributes] = useState([...product.attributes]);
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

  const handleAttributeChange = (index, field, value) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  const handleAddNewAttribute = () => {
    setAttributes([...attributes, { key: "", value: "" }]);
  };

  // 📌 **Mevcut Özellikleri Güncelle (PUT /products/{id})**
  const handleSaveNewAttributes = () => {
    AxiosInstance.put(`/products/${product.id}`, {
      name: product.name,
      information: product.information,
      code: product.code,
      categoryId: product.categoryId,
      attributes: attributes // Mevcut özellikleri güncelle
    })
      .then(() => {
        alert("Özellikler başarıyla güncellendi!");
        window.location.reload();
        closePanel();
      })
      .catch(() => {
        alert("Özellikler güncellenirken hata oluştu!");
      });
  };

  // 📌 **Yeni Özellik Ekle (POST /products/add-attribute)**
  const handlePostNewAttribute = () => {
    // Yeni eklenen özellikleri filtrele (ID’si olmayanlar yeni eklenmiştir)
    const newAttributes = attributes.filter(attr => !attr.id);

    if (newAttributes.length === 0) {
      alert("Yeni eklenen bir özellik bulunamadı!");
      return;
    }

    newAttributes.forEach(attr => {
      AxiosInstance.post(`/products/add-attribute`, {
        productId: product.id,
        key: attr.key,
        value: attr.value
      })
        .then(() => {
          alert(`"${attr.key}" özelliği başarıyla eklendi!`);
          window.location.reload();
        })
        .catch(() => {
          alert(`"${attr.key}" eklenirken hata oluştu.`);
        });
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.editPanel} ref={panelRef}>
        <h2>Özellikleri Düzenle</h2>

        <div className={styles.tableContainer}>
          <table className={styles.attributesTable}>
            <thead>
              <tr>
                <th>Özellik</th>
                <th>Değer</th>
              </tr>
            </thead>
            <tbody>
              {attributes.map((attr, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={attr.key}
                      onChange={(e) => handleAttributeChange(index, "key", e.target.value)}
                    />
                  </td>
                  <td>
                    <textarea
                      value={attr.value}
                      onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button onClick={handleAddNewAttribute} className={styles.addButton}>Yeni Özellik Ekle</button>
        <div className={styles.buttonContainer}>
          <button onClick={handleSaveNewAttributes} className={styles.saveButton}>Kaydet</button>
          <button onClick={handlePostNewAttribute} className={styles.saveButton}>Yeni Özellikleri Kaydet</button>
          <button onClick={closePanel} className={styles.cancelButton}>İptal</button>
        </div>
      </div>
    </div>
  );
};

export default EditAttributesPanel;
