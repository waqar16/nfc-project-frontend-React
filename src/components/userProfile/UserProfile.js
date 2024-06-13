import React, { useState } from 'react';
import styles from '../../assets/css/UserProfile.module.css';
import profilePic from '../../assets/img/bg-image.png';

const UserProfile = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    address: '123 Main St, Springfield, IL',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.',
    facebook: 'facebook.com',
    instagram: 'instagram.com',
    linkedin: 'linkedin.com',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Profile updated successfully!');
  };

  return (
    <div className={styles.userProfileContainer}>
      <div className={styles.previewCard}>
        <img src={profilePic} alt="Profile" className={styles.profilePic} />
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
        <p>Address: {user.address}</p>
        <p>Bio: {user.bio}</p>
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
    </div>
  );
};

export default UserProfile;
