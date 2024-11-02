import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../assets/css/index/Home.module.css';
import main from '../../assets/img/banner.png';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const location = useLocation();
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const [profileType, setProfileType] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchQueryParams = () => {
      const params = new URLSearchParams(location.search);
      const statusParam = params.get('status'); // Get the 'status' parameter
      if (statusParam) {
        setStatus(statusParam);
        if (statusParam === 'success') {
          toast.success('Successfull');
        } else if (statusParam === 'failed') {
          toast.error('Error Scheduling Meeting. Please try again.');
        }
      }
    };

    fetchQueryParams();
    window.scrollTo(0, 0);
    AOS.init({
      duration: 1200,
    });

    const token = localStorage.getItem('authToken');
    const userInfo = async () => {
      if (token) {
        setIsAuthenticated(true);
        try {
          const response = await axios.get('https://api.onesec.shop/auth/users/me', {
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
  }, [location.search]);

  const handleCompanyButtonClick = () => {
    if (isAuthenticated & profileType === 'company') {
      navigate(`/company-profile/${userId}/${username}`);
    } else {
      navigate('/signup?company=true');
    }
  };

  const handleIndividualButtonClick = () => {
    if (isAuthenticated & profileType === 'individual') {
      navigate(`/user-profile/${userId}/${username}`);
    } else {
      navigate('/signup?individual=true');
    }
  };

  return (
    <div className={styles.home}>
    <ToastContainer />
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 data-aos="fade-left">Revolutionize Networking with NFC Business and Digital Cards</h1>
          <p data-aos="fade-up">
            Our NFC Eco System simplifies professional networking by helping you manage profiles, write to NFC cards, share digital cards, and schedule appointments effortlessly. Leave traditional business cards behind and embrace a smarter future.
          </p>          <div className={styles.btnDiv}>
            <button className={styles.ctaButton1} onClick={handleCompanyButtonClick}>
              For Company <i className="ri-arrow-right-line"></i>
            </button>
            <button className={styles.ctaButton2} onClick={handleIndividualButtonClick}>
              For Individual <i className="ri-arrow-right-line"></i>
            </button>
          </div>
        </div>
        <div data-aos="fade-down" className={styles.heroImage}>
          <img src={main} alt="NFC Card app mock" />
        </div>
      </section>
    </div>
  );
};

export default Home;
