import React from 'react';
import styles from '../../assets/css/Footer.module.css';
import Logo from '../../assets/img/logo.png';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerImg}>
        <img src={Logo} alt="Logo" className="nav__logo" />
      </div>

      <div className={styles.footerContent}>
        <div className={styles.footerText}>
          <p>Our innovative NFC Business Card platform helps you manage profiles, write information to NFC cards, and schedule appointments seamlessly.</p>
        </div>
        <div className={styles.offices}>
          <h3>Offices</h3>
          <ul>
            <li>Salzburg</li>
            <li>New York City</li>
            <li>Copenhagen</li>
            <li>Sydney</li>
            <li>Berlin</li>
          </ul>
        </div>
        <div className={styles.offices}>
          <h3>Offices</h3>
          <ul>
            <li>Salzburg</li>
            <li>New York City</li>
            <li>Copenhagen</li>
            <li>Sydney</li>
            <li>Berlin</li>
          </ul>
        </div>
        <div className={styles.offices}>
          <h3>Offices</h3>
          <ul>
            <li>Salzburg</li>
            <li>New York City</li>
            <li>Copenhagen</li>
            <li>Sydney</li>
            <li>Berlin</li>
          </ul>
        </div>
        <div className={styles.followOneclick}>
          <h3>Follow One Click</h3>
          <ul>
            <li><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><i className="ri-facebook-line"></i></a></li>
            <li><a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><i className="ri-instagram-line"></i></a></li>
            <li><a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"><i className="ri-linkedin-line"></i></a></li>
          </ul>
        </div>
      </div>
      {/* <div className={styles.footerInstagram}>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          Check our Instagram
        </a>
      </div> */}
      <div className={styles.footerOuter}>
        <p>© 2024 by One Click. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
