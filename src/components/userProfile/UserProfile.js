import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../sidebar/Sidebar'; 
import styles from '../../assets/css/profiles/UserProfile.module.css';

const UserProfile = () => {
  const { userId, username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    user: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    position: '',
    website: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    whatsapp: '',
    github: '', 
    profile_pic: 'https://placehold.co/150x150',
  });
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userResponse = await axios.get('https://waqar123.pythonanywhere.com/auth/users/me/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const { id, first_name, last_name, email, profile_type, username: authenticatedUsername } = userResponse.data;

        if (profile_type !== 'individual' || userId !== id.toString() || username !== authenticatedUsername) {
          navigate('/not-authorized');
          return;
        }

        const updatedUser = {
          user: id,
          first_name,
          last_name,
          email,
          profile_pic: localStorage.getItem('profile_pic') || 'https://placehold.co/150x150',
        };

        setUser(updatedUser);

        try {
          const profileResponse = await axios.get(`https://waqar123.pythonanywhere.com/api/profiles/${id}/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          setUser(prevUser => ({
            ...prevUser,
            ...profileResponse.data,
          }));

          setProfileExists(true);
        } catch (error) {
          if (error.response && error.response.status === 404) {
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

  const handleChange = e => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleProfilePicChange = event => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prevUser => ({
          ...prevUser,
          profile_pic: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(user).forEach(key => {
      formData.append(key, user[key]);
    });

    try {
      const authToken = localStorage.getItem('authToken');
      const url = profileExists
        ? `https://waqar123.pythonanywhere.com/api/profiles/${user.user}/`
        : 'https://waqar123.pythonanywhere.com/api/profiles/';
      const method = profileExists ? 'put' : 'post';

      await axios[method](url, formData, {
        headers: {
          Authorization: `Token ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert(profileExists ? 'Profile updated successfully!' : 'Profile created successfully!');

      const profileResponse = await axios.get(`https://waqar123.pythonanywhere.com/api/profiles/${user.user}/`, {
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
        <div className={styles.profileSummaryContainer}>
          <Sidebar profileType={localStorage.getItem('profile_type')} />
          <div className={styles.profilePicContainer}>
            <img src={user.profile_pic} alt="Profile" className={styles.profilePic} />
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
            <p className={styles.fullName}>{user.first_name} {user.last_name}</p>
            <p className={styles.username}>@{username}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="hidden" name="user" value={user.user} />
          {[
            { label: 'First Name', name: 'first_name', type: 'text' },
            { label: 'Last Name', name: 'last_name', type: 'text' },
            { label: 'Email', name: 'email', type: 'text', readOnly: true },
            { label: 'Position', name: 'position', type: 'text' },
            { label: 'Phone', name: 'phone', type: 'text' },
            { label: 'Address', name: 'address', type: 'text' },
            { label: 'Bio', name: 'bio', type: 'textarea' },
            { label: 'Website (Optional)', name: 'website', type: 'url' },
            { label: 'Facebook (Optional)', name: 'facebook', type: 'url' },
            { label: 'Instagram (Optional)', name: 'instagram', type: 'url' },
            { label: 'LinkedIn (Optional)', name: 'linkedin', type: 'url' },
            { label: 'GitHub (Optional)', name: 'github', type: 'url' },
            { label: 'WhatsApp (Optional)', name: 'whatsapp', type: 'number' },
          ].map(({ label, name, type, readOnly = false }) => (
            <label key={name} className={styles.label}>
              {label}:
              {type === 'textarea' ? (
                <textarea
                  name={name}
                  value={user[name]}
                  onChange={handleChange}
                  className={styles.textarea}
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={user[name]}
                  onChange={handleChange}
                  className={styles.input}
                  readOnly={readOnly}
                />
              )}
            </label>
          ))}
          <button type="submit" className={styles.buttonSaveProfile}>
            {profileExists ? 'Update Profile' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
