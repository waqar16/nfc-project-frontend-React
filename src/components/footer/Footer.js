import React from 'react';
import styles from '../../assets/css/index/Footer.module.css';
import Logo from '../../assets/img/logo.png';
import { Link } from 'react-router-dom';

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
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">
              Home
            </Link></li>
            <li><Link to="/about-us">
              About us
            </Link></li>
          </ul>
        </div>
        <div className={styles.offices}>
          <h3>Quick Actions</h3>
          <ul>
          <li><Link to="/faqs">
              FAQs
            </Link></li>
            <li><Link to="/terms-and-conditions">
              Terms and Conditions
            </Link></li>
          </ul>
        </div>
        {/* <div className={styles.offices}>
          <h3>Offices</h3>
          <ul>
            <li>Karachi</li>
            <li>Lahore</li>
            <li>Islamabad</li>
            <li>Rawalpindi</li>
            <li>Kharian</li>
          </ul>
        </div> */}
        <div className={styles.followOneclick}>
          <h3>Follow One Sec</h3>
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
        <p>© 2024 by One Sec. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
