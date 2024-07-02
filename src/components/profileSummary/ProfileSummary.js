import React, { useState, useEffect } from 'react';
import styles from '../../assets/css/profiles/ProfileSummary.module.css';
import Sidebar from '../sidebar/Sidebar';
import axios from 'axios';

const ProfileSummary = () => {
  const [user, setUser] = useState({
    profilePic: 'https://via.placeholder.com/150', // Example placeholder image URL
    fullName: '',
    username: '',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac velit vel libero efficitur sagittis.'
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://127.0.0.1:8000/auth/users/me/', {
          headers: {
            Authorization: `Token ${token}`
          }
        });

        const { first_name, last_name, username } = response.data;
        setUser((prevUser) => ({
          ...prevUser,
          fullName: `${first_name} ${last_name}`,
          username: username
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prevUser) => ({
          ...prevUser,
          profilePic: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.profileSummaryContainer}>
      <Sidebar profileType="individual" />
      <div className={styles.profilePicContainer}>
        <img src={user.profilePic} alt="Profile" className={styles.profilePic} />
        <label htmlFor="profilePicInput" className={styles.editIcon}>
          <i className="ri-edit-2-line"></i>
        </label>
        <input
          type="file"
          id="profilePicInput"
          className={styles.profilePicInput}
          onChange={handleProfilePicChange}
        />
      </div>
      <div className={styles.profileDetails}>
        <p className={styles.fullName}>{user.fullName}</p>
        <p className={styles.username}>@{user.username}</p>
        {/* <p className={styles.summary}>{user.summary}</p> */}
      </div>
    </div>
  );
};

export default ProfileSummary;
