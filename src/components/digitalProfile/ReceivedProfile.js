import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from '../../assets/css/profiles/DigitalProfile.module.css';
import Sidebar from '../sidebar/Sidebar';
import { useParams, useNavigate } from 'react-router-dom';
import ScheduleMeeting from '../scheduleMeetings/ScheduleMeetings';

const ReceivedProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    profilePic: 'https://via.placeholder.com/150',
  });


  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const profileResponse = await axios.get(`http://127.0.0.1:8000/api/profiles/${userId}/`, {
        headers: {
          Authorization: `Token ${token}`
        }
      });

      const profileData = profileResponse.data;

      setUser({
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        email: profileData.email,
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
      // Handle errors, e.g., redirect to login page or show error message
    }
  }, [userId]);


  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      await fetchUserData();
    };

    fetchData();
  }, [fetchUserData]);


  return (
    <>
      <div className={styles.digitalProfileContainer}>
        <Sidebar profileType="individual" />
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <img src={user.profilePic} alt="Profile" className={styles.profilePic} />
            <div className={styles.name}>{`${user.firstName} ${user.lastName}`}</div>
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
        <div>
          <ScheduleMeeting />
        </div>
      </div>
    </>
  );
};

export default ReceivedProfile;
