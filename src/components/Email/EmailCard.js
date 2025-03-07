import React, { useState } from "react";
import styles from "./EmailCard.module.css";
import AxiosInstance from "../../axios/AxiosInstance";

const EmailCard = ({ productName, productCode }) => {
  const [userEmail, setUserEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSendEmail = async () => {
    if (!userEmail || !subject || !message) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }

    try {
      await AxiosInstance.post("/email/send", {
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
