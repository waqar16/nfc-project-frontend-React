import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../assets/css/index/Home.module.css';
import main from '../../assets/img/banner.png';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [profileType, setProfileType] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const token = localStorage.getItem('authToken');
    const userInfo = async () => {
      if (token) {
        setIsAuthenticated(true);
        try {
          const response = await axios.get('http://127.0.0.1:8000auth/users/me', {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          setProfileType(response.data.profile_type);
          setUserId(response.data.id);
          setUsername(response.data.username)

        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    };

    userInfo();
  }, []);

  const handleCompanyButtonClick = () => {
    if (isAuthenticated & profileType === 'company') {
      navigate(`/company-profile/${userId}/${username}`);
    } else {
      navigate('/signup');
    }
  };

  const handleIndividualButtonClick = () => {
    if (isAuthenticated & profileType === 'individual') {
      navigate(`/user-profile/${userId}/${username}`);
    } else {
      navigate('/signup');
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
