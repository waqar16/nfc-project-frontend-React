import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../sidebar/Sidebar'; 
import styles from '../../assets/css/profiles/UserProfile.module.css';
// import ProfilSummary from '../profileSummary/ProfileSummary'
// import styles from '../../assets/css/profiles/ProfileSummary.module.css';


const EmployeeProfile = () => {
  const {username } = useParams(); 
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

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userResponse = await axios.get('  http://localhost:8000/auth/users/me/', {
          headers: {
            Authorization: `Token ${token}`
          }
        });

        if (userResponse.status !== 200) {
          console.log("khkkh")
          navigate('/login');
        }

        const { id, first_name, last_name, email, profile_type, username: authenticatedUsername } = userResponse.data;
        console.log(profile_type)
        // Check if the userId and username from the URL match the authenticated user
        if (profile_type !== 'employee' || username !== authenticatedUsername) {
          // console.log(`UserId from URL: ${userId}, User ID from response: ${id}`);
          console.log(`Username from URL: ${username}, Authenticated Username: ${authenticatedUsername}`);
          navigate('/not-authorized');
          return;
        }
        setUser({
          first_name: first_name,
          last_name: last_name,
          email: email
        })

        try {
          const profileResponse = await axios.get(`  http://localhost:8000/api/employees/${email}/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          setUser({
            first_name: first_name,
            last_name: last_name,
            email: email,
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
            receiveMarketingEmails: profileResponse.data.receiveMarketingEmails || false,

          });
          setProfileExists(true);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // Profile does not exist
            setUser({
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
            });
            setProfileExists(false);
          } else {
            console.error('Error fetching profile:', error);
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Handle case where profile does not exist
          setProfileExists(false);
          navigate('/login'); // Navigate to login page or relevant route
        } else {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchUserData();
  }, [navigate, username]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setUser((prevUser) => ({
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


  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prevUser) => ({
          ...prevUser,
          profile_pic: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('first_name', user.first_name);
    formData.append('last_name', user.last_name);
    formData.append('email', user.email);
    formData.append('phone', user.phone);
    formData.append('address', user.address);
    formData.append('position', user.position);
    formData.append('bio', user.bio);
    formData.append('facebook', user.facebook);
    formData.append('instagram', user.instagram);
    formData.append('linkedin', user.linkedin);
    formData.append('whatsapp', user.whatsapp);
    formData.append('github', user.github);
    formData.append('website', user.website);
    if (user.profilePic) {
      formData.append('profile_pic', user.profile_pic);
    }
    try {
      const authToken = localStorage.getItem('authToken');
      if (profileExists) {
        
        await axios.put(`  http://localhost:8000/api/employees/${user.email}/`, formData, {
          headers: {
            Authorization: `Token ${authToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Profile updated successfully!');
      } else {
        await axios.post('  http://localhost:8000/api/employees/', formData, {
          headers: {
            Authorization: `Token ${authToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Profile created successfully!');
      }
      
      // Fetch updated profile data
      const profileResponse = await axios.get(`  http://localhost:8000/api/employees/${user.email}/`, {
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
              readOnly 
              required
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
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Github (Optional):
            <input
              type="url"
              name="github"
              value={user.github}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Whatsapp (Optional):
            <input
              type='number'
              name="whatsapp"
              value={user.whatsapp}
              onChange={handleChange}
              className={styles.input}
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
    </div>
  );
};

export default EmployeeProfile;
