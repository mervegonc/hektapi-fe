import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Filter.module.css";
import { SlidersHorizontal } from "lucide-react"; // 🔧 Filtre ikonu

const Filter = ({ onFilter, defaultCategory }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(defaultCategory || "");
  
    useEffect(() => {
      axios
        .get("http://localhost:8080/api/categories/all")
        .then((res) => setCategories(res.data))
        .catch((err) => console.error("Kategori getirme hatası:", err));
    }, []);
  
    useEffect(() => {
      if (defaultCategory) {
        setSelectedCategory(defaultCategory);
      }
    }, [defaultCategory]);
  
    const handleChange = (e) => {
      const categoryId = e.target.value;
      setSelectedCategory(categoryId);
      onFilter(categoryId);
    };
  
    return (
      <div className={styles.filterContainer}>
   
        <select
          value={selectedCategory}
          onChange={handleChange}
          className={styles.selectBox}
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
    );
  };
  

export default Filter;
