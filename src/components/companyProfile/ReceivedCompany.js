import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from '../../assets/css/profiles/DigitalProfile.module.css';
import { useParams } from 'react-router-dom';
import website from '../../assets/img/socials/connection.png';
import linkedin from '../../assets/img/socials/linkedin.png';
import ScheduleMeeting from '../../components/scheduleMeetings/ScheduleMeetings';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../loader/Loader';
import {useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import QrCodeModal from '../modal/QrCodeModal';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';


const ReceivedCompany = () => {
  const { identifier } = useParams();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');

  // const navigate = useNavigate();

  const [company, setCompany] = useState({
    user:'',
    company_name: '',
    admin_name: '',
    email: '',
    phone: '',
    companyLogo: '',
    display_email: '',
    address: '',
    company_description: '',
    website: '',
    linkedin: '',
    employees: [],
  });


  const handleGoogleSuccess = async (response) => {
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
      }

      else if (res.status === 400) {
        console.error('Google login error:', res.error);
        toast.error(res.error);
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
  };

  const fetchCompanyData = useCallback(async () => {
    // const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`http://localhost:8000/api/companies/${identifier}/`, {
        // headers: {
        //   Authorization: `Token ${token}`,
        // },
      });

      setCompany({
        user: response.data.user || '',
        company_name: response.data.company_name || '',
        admin_name: response.data.admin_name || '',
        email: response.data.email || '',
        display_email: response.data.display_email || '',
        phone: response.data.phone || '',
        companyLogo: response.data.company_logo || '',
        address: response.data.address || '',
        company_description: response.data.company_description || '',
        website: response.data.website || '',
        linkedin: response.data.linkedin || '',
        employees: response.data.employees || [],
      });
      setLoading(false);

      // Create interaction when profile is viewed
      if (company.user) {
        await createInteraction(company.user);
      }
        } catch (error) {
      console.error('Error fetching company data:', error);
      toast.error('Failed to fetch company data.');
      // navigate('*');
    }
    finally {
      setLoading(false);
    }
  }, [company.user, identifier]);

  const createInteraction = async (companyId) => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.post(
        '  http://localhost:8000/api/create_interaction/',
        {
          user: companyId,
          interaction_type: 'view_profile',
        },
        {
          // headers: {
          //   Authorization: `Token ${token}`,
          // },
        }
      );
      console.log('Interaction created successfully');
    } catch (error) {
      console.error('Error creating interaction:', error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCompanyData();
  }, [fetchCompanyData]);

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

const shareProfile = async () => {
  const token = localStorage.getItem('authToken');
  try {
    setLoading(true);
    const userResponse = await axios.get('http://localhost:8000/auth/users/me/', {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    const { id, email, profile_type, username } = userResponse.data;

    const endpoint = profile_type === 'employee' ? `http://localhost:8000/api/employees/${username}/` : `  http://localhost:8000/api/profiles/${username}/`;


    // Check if profile exists before creating
    try {
      await axios.get(endpoint, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Profile does not exist, create it
        try {
          await axios.post(
            '  http://localhost:8000/api/profiles/',
            {
              user: id,
              first_name: userResponse.data.first_name,
              last_name: userResponse.data.last_name,
              email: userResponse.data.email,
            },
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );
          setLoading(false);
        } catch (createError) {
          setLoading(false);
          if (createError.response && createError.response.status === 400) {
            console.error('Profile already exists:', createError.response.data);
            // toast.warn('Profile already exists.');
          } else {
            throw createError;
          }
        }
      } else {
        throw error;
      }
    }

    try {
      await axios.post('http://localhost:8000/api/share-profile/', { shared_to: company.email }, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setLoading(false);
      toast.success('Profile shared back successfully!');
    } catch (error) {
      setLoading(false);
      console.error('Error sharing profile back:', error);
      toast.error('Failed to share profile back. Check you internet connection and try again.');
    }
  } catch (error) {
    setLoading(false);
    console.error('Error fetching user data:', error);
    toast.error('Failed to fetch user data.');
  }
};

const addToContacts = () => {
  const url = `http://localhost:8000/download_vcard/${company.user}/`;
  window.location.href = url;
};

const handleShareQrCode = () => {
  const shareLink = `http://letsconnect.onesec.shop/company/${identifier}`;
  setShareLink(shareLink);
  setIsModalOpen(true);
};


  return (
      <div className={styles.digitalProfileContainer}>
      {loading && <Loader />}
      <ToastContainer />
        <div className={styles.profileCard}>
          <div className={styles.profileHeaderCompany}>
            <div className={styles.profileinfo}>
              { company.companyLogo && (
                <img src={company.companyLogo} alt="Company Logo"  className={styles.logo} />
              )}
              <div className={styles.name}>{company.company_name}</div>
              <div className={styles.position}>{company.admin_name}</div>
            </div>
          </div>

          <div className={styles.profileBody}>
            <div className={styles.profileAbout}>
              <p className={styles.titleText}>About Us</p>
              <p className={styles.bio}>{company.company_description}</p>
            </div>
            <p className={styles.titleText}>Contact Us</p>
            <div className={styles.contactInfo}>
            {company.display_email && (
            <p>
            <a href={`mailto:${company.display_email}`}>
              <i className="ri-mail-fill"></i> {company.display_email}
            </a>
          </p>              )}
            {company.phone && (
              <p>
                <a href={`tel:${company.phone}`}>
                  <i className="ri-phone-fill"></i> {company.phone}
                </a>
              </p>
            )}
              {company.address && (
            <p>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`} target="_blank" rel="noopener noreferrer" className="contact-link">
              <i className="ri-map-pin-fill contact-icon"></i> {company.address}
            </a>
          </p>              )}
              {/* <p><i className="ri-global-fill"></i> <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></p> */}
            </div>
            <div className={styles.socialIcons}>
              {company.linkedin && (
                <a href={company.linkedin} target="_blank" rel="noopener noreferrer">
                  <img className={styles.icon} src={linkedin} alt="LinkedIn" />
                </a>
              )}
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer">
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
        <ScheduleMeeting
           attendeeEmail={company.email}
           userId={company.user}
           username={company.username}
           />

        <QrCodeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          shareLink={shareLink}
          name={`${company.company_name}`}
          // position={company.position}
          logo={company.companyLogo} 
        />

        <Tooltip id="website-shareBack" />
        <Tooltip id="website-addContact" />
        <Tooltip id="website-QrCode" />
      </div>

  );
};

export default ReceivedCompany;
