import React from 'react';
import styles from '../../assets/css/About/AboutUs.module.css';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AboutUs = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({
      duration: 1200,
    });
  }, []);

  return (
    <div data-aos="fade-left" className={styles.aboutUs}>
      <h2 className={styles.aboutUs__title}>About Onesec</h2>
      <p className={styles.aboutUs__intro}>
        At Onesec, we are passionate about revolutionizing the way you connect, share, and manage information with cutting-edge digital NFC (Near Field Communication) technology. Our mission is to provide instant and innovative solutions through digital NFC cards that enhance your personal and professional interactions.
      </p>

      <div className={styles.aboutUs__section}>
        <h3 className={styles.aboutUs__subtitle}>Our Solution Provides:</h3>
        <ul className={styles.aboutUs__list}>
          <li>Instant Contact Sharing: Transmits contact information directly to smartphones with a simple tap, ensuring immediate and accurate transfer.</li>
          <li>Environmentally Friendly: Reduces the need for paper, making it a sustainable alternative to traditional business cards.</li>
          <li>Enhanced Interaction: Can include links to social profiles, portfolios, websites, and more, providing a richer networking experience.</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutUs;
