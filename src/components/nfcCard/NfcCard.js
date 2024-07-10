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
    profilePic: 'https://via.placeholder.com/150', // Placeholder image URL
    isActive: true, // Mock status indicator, replace with actual logic
  });

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userResponse = await axios.get('http://127.0.0.1:8000/auth/users/me/', {
        headers: {
          Authorization: `Token ${token}`
        }
      });

      const { id, first_name, last_name, profile_type, username: authenticatedUsername } = userResponse.data;

      if (profile_type !== 'individual' || userId !== id.toString() || username !== authenticatedUsername) {
        console.log(`UserId from URL: ${userId}, User ID: ${id}`);
        navigate('/not-authorized');
      } else {
        setUser({
          firstName: first_name,
          lastName: last_name,
          profilePic: 'https://via.placeholder.com/150', // Placeholder for profile pic, replace with actual URL if available
          isActive: true, // Mock status indicator, replace with actual logic
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle errors, e.g., redirect to login page or show error message
    }
  }, [navigate, userId, username]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]); // Only re-run the effect if fetchUserData changes

  return (
    <div className={styles.nfcContainer}>
      <Sidebar profileType="individual" />
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
