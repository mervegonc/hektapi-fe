import React from 'react';
import './WhatWeOffer.model.css'; // Eğer stil dosyanız varsa buraya dahil edebilirsiniz
import scannerVideo from '../../assets/videos/scanner.mp4'; // Videoları doğru şekilde alıyoruz
import printerVideo from '../../assets/videos/printer.mp4';

const WhatWeOffer = () => {
  return (
    <div className="whatWeOffer">
      <h1>Hizmetlerimiz</h1>
      <div className="service">
        <h2>3D Scanner</h2>
        <div className="video-container">
          <video width="100%" height="auto" controls>
            <source src={scannerVideo} type="video/mp4" />
            Tarayıcı videonuzu izleyin.
          </video>
        </div>
        <p>
          3D tarayıcılarımız ile yüksek hassasiyetli dijital modeller oluşturabilirsiniz. Yüksek çözünürlükte tarama yaparak,
          nesnelerin üç boyutlu verilerini kolayca elde edebilirsiniz.
        </p>
      </div>

      <div className="service">
        <h2>3D Printer</h2>
        <div className="video-container">
          <video width="100%" height="auto" controls>
            <source src={printerVideo} type="video/mp4" />
            Yazıcı videonuzu izleyin.
          </video>
        </div>
        <p>
          3D yazıcılarımız, tasarımlarınızı fiziksel modellere dönüştürmek için idealdir. Yüksek hassasiyetli baskılarla
          projelerinizi hızlıca üretin.
        </p>
      </div>
    </div>
  );
};

export default WhatWeOffer;
