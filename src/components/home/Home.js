import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../assets/css/index/Home.module.css';
import main from '../../assets/img/banner.png';

const Home = () => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');

  const handleCompanyButtonClick = () => {
    if (authToken) {
      navigate('/company-signup'); // Change this to your company's profile route
    } else {
      navigate('/company-signup');
    }
  };

  const handleIndividualButtonClick = () => {
    if (authToken) {
      navigate('/personal-signup'); // Change this to your individual's profile route
    } else {
      navigate('/personal-signup');
    }
  };

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Revolutionize Your Business Cards</h1>
          <p>Our innovative NFC Business Card platform helps you manage profiles, write information to NFC cards, and schedule appointments seamlessly. Say goodbye to traditional business cards and embrace the future.</p>
          <div className={styles.btnDiv}>
            <button className={styles.ctaButton1} onClick={handleCompanyButtonClick}>
              For Company <i className="ri-arrow-right-line"></i>
            </button>
            <button className={styles.ctaButton2} onClick={handleIndividualButtonClick}>
              For Individual <i className="ri-arrow-right-line"></i>
            </button>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img src={main} alt="NFC Card app mock" />
        </div>
      </section>
    </div>
  );
};

export default Home;
