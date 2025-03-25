import React, { useState } from "react";
import styles from "./EmailCard.module.css";
import axios from "axios"; // 🔴 AxiosInstance yerine doğrudan axios kullanacağız!

const EmailCard = ({ productName, productCode, onClose  }) => {
  const [userEmail, setUserEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

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
  
    try {
      await axios.post("http://localhost:8080/api/email/send", {
        userEmail,
        subject,
        message,
        productName,
        productCode,
      });

      alert("E-posta başarıyla gönderildi!");
      setUserEmail("");
      setSubject("");
      setMessage("");
      onClose?.(); // 👈 gönderildikten sonra paneli kapat
    } catch (error) {
      console.error("E-posta gönderme hatası:", error);
      alert("E-posta gönderilirken hata oluştu!");
    }
  };
  

  return (
    <div className={styles.emailCard}>
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

      <button onClick={handleSendEmail}>Gönder</button>
    </div>
  );
};

export default EmailCard;
