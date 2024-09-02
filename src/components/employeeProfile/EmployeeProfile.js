import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../sidebar/Sidebar'; 
import styles from '../../assets/css/profiles/UserProfile.module.css';
import Loader from '../loader/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uploadFileToS3 } from '../../s3Service';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';



const EmployeeProfile = () => {
  const {userId, username } = useParams(); 
  const navigate = useNavigate();
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    position: '',
    bio: '',
    website: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    whatsapp: '',
    github: '', 
    profile_pic: 'https://placehold.co/150x150',
    receive_marketing_emails: false,

  });
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const userResponse = await axios.get('https://api.onesec.shop/auth/users/me/', {
          headers: {
            Authorization: `Token ${token}`
          }
        });

        if (userResponse.status !== 200) {

          navigate('/login');
          return;
        }

        const { id, first_name, last_name, email, profile_type, username: authenticatedUsername } = userResponse.data;
        console.log(profile_type)
        // Check if the userId and username from the URL match the authenticated user
        if (profile_type !== 'employee' || userId !== id.toString() || username !== authenticatedUsername) {
          navigate('/not-authorized');
          return;
        }

        setUser(prevUser => ({
          ...prevUser,
          user: id,
          first_name,
          last_name,
          email,
        }));


        try {
          const profileResponse = await axios.get(`https://api.onesec.shop/api/employees/${email}/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

        setUser(prevUser => ({
          ...prevUser,
            phone: profileResponse.data.phone || '',
            address: profileResponse.data.address || '',
            bio: profileResponse.data.bio || '',
            position: profileResponse.data.position || '',
            website: profileResponse.data.website || '',
            facebook: profileResponse.data.facebook || '',
            instagram: profileResponse.data.instagram || '',
            linkedin: profileResponse.data.linkedin || '',
            whatsapp: profileResponse.data.whatsapp || '',
            github: profileResponse.data.github || '',
            profile_pic: profileResponse.data.profile_pic || 'https://placehold.co/150x150',
            receive_marketing_emails: profileResponse.data.receive_marketing_emails || false,

          }));
          setProfileExists(true);
          setLoading(false);
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
              position: '',
              website: '',
              facebook: '',
              instagram: '',
              linkedin: '',
              whatsapp: '',
              github: '', 
              profile_pic: 'https://placehold.co/150x150',
              receive_marketing_emails: false,
            });
            setProfileExists(false);
            setLoading(false);
          } else {
            console.error('Error fetching profile:', error);
            setLoading(false);
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setProfileExists(false);
          setLoading(false);
          navigate('/login'); 
        } else {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchUserData();
  }, [navigate, username]);

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

  const handlePhoneChange = (value) => {
    setUser({ ...user, phone: value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const authToken = localStorage.getItem('authToken');
      if (profileExists) {
        await axios.put(`https://api.onesec.shop/api/employees/${user.email}/`, user, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        // alert('Profile updated successfully!');
        toast.success('Profile updated successfully!');
        setLoading(false);
      } else {
        await axios.post('  https://api.onesec.shop/api/employees/', user, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        // alert('Profile created successfully!');
        setLoading(false);
        toast.success('Profile created successfully!');
      }
      
      // Fetch updated profile data
      const profileResponse = await axios.get(`https://api.onesec.shop/api/employees/${user.email}/`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      setUser(profileResponse.data);
      setProfileExists(true);
    } catch (error) {
      setLoading(false);
      console.error('Error updating/creating profile:', error);
      // alert('Failed to update/create profile.');
      toast.error('Failed to update/create profile.');
    }
  };

  return (
    <div className={styles.userProfileContainer}>
      <Sidebar profileType={localStorage.getItem('profile_type')} />
      <div className={styles.formContainer}>
        {/* <h2>User Profile Management</h2> */}
        <div className={styles.profileSummaryContainer}>
      <div className={styles.profilePicContainer}>
        <img src={user.profile_pic} className={styles.profilePic} />
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
        {/* <p className={styles.summary}>{user.summary}</p> */}
      </div>
    </div>

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
              required
              readOnly
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
              required
              readOnly
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
              readOnly 
              required
            />
          </label>
          <label className={styles.label}>
            Position:
            <input
              type="text"
              name="position"
              value={user.position}
              onChange={handleChange}
              className={styles.input}
              // readOnly 
              required
            />
          </label>
          <label className={styles.label}>
            Phone Number:
            <PhoneInput
              country={'sa'}
              value={user.phone}
              onChange={handlePhoneChange}
              inputClass={styles.input}
              specialLabel=""
              required
            />
          </label>
          <label className={styles.label}>
            Address:
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleChange}
              placeholder='Riyadh, Saudi Arabia'
              className={styles.input}
              required
            />
          </label>
          <label className={styles.label}>
            Bio:
            <textarea
              name="bio"
              value={user.bio}
              onChange={handleChange}
              placeholder='Tell us about yourself'
              className={styles.textarea}
              required
            ></textarea>
          </label>
          <label className={styles.label}>
            Website (Optional):
            <input
              type="url"
              name="website"
              value={user.website}
              placeholder='https://example.com'
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Facebook (Optional):
            <input
              type="url"
              name="facebook"
              value={user.facebook}
              placeholder='https://facebook.com/username'
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Instagram (Optional):
            <input
              type="url"
              name="instagram"
              value={user.instagram}
              placeholder='https://instagram.com/username'
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            LinkedIn (Optional):
            <input
              type="url"
              name="linkedin"
              value={user.linkedin}
              placeholder='https://linkedin.com/in/username'
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          {/* <label className={styles.label}>
            Github (Optional):
            <input
              type="url"
              name="github"
              value={user.github}
              onChange={handleChange}
              className={styles.input}
            />
          </label> */}
          <label className={styles.label}>
            Whatsapp (Optional):
            <PhoneInput
              country={'sa'}
              value={user.phone}
              onChange={handlePhoneChange}
              inputClass={styles.input}
              specialLabel=""
            />
          </label>
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

export default EmployeeProfile;
