import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from '../../assets/css/profiles/DigitalProfile.module.css';
import { useParams } from 'react-router-dom';
import facebook from '../../assets/img/socials/facebook.png';
import instagram from '../../assets/img/socials/instagram.png';
import linkedin from '../../assets/img/socials/linkedin.png';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const ReceivedProfile = () => {
  const { userId, email } = useParams();
  const clientId = '1036461909018-v32f9s35hefkbeq70gterh12sioug5a5.apps.googleusercontent.com';

  const [user, setUser] = useState({
    user: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    profilePic: 'https://via.placeholder.com/150',
  });

  const [isGoogleLoginVisible, setGoogleLoginVisible] = useState(false);
  const [profileType, setProfileType] = useState();

  const handleGoogleSuccess = async (response) => {
    const tokenId = response.credential;

    try {
      console.log('Google login response:', response);
      const res = await axios.post('https://waqar123.pythonanywhere.com/auth/custom-google-login/', {
        access_token: tokenId,
        profile_type: 'individual',
      });

      localStorage.setItem('authToken', res.data.auth_token);
      await shareProfile();
    } catch (error) {
      console.error('Google login error:', error);
      alert('Failed to login with Google.');
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google login failure:', error);
    alert('Failed to login with Google.');
  };

  const fetchUserData = useCallback(async () => {
    try {
      if (email) {
        setProfileType('employee');
      }
      const endpoint = profileType === 'employee' ? `https://waqar123.pythonanywhere.com/api/employees/${email}/` : `https://waqar123.pythonanywhere.com/api/profiles/${userId}/`;
      const profileResponse = await axios.get(endpoint);

      const profileData = profileResponse.data;
      setUser({
        user: profileData.user,
        firstName: profileData.first_name || '',
        lastName: profileData.last_name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        position: profileData.position || '',
        address: profileData.address || '',
        bio: profileData.bio || '',
        facebook: profileData.facebook || '',
        instagram: profileData.instagram || '',
        linkedin: profileData.linkedin || '',
        profilePic: profileData.profile_pic || 'https://via.placeholder.com/150',
      });

      // Create interaction when profile is viewed
      await createInteraction(profileData.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [userId, profileType, email]);

  const createInteraction = async (user_id) => {
    try {
      // const token = localStorage.getItem('authToken');
      await axios.post(
        'https://waqar123.pythonanywhere.com/api/create_interaction/',
        {
          user: user_id,
          interaction_type: 'view_profile',
        },
        // {
        //   headers: {
        //     Authorization: `Token ${token}`,
        //   },
        // }
      );
      console.log('Interaction created successfully');
    } catch (error) {
      console.error('Error creating interaction:', error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUserData();
  }, []);

  const shareProfileBack = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setGoogleLoginVisible(true);
    } else {
      await shareProfile();
    }
  };

  const shareProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userResponse = await axios.get('https://waqar123.pythonanywhere.com/auth/users/me/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const { id, first_name, last_name, email, profile_type } = userResponse.data;

      try {
        const endpoint = profile_type === 'employee' ? `https://waqar123.pythonanywhere.com/api/employees/${email}/` : `https://waqar123.pythonanywhere.com/api/profiles/${userId}/`;
        await axios.get(endpoint, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      } catch (error) {
        // Profile does not exist, create it
        if (error.response && error.response.status === 404) {
          await axios.post('https://waqar123.pythonanywhere.com/api/profiles/', {
            user: id,
            first_name: first_name,
            last_name: last_name,
            email: email,
          }, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
        } else {
          throw error;
        }
      }

      const recipient = user.email;
      await axios.post('https://waqar123.pythonanywhere.com/api/share-profile/', { shared_to: recipient }, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      alert('Profile shared back successfully!');
    } catch (error) {
      console.error('Error sharing profile back:', error);
      alert('Failed to share profile back.');
    }
  };

  const addToContacts = () => {
    const contactData = `
      BEGIN:VCARD
      VERSION:3.0
      FN:${user.firstName} ${user.lastName}
      EMAIL:${user.email}
      TEL:${user.phone}
      ADR:${user.address}
      END:VCARD
    `;
    const blob = new Blob([contactData], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${user.firstName}_${user.lastName}.vcf`;
    link.click();
    URL.revokeObjectURL(url);
  };



  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className={styles.digitalProfileContainer}>
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.profileinfo}>
              <img src={user.profilePic} alt="Profile" className={styles.profilePic} />
              <div className={styles.name}>{`${user.firstName} ${user.lastName}`}</div>
              <div className={styles.position}>{user.position}</div>
            </div>
          </div>

          <div className={styles.profileBody}>
            <div className={styles.profileAbout}>
              <p className={styles.titleText}>About Me</p>
              <p className={styles.bio}>{user.bio}</p>
            </div>
            <p className={styles.titleText}>Contact me</p>
            <div className={styles.contactInfo}>
              <p><i className="ri-mail-fill"></i> {user.email}</p>
              <p><i className="ri-phone-fill"></i> {user.phone}</p>
              <p><i className="ri-map-pin-fill"></i> {user.address}</p>
            </div>
            <div className={styles.socialIcons}>
              {user.facebook && (
                <a href={user.facebook} target="_blank" rel="noopener noreferrer">
                  <img className={styles.icon} src={facebook} alt="Facebook" />
                </a>
              )}
              {user.instagram && (
                <a href={user.instagram} target="_blank" rel="noopener noreferrer">
                  <img className={styles.icon} src={instagram} alt="Instagram" />
                </a>
              )}
              {user.linkedin && (
                <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
                  <img className={styles.icon} src={linkedin} alt="LinkedIn" />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className={styles.cardActions}>
          <button onClick={shareProfileBack} className={styles.actionButton}>
            <i className="ri-share-forward-line"></i> <span>Share Your Profile Back</span>
          </button>
          <button onClick={addToContacts} className={styles.actionButton}>
            <i className="ri-user-add-line"></i> <span>Add to Contacts</span>
          </button>
          {isGoogleLoginVisible && (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onFailure={handleGoogleFailure}
              cookiePolicy={'single_host_origin'}
            />
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default ReceivedProfile;
