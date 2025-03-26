import React from "react";
import styles from "./HomePage.module.css";
import HeroSection from "./HeroSection";

const HomePage = () => {
  return (
    <div className={styles.container}>
      
      <HeroSection />

      {/* İçerik Bölümü */}
      <section className={styles.content}>
        <h2>Vizyon ve Misyon</h2>
        <div className={styles.visionMission}>
          <div className={styles.vision}>
            <h3>Vizyon:</h3>
            <p>
              Mühendislik, danışmanlık ve Ar-Ge alanlarında öncü bir marka olarak,
              test cihazları sektöründe yenilikçi ve güvenilir çözümler sunmak.
              Teknolojik gelişmeleri yakından takip ederek, kalite ve hassasiyet konusunda
              sektörde referans noktası olmak.
            </p>
          </div>
          <div className={styles.mission}>
            <h3>Misyon:</h3>
            <p>
              Müşterilerimize mühendislik, danışmanlık ve Ar-Ge destekli, hassas ve güvenilir
              test cihazları sunarak kalite kontrol süreçlerini optimize etmek. Yenilikçi çözümler
              ve sürdürülebilir teknolojiler geliştirerek sektöre değer katmak. Müşteri memnuniyetini
              en üst seviyeye çıkaracak, çevreye duyarlı ve ileri teknolojiye sahip ürünler üretmek.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
