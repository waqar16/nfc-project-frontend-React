import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../sidebar/Sidebar';
import styles from '../../assets/css/profiles/DigitalProfile.module.css';

const DigitalProfile = () => {
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    profilePic: 'https://via.placeholder.com/150', // Example placeholder image URL
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

      const { first_name, last_name, email } = response.data;

      // Fetch the profile data if exists
      const profileResponse = await axios.get(`http://127.0.0.1:8000/api/profiles/${response.data.id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const profileData = profileResponse.data;

      setUser({
        firstname: first_name,
        lastname: last_name,
        email: email,
        phone: profileData.phone || '',
        address: profileData.address || '',
        bio: profileData.bio || '',
        facebook: profileData.facebook || '',
        instagram: profileData.instagram || '',
        linkedin: profileData.linkedin || '',
        profilePic: profileData.profilePic || 'https://via.placeholder.com/150',
      });

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleShareToCard = () => {
    // Implement share to digital card functionality
    console.log('Shared to digital card');
  };

  const handleWriteToNFC = () => {
    // Implement write to NFC functionality
    console.log('Written to NFC');
  };

  return (
    <>
      <div className={styles.digitalProfileContainer}>
      <Sidebar profileType="individual" />
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <img src={user.profilePic} alt="Profile" className={styles.profilePic} />
            <div className={styles.name}>{`${user.firstname} ${user.lastname}`}</div>
            <div className={styles.contactInfo}>
              <p><i className="ri-mail-fill"></i> {user.email}</p>
              <p><i className="ri-phone-fill"></i> {user.phone}</p>
              <p><i className="ri-map-pin-fill"></i> {user.address}</p>
            </div>
          </div>
          <div className={styles.profileBody}>
            <p className={styles.bio}>{user.bio}</p>
            <div className={styles.socialIcons}>
              {user.facebook && (
                <a href={user.facebook} target="_blank" rel="noopener noreferrer">
                  <i className="ri-facebook-circle-fill"></i>
                </a>
              )}
              {user.instagram && (
                <a href={user.instagram} target="_blank" rel="noopener noreferrer">
                  <i className="ri-instagram-fill"></i>
                </a>
              )}
              {user.linkedin && (
                <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
                  <i className="ri-linkedin-box-fill"></i>
                </a>
              )}
            </div>
          </div>
        </div>
        <div className={styles.cardActions}>
  <button onClick={handleShareToCard} className={styles.actionButton}>
    <i className="ri-share-forward-line"></i> <span>Share Profile</span>
  </button>
  <button onClick={handleWriteToNFC} className={styles.actionButton}>
    <i className="ri-wifi-line"></i> <span>Write to NFC</span>
  </button>
</div>
      </div>
    </>
  );
};

export default DigitalProfile;
