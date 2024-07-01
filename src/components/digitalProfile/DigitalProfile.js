import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../assets/css/profiles/DigitalProfile.module.css'; // Update with your CSS file path

const DigitalProfile = () => {
  const [user, setUser] = useState({
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    address: '123 Main St, City, Country',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac velit vel libero efficitur sagittis.',
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
      // Simulate fetching user data from an API endpoint
      // const response = await axios.get('http://sample-api-endpoint/users/me/');
      // const data = response.data;
      // setUser(data); // Update state with user data from the endpoint
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
    <div className={styles.digitalProfileContainer}>
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
        <div className={styles.cardActions}>
          <button onClick={handleShareToCard} className={styles.actionButton}>
            <i className="ri-share-forward-line"></i> Share Digital Card
          </button>
          <button onClick={handleWriteToNFC} className={styles.actionButton}>
            <i className="ri-nfc-fill"></i> Write to NFC
          </button>
        </div>
      </div>
    </div>
  );
};

export default DigitalProfile;
