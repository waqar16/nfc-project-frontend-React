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
    first_name: null,
    last_name: null,
    email: null,
    phone: null,
    address: null,
    bio: null,
    position: null,
    website: null,
    facebook: null,
    instagram: null,
    linkedin: null,
    whatsapp: null,
    github: null,
    profile_pic: 'https://placehold.co/150x150',
    receive_marketing_emails: false,
  });

  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false); // Track if profile exists
  const [isSubmitting, setIsSubmitting] = useState(false);  // Track form submission state


  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userResponse = await axios.get('https://api.onesec.shop/auth/users/me/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const { id, first_name, last_name, email, profile_type, username: authenticatedUsername } = userResponse.data;
        // const token = localStorage.getItem('authToken')
        // const profile_type = localStorage.getItem('profile_type')
        // const authenticatedUsername = localStorage.getItem('username')
        // const email = localStorage.getItem('profile_type')
        // const id = localStorage.getItem('userId')
        // const first_name = localStorage.getItem('first_name')
        // const last_name = localStorage.getItem('last_name')


        if (profile_type !== 'individual' || userId !== id.toString() || username !== authenticatedUsername) {
          navigate('/not-authorized');
          return;
        }

        // Fetch the profile data from the API
        try {
          const profileResponse = await axios.get(`https://api.onesec.shop/api/profiles/${id}/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          // If the profile exists, set it in the state and mark it as existing
          setUser(prevUser => ({
            ...prevUser,
            ...profileResponse.data,
            profile_pic: profileResponse.data.profile_pic || localStorage.getItem('profile_pic') || 'https://placehold.co/150x150',
            receiveMarketingEmails: profileResponse.data.receiveMarketingEmails || false,
          }));
          setProfileExists(true); // Mark profile as existing

        } catch (error) {
          if (error.response && error.response.status === 404) {
            // Profile does not exist, initialize with default values
            setUser(prevUser => ({
              ...prevUser,
              user: id,
              first_name,
              last_name,
              email,
              profile_pic: localStorage.getItem('profile_pic') || 'https://placehold.co/150x150',
            }));
            setProfileExists(false); // Mark profile as not existing
            // setReceiveMarketingEmails(false);
          } else {
            console.error('Error fetching profile:', error);
            toast.error('Failed to fetch profile data.');
          }
        }
      } 
      catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, userId, username]);

  // const handleChange = e => {
  //   const { name, value } = e.target;
  //   setUser(prevUser => ({
  //     ...prevUser,
  //     [name]: value,
  //   }));
  // };
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setUser(prevUser => ({
        ...prevUser,
        [name]: checked,
      }));
    } else {
      setUser(prevUser => ({
        ...prevUser,
        [name]: value,
      }));
    }
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
    // setIsSubmitting(true);
    setLoading(true);


    try {
      const authToken = localStorage.getItem('authToken');
      const url = `https://api.onesec.shop/api/profiles/${user.user}/`;

      if (!profileExists) {
        // If profile does not exist, create it using POST
        await axios.post('https://api.onesec.shop/api/profiles/', user, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        toast.success('Profile created successfully!');
        setProfileExists(true); // Mark profile as existing after creation
      } else {
        // If profile exists, update it using PUT
        await axios.put(url, user, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        toast.success('Profile updated successfully!');
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update or create profile.');
    } finally {
      setLoading(false);
      setIsSubmitting(false); // Re-enable the submit button
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
            { label: 'Address', name: 'address', type: 'text', },
            { label: 'Bio', name: 'bio', type: 'textarea' },
            // { label: 'Website (Optional)', name: 'website', type: 'url' },
            { label: 'Facebook (Optional)', name: 'facebook', type: 'url' },
            { label: 'Instagram (Optional)', name: 'instagram', type: 'url' },
            { label: 'LinkedIn (Optional)', name: 'linkedin', type: 'url' },
            // { label: 'GitHub (Optional)', name: 'github', type: 'url' },
            // { label: 'WhatsApp (Optional)', name: 'whatsapp', type: 'number' },
          ].map(({ label, name, type, readOnly = false }) => (
            <label key={name} className={styles.label}>
              {label}:
              {type === 'textarea' ? (
                <textarea
                  name={name}
                  value={user[name]}
                  onChange={handleChange}
                  className={styles.textarea}
                  required
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

          <label className={styles.label}>
            <input
              type="checkbox"
              name="receive_marketing_emails"
              checked={user.receive_marketing_emails}
              onChange={handleChange}
              className={styles.checkbox}
            />
            Receive marketing emails
          </label>
          <button
            type="submit"
            className={styles.buttonSaveProfile}
            disabled={isSubmitting || loading} // Disable button while submitting
          >
            {profileExists ? 'Update Profile' : 'Create Profile'}
          </button>
        </form>
      </div>
      {loading && <Loader />}
      <ToastContainer />
    </div>
  );
};

export default UserProfile;
