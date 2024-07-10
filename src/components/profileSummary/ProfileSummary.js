import React, { useState, useEffect } from 'react';
import styles from '../../assets/css/profiles/ProfileSummary.module.css';
import Sidebar from '../sidebar/Sidebar';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ProfileSummary = () => {
  const { userId, username } = useParams();  // Assuming your route includes username and userId
  const navigate = useNavigate();
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
        const userResponse = await axios.get('http://127.0.0.1:8000/auth/users/me/', {
          headers: {
            Authorization: `Token ${token}`
          }
        });

        const { id, first_name, last_name, profile_type, username: authenticatedUsername } = userResponse.data;
  
        if (profile_type !== 'individual' || userId !== id.toString() || username !== authenticatedUsername) {
          console.log(`UserId from URL: ${userId}, User ID: ${id}`);
          navigate('/not-authorized');
        }


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
  }, [navigate, userId, username]);

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
