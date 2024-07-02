import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../assets/css/profiles/NfcCard.module.css';
import logo from '../../assets/img/logo.png';
import Sidebar from '../sidebar/Sidebar';

const NfcCard = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    profilePic: 'https://via.placeholder.com/150', // Placeholder image URL
    isActive: true, // Mock status indicator, replace with actual logic
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://127.0.0.1:8000/auth/users/me/', {
        headers: {
          Authorization: `Token ${token}`
        }
      });

      const { first_name, last_name } = response.data;
      setUser({
        firstName: first_name,
        lastName: last_name,
        profilePic: 'https://via.placeholder.com/150', // Placeholder for profile pic, replace with actual URL if available
        isActive: true, // Mock status indicator, replace with actual logic
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <div className={styles.nfcContainer}>
      <Sidebar profileType="individual" />
      {/* <h4 className={styles.nfcTitle}>NFC Card</h4> */}
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
