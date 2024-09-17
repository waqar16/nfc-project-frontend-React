import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from '../../assets/css/profiles/DigitalProfile.module.css';
import { useParams } from 'react-router-dom';
import facebook from '../../assets/img/socials/facebook.png';
import instagram from '../../assets/img/socials/instagram.png';
import linkedin from '../../assets/img/socials/linkedin.png';
import whatsapp from '../../assets/img/socials/whatsapp.png';
import website from '../../assets/img/socials/connection.png';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import ScheduleMeeting from '../../components/scheduleMeetings/ScheduleMeetings';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../loader/Loader';
import { useGoogleLogin } from '@react-oauth/google';
import QrCodeModal from '../modal/QrCodeModal';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const ReceivedProfile = () => {
  const { identifier } = useParams();
  const [loading, setloading] = useState(true)
  // const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const [user, setUser] = useState({
    user: null,
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    display_email: '',
    phone: '',
    address: '',
    bio: '',
    facebook: '',
    instagram: '',
    whatsapp: '',
    website: '',
    linkedin: '',
    profilePic: '',
  });

  // const [isGoogleLoginVisible, setGoogleLoginVisible] = useState(false);
  const [profileType, setProfileType] = useState();
  const [userId, setUserId] = useState();
  const [email, serUrlEmail] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');

  const handleGoogleSuccess = async (response) => {
    // const tokenId = response.credential;
    const access_token = response.access_token;

    try {
      console.log('Google login response:', response);
      console.log('Google login response:', access_token);
      const res = await axios.post('http://localhost:8000/api/share-back-profile/', {
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
      const profileEndpoint = `http://localhost:8000/api/profiles/${identifier}/`;
      
      // Try fetching profile data first
      let profileResponse;
      try {
        profileResponse = await axios.get(profileEndpoint);
        console.log('Profile response:', profileResponse.status);
  
        const profileData = profileResponse.data;
        console.log('Profile data:', profileData);
        setUser({
          user: profileData.user,
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || '',
          email: profileData.email || '',
          display_email: profileData.display_email || '',
          phone: profileData.phone || '',
          username: profileData.username || '',
          position: profileData.position || '',
          address: profileData.address || '',
          bio: profileData.bio || '',
          facebook: profileData.facebook || '',
          instagram: profileData.instagram || '',
          whatsapp: profileData.whatsapp || '',
          website: profileData.website || '',
          linkedin: profileData.linkedin || '',
          profilePic: profileData.profile_pic || '',
        });
        setloading(false);
  
        // Create interaction when profile is viewed
        await createInteraction(profileData.user);
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('Profile not found, trying employee endpoint...');
  
          // Fetch employee data if profile is not found
          const employeeEndpoint = `http://localhost:8000/api/employees/${identifier}/`;
          const employeeResponse = await axios.get(employeeEndpoint);
          
          console.log('Employee response:', employeeResponse.status);
  
          const employeeData = employeeResponse.data;
          console.log('Employee data:', employeeData);
          setUser({
            user: employeeData.user,
            firstName: employeeData.first_name || '',
            lastName: employeeData.last_name || '',
            email: employeeData.email || '',
            display_email: employeeData.display_email || '',
            phone: employeeData.phone || '',
            username: employeeData.username || '',
            position: employeeData.position || '',
            address: employeeData.address || '',
            bio: employeeData.bio || '',
            facebook: employeeData.facebook || '',
            instagram: employeeData.instagram || '',
            whatsapp: employeeData.whatsapp || '',
            website: employeeData.website || '',
            linkedin: employeeData.linkedin || '',
            profilePic: employeeData.profile_pic || '',
          });
          setloading(false);
  
          // Create interaction when employee profile is viewed
          await createInteraction(employeeData.user);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 404) {
        toast.error('Profile Card Not Found');
      } else {
        toast.error('Error fetching user data');
      }
      setloading(false);
    }
  }, [identifier]);

  const createInteraction = async (user_id) => {
    try {
      await axios.post(
        'http://localhost:8000/api/create_interaction/',
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
      const userResponse = await axios.get('http://localhost:8000/auth/users/me/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const { id, first_name, last_name, email, profile_type } = userResponse.data;

      try {
        const endpoint = profile_type === 'employee' ? `http://localhost:8000/api/employees/${identifier}/` : `  http://localhost:8000/api/profiles/${identifier}/`;
        await axios.get(endpoint, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      } catch (error) {
        // Profile does not exist, create it
        if (error.response && error.response.status === 404) {
          await axios.post('http://localhost:8000/api/profiles/', {
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
      await axios.post('http://localhost:8000/api/share-profile/', { shared_to: recipient }, {
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
    const url = `http://localhost:8000/download_vcard/${user.user}`;
    window.location.href = url;
  };

  const handleShareQrCode = () => {
    const shareLink = `http://letsconnect.onesec.shop/profile/${identifier}`;
    setShareLink(shareLink);
    setIsModalOpen(true);
  };
  

  return (
    // <GoogleOAuthProvider clientId={clientId}>
      <div className={styles.digitalProfileContainer}>
        <ToastContainer/>
        {loading && <Loader/>}
        <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
            <div className={styles.profileinfo}>
              {user.profilePic ? (
                <>
                <img src={user.profilePic} alt="Profile" className={styles.profilePic} /> 
                <div className={styles.relative}>
                <div className={styles.name}>{`${user.firstName} ${user.lastName}`}</div>
                <div className={styles.position}>{user.position}</div>
               
                  </div>
                  </>
              ) : (
                <>
                <div className={styles.profilePicPlaceholder}>
                  
                </div>
                <div className={styles.profileTitle}>
                <div className={styles.name}>{`${user.firstName} ${user.lastName}`}</div>
                <div className={styles.position}>{user.position}</div>
                </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.profileBody}>
            <div className={styles.profileAbout}>
              <p className={styles.titleText}>About Me</p>
              <p className={styles.bio}>{user.bio}</p>
            </div>
            <p className={styles.titleText}>Contact me</p>
            <div className={styles.contactInfo}>
            {user.email && (
               <p><i className="ri-mail-fill"></i> {user.display_email}</p>
              )}
              {user.phone && (
                <p><i className="ri-phone-fill"></i> {user.phone}</p>
              )}
              {user.address && (
                <p><i className="ri-map-pin-fill"></i> {user.address}</p>
              )}
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
              {user.whatsapp && (
                <a href={`https://wa.me/${user.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  <img className={styles.icon} src={whatsapp} alt="WhatsApp" />
                </a>
              )}
              {user.website && (
                <a href={user.website} target="_blank" rel="noopener noreferrer">
                  <img className={styles.icon} src={website} alt="Website" />
                </a>
              )}
            </div>
          </div>
          <div className={styles.cardActions}>
          <div className={styles.cardActionscontent}>
          <button data-tooltip-id="website-shareBack" data-tooltip-content="Share Your Profile Back" onClick={shareProfileBack} className={styles.actionButton}>
            <i className="ri-share-forward-line"></i>
          </button>
          {/* <span>Share Back</span> */}
          </div>
          <div className={styles.cardActionscontent}>

          <button data-tooltip-id="website-addContact" data-tooltip-content="Add to Your Contact"  onClick={addToContacts} className={styles.actionButton}>
            <i className="ri-user-add-line"></i> 
            {/* <span>Add Contact</span> */}
          </button>


          <button  data-tooltip-id="website-QrCode" data-tooltip-content="Scan or Download QrCode" onClick={handleShareQrCode} className={styles.actionButton}>
          <i className="ri-qr-code-line"></i>
        </button>

          </div>
        </div>
        </div>
        {user.user && (
        <ScheduleMeeting
          attendeeEmail={user.email}
          userId={user.user}
          username={identifier}
        />
      )}

      <QrCodeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          // onShare={handleShareProfile}
          shareLink={shareLink}
          name={`${user.firstName} ${user.lastName}`}
          position={user.position}
          profilePic={user.profilePic} 
        />
        <Tooltip id="website-shareBack" />
        <Tooltip id="website-addContact" />
        <Tooltip id="website-QrCode" />

      </div>
    // </GoogleOAuthProvider>
  );  
};

export default ReceivedProfile;
