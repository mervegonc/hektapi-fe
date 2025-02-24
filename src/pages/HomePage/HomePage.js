import React from "react";
import styles from "./HomePage.module.css";
import HeroSection from "./HeroSection";
import Navbar from "../../components/Navbar/Navbar"
const HomePage = () => {
  return (
    <div className={styles.container}>
      <Navbar />
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
