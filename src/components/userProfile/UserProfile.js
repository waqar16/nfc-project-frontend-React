import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../sidebar/Sidebar'; 
import styles from '../../assets/css/profiles/UserProfile.module.css';
import Loader from '../loader/Loader'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uploadFileToS3 } from '../../s3Service';


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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userResponse = await axios.get('https://54.84.254.221/auth/users/me/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const { id, first_name, last_name, email, profile_type, username: authenticatedUsername } = userResponse.data;

        if (profile_type !== 'individual' || userId !== id.toString() || username !== authenticatedUsername) {
          navigate('/not-authorized');
          return;
        }

        // Fetch the profile data from the API
        try {
          const profileResponse = await axios.get(`https://54.84.254.221/api/profiles/${id}/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          setUser(prevUser => ({
            ...prevUser,
            ...profileResponse.data,
            profile_pic: profileResponse.data.profile_pic || 'https://placehold.co/150x150',
          }));
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // Profile does not exist, initialize with default values
            setUser(prevUser => ({
              ...prevUser,
              user: id,
              first_name,
              last_name,
              email,
              profile_pic: 'https://placehold.co/150x150',
            }));
          } else {
            console.error('Error fetching profile:', error);
            toast.error('Failed to fetch profile data.');
          }
        }
      } catch (error) {
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

  const handleProfilePicChange = async event => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      try {
        const uploadResponse = await uploadFileToS3(file);
        const profilePicUrl = uploadResponse.Location; // URL of the uploaded file

        setUser(prevUser => ({
          ...prevUser,
          profile_pic: profilePicUrl,
        }));
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error('Failed to upload profile picture.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); 
    try {
      const authToken = localStorage.getItem('authToken');
      const url = `https://54.84.254.221/api/profiles/${user.user}/`;
      const method = 'put';

      await axios[method](url, user, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      toast.success('Profile updated successfully!');
      setUser(prevUser => ({
        ...prevUser,
        profile_pic: user.profile_pic,
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.');
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
              accept="image/*" 
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
            Update Profile
          </button>
        </form>
      </div>
      {loading && <Loader />}
      <ToastContainer />
    </div>
  );
};

export default UserProfile;
