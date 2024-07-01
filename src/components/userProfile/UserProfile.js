import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../sidebar/Sidebar'; // Import the Sidebar component
import styles from '../../assets/css/profiles/UserProfile.module.css';
import profilePic from '../../assets/img/bg-image.png';

const UserProfile = () => {
  const [user, setUser] = useState({
    phone: '',
    address: '',
    bio: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    profilePic: '',
  });

  useEffect(() => {
    const storedUser = {
      firstname: localStorage.getItem('first_name') || '',
      lastname: localStorage.getItem('last_name') || '',
      email: localStorage.getItem('email') || '',
      username: localStorage.getItem('username') || '',
    };
    setUser((prevUser) => ({
      ...prevUser,
      ...storedUser,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem('authToken');
      console.log(authToken);
      await axios.post('http://127.0.0.1:8000/api/profiles/', user, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      localStorage.setItem('userProfile', JSON.stringify(user));
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  return (
    <div className={styles.userProfileContainer}>
      <Sidebar />
      <div className={styles.formContainer}>
        <h2>User Profile Management</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            First Name:
            <input
              type="text"
              name="firstname"
              value={user.firstname}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Last Name:
            <input
              type="text"
              name="lastname"
              value={user.lastname}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Email:
            <input
              type="text"
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
            Upload Profile Picture:
            <input
              type="file"
              id="profilePicInput"
              onChange={handleProfilePicChange}
              className={styles.input}
            />
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
