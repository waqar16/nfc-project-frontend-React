import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from '../../assets/css/profiles/NfcCard.module.css';
import logo from '../../assets/img/logo.png';
import Sidebar from '../sidebar/Sidebar';
import { useParams, useNavigate } from 'react-router-dom';

const NfcCard = () => {
  const { userId, username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    isActive: true, 
  });

  // State to manage the feature status
  const [featureUnderDevelopment] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userResponse = await axios.get('http://localhost:8000/auth/users/me/', {
        headers: {
          Authorization: `Token ${token}`
        }
      });

      const { id, first_name, last_name, profile_type, username: authenticatedUsername } = userResponse.data;

      if (profile_type !== localStorage.getItem('profile_type') || userId !== id.toString() || username !== authenticatedUsername) {
        console.log(`UserId from URL: ${userId}, User ID: ${id}`);
        navigate('/not-authorized');
      } else {
        setUser({
          firstName: first_name,
          lastName: last_name,
          isActive: true, 
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [navigate, userId, username]);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchUserData();
  }, [fetchUserData]); 

  return (
    <div className={styles.nfcContainer}>
      <Sidebar profileType={localStorage.getItem('profile_type')} />
      {featureUnderDevelopment && (
          <div className={styles.comingSoonBanner}>
            <p className={styles.comingSoonText}>Feature Under Development - Coming Soon!</p>
          </div>
        )}
      <div className={styles.card}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <div className={styles.userInfo}>
          <p className={styles.name}>{`${user.firstName} ${user.lastName}`}</p>
          <div className={`${styles.statusIndicator} ${user.isActive ? styles.active : styles.notActive}`}>
            {user.isActive ? 'Active' : 'Not Active'}
          </div>
        </div>
        <div className={styles.wifiIcon}>
          <i className="ri-wifi-line"></i>
        </div>
      </div>
    </div>
  );
};

export default NfcCard;
