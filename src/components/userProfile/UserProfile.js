import React, { useState } from 'react';
import styles from '../../assets/css/UserProfile.module.css';
import profilePic from '../../assets/img/bg-image.png'; 
import Dashboard from '../dashboard/Dashboard';

const UserProfile = () => {
  const [user, setUser] = useState({
    name: 'Waqar Ahmed Khan',
    email: 'wa4752928@gmail.com',
    phone: '+92 316 2309308',
    address: '123 Main St, Karachi, Pakistan',
    bio: 'I am a full-stack web developer with 1 years of experience. I love to work on challenging projects.',
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
    linkedin: 'https://www.linkedin.com/',
    profilePic: profilePic,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const [analytics, setAnalytics] = useState({
    nfc: 120,
    digitalCard: 75,
    total: 195,
  });

  const handleProfilePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUser((prevUser) => ({
          ...prevUser,
          profilePic: e.target.result,
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  return (
    <>
    <div className={styles.userProfileContainer}>
            <div className={styles.formContainer}>
        <h2>User Profile Management</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Name:
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Email:
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Phone:
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Address:
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Bio:
            <textarea
              name="bio"
              value={user.bio}
              onChange={handleChange}
              className={styles.textarea}
            ></textarea>
          </label>
          <label className={styles.label}>
            Facebook:
            <input
              type="url"
              name="facebook"
              value={user.facebook}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Instagram:
            <input
              type="url"
              name="instagram"
              value={user.instagram}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            LinkedIn:
            <input
              type="url"
              name="linkedin"
              value={user.linkedin}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <button type="submit" className={styles.button}>
            Update Profile
          </button>
        </form>
      </div>
      <div className={styles.previewCard}>
        <div className={styles.profilePicContainer}>
          <img src={user.profilePic} alt="Profile" className={styles.profilePic} />
          <label htmlFor="profilePicInput" className={styles.editIcon}>
            <i className="ri-edit-2-fill"></i>
          </label>
          <input
            type="file"
            id="profilePicInput"
            style={{ display: 'none' }}
            onChange={handleProfilePicChange}
          />
        </div>
        <h2>{user.name}</h2>
        <p>{user.bio}</p>
        <div className={styles.contactInfo}>
          <p><i className="ri-mail-fill"></i> {user.email}</p>
          <p><i className="ri-phone-fill"></i> {user.phone}</p>
          <p><i className="ri-map-pin-fill"></i> {user.address}</p>
        </div>
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
          <i className={`ri-share-forward-line ${styles.shareIcon}`}></i>
        </div>
      </div>

    </div>
    <Dashboard analytics={analytics} /> 

    </>
  );
};

export default UserProfile;
