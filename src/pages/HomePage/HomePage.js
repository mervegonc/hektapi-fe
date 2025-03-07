import React from "react";
import styles from "./HomePage.module.css";
import HeroSection from "./HeroSection";

const HomePage = () => {
  return (
    <div className={styles.container}>
      
      <HeroSection />

      {/* İçerik Bölümü */}
      <section className={styles.content}>
        <p>
         
      
        </p>
      </section>
    </div>
  );
};

export default HomePage;
