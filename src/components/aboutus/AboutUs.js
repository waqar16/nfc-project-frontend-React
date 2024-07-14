import React from 'react';
import styles from '../../assets/css/About/AboutUs.module.css';
import { useEffect } from 'react';

const AboutUs = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className={styles.aboutUs}>
      <h2 className={styles.aboutUs__title}>About Us</h2>
      <p className={styles.aboutUs__intro}>
        Welcome to our platform! We provide an innovative solution for managing profiles, writing information to NFC cards, and scheduling appointments seamlessly. Our platform is designed to support multiple organizations under a white-label model.
      </p>
      
      <div className={styles.aboutUs__section}>
        <h3 className={styles.aboutUs__subtitle}>Our Mission</h3>
        <p>
          Our mission is to empower businesses and individuals by providing them with cutting-edge tools to manage their profiles and appointments efficiently. We aim to streamline processes and enhance productivity through our user-friendly platform.
        </p>
      </div>
      
      <div className={styles.aboutUs__section}>
        <h3 className={styles.aboutUs__subtitle}>Our Vision</h3>
        <p>
          We envision a world where technology seamlessly integrates into everyday business operations, simplifying tasks and creating new opportunities for growth. Our goal is to be a leading provider of NFC technology solutions globally.
        </p>
      </div>
      
      <div className={styles.aboutUs__section}>
        <h3 className={styles.aboutUs__subtitle}>Our Values</h3>
        <ul className={styles.aboutUs__list}>
          <li>Innovation: We are committed to continuous innovation and improvement.</li>
          <li>Customer Focus: Our customers are at the heart of everything we do.</li>
          <li>Integrity: We conduct our business with integrity and transparency.</li>
          <li>Collaboration: We believe in the power of collaboration and teamwork.</li>
          <li>Excellence: We strive for excellence in all our endeavors.</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutUs;
