    import React, { useState } from "react";
    import axios from "axios";
    import styles from "./Search.module.css";
    import { useNavigate } from "react-router-dom";
    const Search = () => {
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState([]);
    const navigate = useNavigate();
    const handleSearch = async () => {
        try {
        const response = await axios.get(`http://localhost:8080/api/categories/search?keyword=${keyword}`);
        setResults(response.data);
        } catch (error) {
        console.error("Arama hatası:", error);
        }
    };

    return (
        <div className={styles.searchContainer}>
        <input
            type="text"
            placeholder="Kategori ara..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton}>Ara</button>

        <div className={styles.resultList}>
        {results.map((cat) => (
    <div 
        key={cat.id} 
        className={styles.resultItem} 
        onClick={() => navigate(`/product?category=${cat.id}`)} 
        style={{ cursor: "pointer" }}
    >
        {cat.name}
    </div>
    ))}

        </div>
        </div>
    );
    };

    export default Search;
