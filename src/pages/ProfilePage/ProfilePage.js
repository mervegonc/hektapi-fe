import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Box, Typography, Paper, Avatar, CircularProgress, TextField, Button 
} from "@mui/material";
import { useParams,useNavigate  } from "react-router-dom";

import styles from "./ProfilePage.module.css";

const ProfilePage = () => {
  const { userId } = useParams(); // URL'den userId'yi al
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    education: "",
    homeAddress: "",
    previousExperience: "",
    phoneNumber: "",
    linkedinProfile: "",
    skills: "",
    maritalStatus: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    dateOfBirth: "",
    nationality: "",
  });
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/details/${userId}`);
        if (response.data) {
          setUserDetails(response.data);
          setFormData(response.data);
  
          if (response.data.roles && response.data.roles.includes("ROLE_ADMIN")) {
            localStorage.setItem("role", "ROLE_ADMIN");
          } else {
            localStorage.setItem("role", "USER");
          }
        }
      } catch (error) {
        console.error("Kullanıcı bilgileri alınırken hata oluştu", error);
        // ❗ Eğer backend 401 dönerse login ekranına yönlendir
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserDetails();
  }, [userId, navigate]);
  


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("storage")); // 🔥 Navbar'ı tetikler
                   // Session da temizlendi
    window.location.href = "/";               // Ana sayfaya yönlendirme (navigate yerine bu daha kesin)
  };
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      if (userDetails) {
        // Güncelleme işlemi (PUT)
        await axios.put(`http://localhost:8080/api/user/details`, { userId, ...formData });
        alert("Bilgiler başarıyla güncellendi!");
      } else {
        // Yeni detay ekleme (POST)
        await axios.post(`http://localhost:8080/api/user/details`, { userId, ...formData });
        alert("Bilgiler başarıyla eklendi!");
      }
      window.location.reload(); // Sayfayı yenileyerek güncellenen veriyi göster
    } catch (error) {
      console.error("İşlem sırasında hata oluştu", error);
      alert("Bilgileri kaydederken hata oluştu.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Kullanıcı bilgilerini silmek istediğinize emin misiniz?")) {
      try {
        await axios.delete(`http://localhost:8080/api/user/details/${userId}`);
        setUserDetails(null);
        setFormData({
          education: "",
          homeAddress: "",
          previousExperience: "",
          phoneNumber: "",
          linkedinProfile: "",
          skills: "",
          maritalStatus: "",
          emergencyContactName: "",
          emergencyContactPhone: "",
          dateOfBirth: "",
          nationality: "",
        });
        alert("Bilgiler başarıyla silindi!");
      } catch (error) {
        console.error("Silme işlemi sırasında hata oluştu", error);
        alert("Bilgileri silerken hata oluştu.");
      }
    }
  };

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      
      <Box className={styles.profileContainer}>
        <Paper elevation={5} className={styles.profileCard}>
          <Avatar src={"/default-profile.png"} className={styles.avatar} />
          <Typography variant="h5" className={styles.username}>
            {userDetails ? userDetails.fullName : "Kullanıcı Adı"}
          </Typography>
          <Typography variant="body1" className={styles.email}>
            {userDetails ? userDetails.email : "E-posta adresi"}
          </Typography>
          <TextField
  label="Rol"
  value={userDetails?.roles?.join(", ") || "Bilinmiyor"}
  fullWidth
  margin="normal"
  inputProps={{
    readOnly: true, 
  }}
  variant="outlined" 
/>

          {/* Kullanıcı Detaylarını Düzenleme Formu */}
          <Box className={styles.formContainer}>
            <TextField
              label="Eğitim"
              name="education"
              value={formData.education}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Adres"
              name="homeAddress"
              value={formData.homeAddress}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Önceki Deneyim"
              name="previousExperience"
              value={formData.previousExperience}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Telefon Numarası"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="LinkedIn Profili"
              name="linkedinProfile"
              value={formData.linkedinProfile}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Yetenekler"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Medeni Durum"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Acil Durum Kişisi"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Acil Durum Telefonu"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Doğum Tarihi"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Uyruk"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            {/* Butonlar */}
            <Box className={styles.buttonContainer}>
              <Button variant="contained" color="primary" onClick={handleSave}>
                {userDetails ? "Güncelle" : "Kaydet"}
              </Button>
              {userDetails && (
                <Button variant="outlined" color="secondary" onClick={handleDelete}>
                  Sil
                </Button>
                
              )}
                 <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            Çıkış Yap
          </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </div>
  );
};

export default ProfilePage;
