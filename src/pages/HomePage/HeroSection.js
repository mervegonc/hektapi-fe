import React from "react";
import styles from "./HeroSection.module.css";
import heroImage from "../../assets/images/hero.jpg";

const HeroSection = () => {
  return (
    <header className={styles.hero}>
      <img src={heroImage} alt="" className={styles.heroImage} />
      <div className={styles.heroContent}>
    
        <p>
    
        </p>
        <a href="/product" className={styles.ctaButton}>Keşfet</a>
      </div>
    </header>
  );
};

export default HeroSection;
