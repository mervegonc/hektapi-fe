import React, { useState } from "react";
import axios from "axios"; // AxiosInstance yerine axios kullanıyoruz
import { TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "./AuthPage.module.css";


const AuthPage = () => {
  const [page, setPage] = useState("signin"); // "signin" veya "signup"
  const [formData, setFormData] = useState({
    username: "", // Kullanıcı adı (signup için gerekli)
    email: "", // Email (signup ve signin için gerekli)
    password: "", // Şifre
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Input değişimini yönet
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
  
    try {
      if (page === "signin") {
        // 🔐 Giriş işlemi
        const response = await axios.post("http://localhost:8080/api/auth/signin", {
          usernameOrEmail: formData.email,
          password: formData.password,
        });
    
        if (response.status === 200 && response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userId", response.data.userId);
        
          if (response.data.roles?.includes("ROLE_ADMIN")) {
            localStorage.setItem("role", "ROLE_ADMIN");
          } else {
            localStorage.setItem("role", "USER");
          }
          
          
          // 🧠 Bu event App.js içindeki dinleyiciyi tetikliyor
          window.dispatchEvent(new Event("loginSuccess"));
          navigate("/");
   
      
        }
        
      
    
        
        
      } else {
        // 🆕 Kayıt işlemi
        const response = await axios.post("http://localhost:8080/api/auth/signup", {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
  
        if (response.status === 201) {
          setSuccessMessage("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
          setPage("signin");
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Yetkisiz erişim! Kullanıcı adı veya şifre hatalı.");
      } else if (err.response && err.response.status === 409) {
        setError("Bu kullanıcı adı zaten kullanılıyor.");
      } else {
        setError("Sunucu hatası. Lütfen tekrar deneyin.");
      }
    }
  };
  

  return (
    <div>
      
      <div className={styles.authContainer}>
        <Paper elevation={5} className={styles.authPaper}>
          <Typography className={styles.authTitle}>
            {page === "signup" ? "Kayıt Ol" : "Giriş Yap"}
          </Typography>

          <form onSubmit={handleSubmit} className={styles.authForm}>
            {page === "signup" && (
              <TextField
                fullWidth
                label="Kullanıcı Adı"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={styles.inputField}
                required
              />
            )}

            <TextField
              fullWidth
              label="E-posta"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.inputField}
              required
            />

            <TextField
              fullWidth
              label="Şifre"
              name="password"
              type="text"
              value={formData.password}
              onChange={handleChange}
              className={styles.inputField}
              required
            />

            <Button type="submit" variant="contained" className={styles.submitButton} fullWidth>
              {page === "signup" ? "Kayıt Ol" : "Giriş Yap"}
            </Button>

            {error && <Typography className={styles.errorMessage}>{error}</Typography>}
            {successMessage && <Typography className={styles.successMessage}>{successMessage}</Typography>}

            <div className={styles.authSwitchContainer}>
              <Typography>
                {page === "signup" ? "Zaten bir hesabın var mı?" : "Hesabın yok mu?"} {" "}
                <Button
                  className={styles.authSwitchButton}
                  onClick={() => setPage(page === "signup" ? "signin" : "signup")}
                >
                  {page === "signup" ? "Giriş Yap" : "Ücretsiz Kayıt Ol"}
                </Button>
              </Typography>
            </div>
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default AuthPage;
