import React, { useState } from "react";
import styles from "./EmailCard.module.css";
import axios from "axios"; // Axios kullanmaya devam

const EmailCard = ({ productName, productCode, onClose }) => {
  const [userEmail, setUserEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Başarı mesajını gösterme state'i
  const [loading, setLoading] = useState(false); // E-posta gönderimi sırasında butonu devre dışı bırakmak için
  const [disabled, setDisabled] = useState(false); // Butonun yeniden aktif edilmesini engellemek

  const handleSendEmail = async () => {
    if (!userEmail || !subject || !message) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }

    // Geçerli email kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      alert("Lütfen geçerli bir e-posta adresi girin!");
      return;
    }

    setLoading(true); // E-posta gönderim işlemi başlatıldığında loading'i true yap
    setDisabled(true); // Butonu devre dışı bırak

    try {
      await axios.post("http://localhost:8080/api/email/send", {
        userEmail,
        subject,
        message,
        productName,
        productCode,
      });

      setSuccessMessage("E-posta başarıyla gönderildi!"); // Başarı mesajını set et
      setUserEmail("");
      setSubject("");
      setMessage("");
      
      setTimeout(() => {
        onClose?.(); // 2 saniye sonra kapanması için
      }, 2000); 

    } catch (error) {
      console.error("E-posta gönderme hatası:", error);
      alert("E-posta gönderilirken hata oluştu!");
    } finally {
      setLoading(false); // E-posta gönderme işlemi tamamlandığında loading'i false yap
      setDisabled(false); // Butonu yeniden aktif et
    }
  };

  return (
    <div className={styles.emailCard}>
      {/* Başarı mesajı */}
      {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

      <h3>{productName} için bilgi al</h3>
      <p><strong>Ürün Kodu:</strong> {productCode}</p>

      <input
        type="email"
        placeholder="E-posta adresiniz"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
      />
      
      <input
        type="text"
        placeholder="Konu"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <textarea
        placeholder="Mesajınızı yazın..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button 
        onClick={handleSendEmail} 
        disabled={disabled} // Buton devre dışı bırakıldı
      >
        {loading ? "Gönderiliyor..." : "Gönder"} {/* Loading durumu */}
      </button>
    </div>
  );
};

export default EmailCard;
