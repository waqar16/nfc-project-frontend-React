import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from '../../assets/css/profiles/DigitalProfile.module.css';
import { useParams } from 'react-router-dom';
import facebook from '../../assets/img/socials/facebook.png';
import instagram from '../../assets/img/socials/instagram.png';
import linkedin from '../../assets/img/socials/linkedin.png';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import ScheduleMeeting from '../../components/scheduleMeetings/ScheduleMeetings';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../loader/Loader';
import { useGoogleLogin } from '@react-oauth/google';


const ReceivedProfile = () => {
  const { identifier } = useParams();
  const [loading, setloading] = useState(true)
  // const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

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

  // const [isGoogleLoginVisible, setGoogleLoginVisible] = useState(false);
  const [profileType, setProfileType] = useState();
  const [userId, setUserId] = useState();
  const [email, serUrlEmail] = useState();

  const handleGoogleSuccess = async (response) => {
    // const tokenId = response.credential;
    const access_token = response.access_token;

    try {
      console.log('Google login response:', response);
      console.log('Google login response:', access_token);
      const res = await axios.post('https://api.onesec.shop/api/share-back-profile/', {
        access_token: access_token,
        profile_type: 'individual',
      });

      if (res.status === 200) {
        localStorage.setItem('userId', res.data.user_id);
        localStorage.setItem('authToken', res.data.auth_token);
        localStorage.setItem('profile_type', res.data.profile_type);
        localStorage.setItem('username', res.data.username);
        localStorage.setItem('first_name', res.data.first_name);
        localStorage.setItem('last_name', res.data.last_name);
        localStorage.setItem('email', res.data.email);
        localStorage.setItem('authentication_type', 'google');
        localStorage.setItem('profile_pic', res.data.profile_pic);
        // window.location.reload();
      }
      await shareProfile();
    } catch (error) {
      console.error('Google login error:', error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to login with Google.');
      }
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google login failure:', error);
    alert('Failed to login with Google.');
  };



  const fetchUserData = useCallback(async () => {
    try {
      const isEmail = identifier.includes('@');
      const profileType = isEmail ? 'employee' : 'profile'; // Ensure profileType is correctly set
      
      // Construct endpoint URL based on profile type
      const endpoint = profileType === 'employee'
        ? `https://api.onesec.shop/api/employees/${identifier}/` // Use identifier for email
        : `https://api.onesec.shop/api/profiles/${identifier}/`;

      const profileResponse = await axios.get(endpoint);

      console.log('Profile response:', profileResponse.status);


      const profileData = profileResponse.data;
      console.log('Profile data:', profileData);
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
      setloading(false)

      // Create interaction when profile is viewed
      await createInteraction(profileData.user);
    } catch (error) {
      if (error.response.status === 404) {
        toast.error('Profile not found.');
        setloading(false)
        return;
      }
      setloading(false)
      console.error('Error fetching user data:', error);
      console.log('Error fetching user data:', error.response.status)
      toast.error("Error fetching user data")
    }
  }, [userId, profileType, email]);

  const createInteraction = async (user_id) => {
    try {
      // const token = localStorage.getItem('authToken');
      await axios.post(
        '  https://api.onesec.shop/api/create_interaction/',
        {
          user: user_id,
          interaction_type: 'view_profile',
        },
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

  // const shareProfileBack = async () => {
  //   setloading(true)
  //   const token = localStorage.getItem('authToken');
  //   if (!token) {
  //     setGoogleLoginVisible(true);
  //     setloading(false)
  //   } else {
  //     await shareProfile();
  //   }
  // };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleFailure,
    scope: 'openid profile email',
  });

  const shareProfileBack = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      googleLogin();
    } else {
      await shareProfile();
    }
  };

  // const shareProfileBackButton = profileType !== 'company' && (
  //   <button onClick={shareProfileBack} className={styles.actionButton}>
  //     <i className="ri-share-forward-line"></i> <span>Share Your Profile Back</span>
  //   </button>
  // );

  const shareProfile = async () => {
    setloading(true)
    try {
      const token = localStorage.getItem('authToken');
      const userResponse = await axios.get('https://api.onesec.shop/auth/users/me/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const { id, first_name, last_name, email, profile_type } = userResponse.data;

      try {
        const endpoint = profile_type === 'employee' ? `https://api.onesec.shop/api/employees/${identifier}/` : `  https://api.onesec.shop/api/profiles/${identifier}/`;
        await axios.get(endpoint, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      } catch (error) {
        // Profile does not exist, create it
        if (error.response && error.response.status === 404) {
          await axios.post('https://api.onesec.shop/api/profiles/', {
            user: id,
            first_name: first_name,
            last_name: last_name,
            email: email,
          }, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          setloading(false)
        } else {
          toast.error("Error sharing back profile!")
          throw error;
        }
      }

      const recipient = user.email;
      await axios.post('https://api.onesec.shop/api/share-profile/', { shared_to: recipient }, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setloading(false)
      toast.success('Profile shared back successfully!');
    } catch (error) {
      setloading(false)
      console.error('Error sharing profile back:', error);
      toast.error('Failed to share profile back.');
    }
  };

  const addToContacts = () => {
    // Construct vCard data
    const contactData = `
      BEGIN:VCARD
      VERSION:3.0
      FN:${user.firstName} ${user.lastName}
      EMAIL:${user.email}
      TEL;TYPE=mobile:${user.phone}
      ADR;TYPE=home:;;${user.address};;;;
      END:VCARD
    `;
  
    // Create a Blob object
    const blob = new Blob([contactData], { type: 'text/vcard' });
  
    // Create a link element and trigger download
    if (window.navigator.msSaveBlob) {
      // For IE/Edge
      window.navigator.msSaveBlob(blob, `${user.firstName}_${user.lastName}.vcf`);
    } else {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${user.firstName}_${user.lastName}.vcf`;
  
      // Append the link to the body to ensure it works across all browsers
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
    }
  
    // Provide feedback to the user
    toast.success("Contact added.");
  };


  return (
    // <GoogleOAuthProvider clientId={clientId}>
      <div className={styles.digitalProfileContainer}>
        <ToastContainer/>
        {loading && <Loader/>}
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
          <div className={styles.cardActions}>
          <div className={styles.cardActionscontent}>
          <button onClick={shareProfileBack} className={styles.actionButton}>
            <i className="ri-share-forward-line"></i>
          </button>
          <span>Share Back</span>
          </div>
          <div className={styles.cardActionscontent}>

          <button onClick={addToContacts} className={styles.actionButton}>
            <i className="ri-user-add-line"></i> 
          </button>
          <span>Add Contact</span>
          </div>
        </div>
        </div>
        {user.user && (
        <ScheduleMeeting
          attendeeEmail={user.email}
          userId={user.user}
        />
      )}

      </div>
    // </GoogleOAuthProvider>
  );  
};

export default ReceivedProfile;
