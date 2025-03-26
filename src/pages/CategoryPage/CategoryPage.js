import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./CategoryPage.module.css";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [updatedCategoryName, setUpdatedCategoryName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/categories/all");
      setCategories(response.data);
    } catch (error) {
      console.error("Kategoriler alınamadı:", error);
    }
  };

  const handleAddCategory = async () => {
    try {
      await axios.post("http://localhost:8080/api/categories/add", {
        name: newCategoryName,
      });
      setNewCategoryName("");
      fetchCategories();
    } catch (error) {
      console.error("Kategori eklenemedi:", error);
    }
  };

  const handleUpdateCategory = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/categories/update/${id}`, {
        name: updatedCategoryName,
      });
      setEditingCategory(null);
      setUpdatedCategoryName("");
      fetchCategories();
    } catch (error) {
      console.error("Kategori güncellenemedi:", error);
    }
  };

  return (
    <div className={styles.centerWrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Kategori Yönetimi</h2>

        <div className={styles.addSection}>
          <input
            type="text"
            placeholder="Yeni kategori adı"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className={styles.input}
          />
          <button onClick={handleAddCategory} className={styles.button}>Ekle</button>
        </div>

        <table className={styles.categoryTable}>
          <thead>
            <tr>
              <th>Kategori Adı</th>
              <th>Ürün Sayısı</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>
                  {editingCategory === cat.id ? (
                    <input
                      type="text"
                      value={updatedCategoryName}
                      onChange={(e) => setUpdatedCategoryName(e.target.value)}
                      className={styles.input}
                    />
                  ) : (
                    cat.name
                  )}
                </td>
                <td>{cat.productCount}</td>
                <td>
                  {editingCategory === cat.id ? (
                    <>
                      <button onClick={() => handleUpdateCategory(cat.id)} className={styles.button}>Kaydet</button>
                      <button onClick={() => setEditingCategory(null)} className={styles.button}>İptal</button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingCategory(cat.id);
                        setUpdatedCategoryName(cat.name);
                      }}
                      className={styles.button}
                    >
                      Güncelle
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryPage;
