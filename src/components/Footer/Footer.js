import React from "react";
import styles from "./Footer.model.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>&copy; {new Date().getFullYear()} Tüm Hakları Saklıdır.</p>
        <div className={styles.links}>
          <a href="/about">Hakkımızda</a>
          <a href="/contact">İletişim</a>
          <a href="/privacy">Gizlilik Politikası</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
