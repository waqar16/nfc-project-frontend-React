import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../assets/css/index/ScheduleMeetingSection.module.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ScheduleMeetingSection = () => {
  const navigate = useNavigate();
  const [profileType, setProfileType] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({
      duration: 1200,
    });

    const token = localStorage.getItem('authToken');
    const userInfo = async () => {
      if (token) {
        setIsAuthenticated(true);
        try {
          const response = await axios.get('  https://api.onesec.shop/auth/users/me', {
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

  const handleCreateNowButtonClick = () => {
    if (isAuthenticated & profileType === 'individual') {
      navigate(`/digital-profile/${userId}/${username}`);
    }
    else if (isAuthenticated & profileType === 'company') {
      navigate(`/company-card/${userId}/${username}`);
    }
    else if (isAuthenticated & profileType === 'employee') {
      navigate(`/digital-profile/${userId}/${username}`);
    }
    else {
      navigate('/login');
    }
  };

  return (
    <div data-aos="fade-up" className={styles.scheduleMeetingSection}>
      {/* <div className={styles.content}>
          <h2 className={styles.title}>Schedule a Meeting</h2>
          <p className={styles.description}>
            Quickly and easily schedule a meeting with us. Select your preferred date and time, and we'll take care of the rest.
          </p>
          <Link to="/schedule-meeting" className={styles.ctaButton}>Schedule Now</Link>
        </div>
        <div className={styles.calendarPreview}>
          <Calendar
            className={styles.previewCalendar}
          />
        </div> */}
      <div className={styles.content}>
        <h2 className={styles.title}>Unmatched First Impression</h2>
        <p className={styles.description}>
          With your elegant One Sec NFC Digital Cards, Effortlessly manage your personal and professional profiles, update NFC cards, and share digital cards with just a few taps.
        </p>
        <button to="/schedule-meeting" onClick={handleCreateNowButtonClick} className={styles.ctaButton}>Create Now</button>
      </div>
    </div>
  );
};

export default ScheduleMeetingSection;