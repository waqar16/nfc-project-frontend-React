import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../sidebar/Sidebar'; 
import styles from '../../assets/css/profiles/UserProfile.module.css';
import Loader from '../loader/Loader'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    website: null,
    facebook: null,
    instagram: null,
    linkedin: null,
    whatsapp: null,
    github: null, 
    profile_pic: 'https://placehold.co/150x150',
  });
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);  // Add a loading state

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userResponse = await axios.get('http://54.84.254.221/auth/users/me/', {
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
        setLoading(false);  

        try {
          setLoading(true);  // Set loading to true when fetching profile data
          const profileResponse = await axios.get(`http://54.84.254.221/api/profiles/${id}/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          setUser(prevUser => ({
            ...prevUser,
            ...profileResponse.data,
          }));

          setProfileExists(true);
          setLoading(false);  // Set loading to false after fetching profile data
        } catch (error) {
          setLoading(false);  // Set loading to false if there's an error fetching profile data
          if (error.response && error.response.status === 404) {
            setProfileExists(false);
          } else {
            console.error('Error fetching profile:', error);
            // navigate('/login');
          }
        }
      } catch (error) {
        setLoading(false);  // Set loading to false if there's an error fetching user data
        console.error('Error fetching user data:', error);
        navigate('/login');
      } finally {
        setLoading(false);
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
    setLoading(true);  // Set loading to true when form is submitted
    // const formData = new FormData();
    // Object.keys(user).forEach(key => {
    //   formData.append(key, user[key]);
    // });

    try {
      const authToken = localStorage.getItem('authToken');
      const url = profileExists
        ? `http://54.84.254.221/api/profiles/${user.user}/`
        : 'http://54.84.254.221/api/profiles/';
      const method = profileExists ? 'put' : 'post';

      await axios[method](url, user, {
        headers: {
          Authorization: `Token ${authToken}`,
          // 'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(profileExists ? 'Profile updated successfully!' : 'Profile created successfully!');
      setLoading(false);
      
      const profileResponse = await axios.get(`http://54.84.254.221/api/profiles/${user.user}/`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      setUser(profileResponse.data);
      setProfileExists(true);
    } catch (error) {
      console.error('Error updating/creating profile:', error);
      toast.error('Failed to update/create profile.');
      setLoading(false);
    } finally {
      setLoading(false);  
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
      {loading && <Loader />}
      <ToastContainer />
    </div>
  );
};

export default UserProfile;
