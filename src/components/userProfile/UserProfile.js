import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../sidebar/Sidebar'; 
import styles from '../../assets/css/profiles/UserProfile.module.css';

const UserProfile = () => {
  const { userId, username } = useParams();  // Assuming your route includes username and userId
  const navigate = useNavigate();
  const [user, setUser] = useState({
    user: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    facebook: '',
    instagram: '',
    linkedin: '',
  });
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userResponse = await axios.get('http://127.0.0.1:8000/auth/users/me/', {
          headers: {
            Authorization: `Token ${token}`
          }
        });

        const { id, first_name, last_name, email, profile_type, username: authenticatedUsername } = userResponse.data;
        console.log(profile_type)

        // Check if the userId and username from the URL match the authenticated user
        if (profile_type !== 'individual' || userId !== id.toString() || username !== authenticatedUsername) {
          console.log(`UserId from URL: ${userId}, User ID from response: ${id}`);
          console.log(`Username from URL: ${username}, Authenticated Username: ${authenticatedUsername}`);
          navigate('/not-authorized');
          return;
        }

        try {
          const profileResponse = await axios.get(`http://127.0.0.1:8000/api/profiles/${id}/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          setUser({
            user: id,
            first_name: first_name,
            last_name: last_name,
            email: email,
            phone: profileResponse.data.phone || '',
            address: profileResponse.data.address || '',
            bio: profileResponse.data.bio || '',
            facebook: profileResponse.data.facebook || '',
            instagram: profileResponse.data.instagram || '',
            linkedin: profileResponse.data.linkedin || '',
          });
          setProfileExists(true);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // Profile does not exist
            setUser({
              user: id,
              first_name: first_name,
              last_name: last_name,
              email: email,
              phone: '',
              address: '',
              bio: '',
              facebook: '',
              instagram: '',
              linkedin: '',
            });
            setProfileExists(false);
          } else {
            console.error('Error fetching profile:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [navigate, userId, username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem('authToken');
      if (profileExists) {
        
        await axios.put(`http://127.0.0.1:8000/api/profiles/${user.user}/`, user, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        alert('Profile updated successfully!');
      } else {
        await axios.post('http://127.0.0.1:8000/api/profiles/', user, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        alert('Profile created successfully!');
      }
      
      // Fetch updated profile data
      const profileResponse = await axios.get(`http://127.0.0.1:8000/api/profiles/${user.user}/`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      setUser(profileResponse.data);
      setProfileExists(true);
    } catch (error) {
      console.error('Error updating/creating profile:', error);
      alert('Failed to update/create profile.');
    }
  };

  return (
    <div className={styles.userProfileContainer}>
      <Sidebar profileType="individual" />
      <div className={styles.formContainer}>
        <h2>User Profile Management</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="hidden"
            name="user"
            value={user.user}
            onChange={handleChange}
            className={styles.input}
          />
          <label className={styles.label}>
            First Name:
            <input
              type="text"
              name="first_name"
              value={user.first_name}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Last Name:
            <input
              type="text"
              name="last_name"
              value={user.last_name}
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
              readOnly // Assuming email is not editable
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
            {profileExists ? 'Update Profile' : 'Create Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
