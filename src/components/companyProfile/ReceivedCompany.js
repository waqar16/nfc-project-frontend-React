import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from '../../assets/css/profiles/DigitalProfile.module.css';
import { useParams } from 'react-router-dom';
import facebook from '../../assets/img/socials/facebook.png';
import instagram from '../../assets/img/socials/instagram.png';
import linkedin from '../../assets/img/socials/linkedin.png';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import logo from '../../assets/img/logo.png';
import ScheduleMeeting from '../../components/scheduleMeetings/ScheduleMeetings';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../loader/Loader';
import {useNavigate } from 'react-router-dom';



const ReceivedCompany = () => {
  const { userId } = useParams();
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [company, setCompany] = useState({
    company_name: '',
    admin_name: '',
    email: '',
    phone: '',
    company_logo: '',
    address: '',
    company_description: '',
    website: '',
    linkedin: '',
    employees: [],
  });

  const [isGoogleLoginVisible, setGoogleLoginVisible] = useState(false);

  const handleGoogleSuccess = async (response) => {
    const tokenId = response.credential;

    try {
      setLoading(true);
      console.log('Google login response:', response);
      const res = await axios.post('  https://api.onesec.shop/auth/custom-google-login/', {
        access_token: tokenId,
        profile_type: 'company',
      });

      localStorage.setItem('authToken', res.data.auth_token);
      await shareProfile();
      setGoogleLoginVisible(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Google login error:', error);
      toast.error('Failed to login with Google.');
    }
  };

  const handleGoogleFailure = (error) => {
    setLoading(false);
    console.error('Google login failure:', error);
    toast.error('Failed to login with Google.');
  };

  const fetchCompanyData = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`https://api.onesec.shop/api/companies/${userId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      setCompany({
        company_name: response.data.company_name || '',
        admin_name: response.data.admin_name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        company_logo: response.data.company_logo || '',
        address: response.data.address || '',
        company_description: response.data.company_description || '',
        website: response.data.website || '',
        linkedin: response.data.linkedin || '',
        employees: response.data.employees || [],
      });
      setLoading(false);

      // Create interaction when profile is viewed
      await createInteraction(userId);
    } catch (error) {
      console.error('Error fetching company data:', error);
      navigate('*');
    }
    finally {
      setLoading(false);
    }
  }, [userId]);

  const createInteraction = async (companyId) => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.post(
        '  https://api.onesec.shop/api/create_interaction/',
        {
          user: companyId,
          interaction_type: 'view_profile',
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
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

  const shareProfileBack = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setGoogleLoginVisible(true);
    } else {
      await shareProfile();
    }
  };

const shareProfile = async () => {
  const token = localStorage.getItem('authToken');
  try {
    setLoading(true);
    const userResponse = await axios.get('  https://api.onesec.shop/auth/users/me/', {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    const { id, email, profile_type } = userResponse.data;

    const endpoint = profile_type === 'employee' ? `  https://api.onesec.shop/api/employees/${email}/` : `  https://api.onesec.shop/api/profiles/${userId}/`;


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
            '  https://api.onesec.shop/api/profiles/',
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
            toast.warn('Profile already exists.');
          } else {
            throw createError;
          }
        }
      } else {
        throw error;
      }
    }

    try {
      await axios.post('https://api.onesec.shop/api/share-profile/', { shared_to: company.email }, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      toast.success('Profile shared back successfully!');
      setLoading(false);
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
    const contactData = `
      BEGIN:VCARD
      VERSION:3.0
      FN:${company.admin_name}
      EMAIL:${company.email}
      TEL:${company.phone}
      ADR:${company.address}
      END:VCARD
    `;
    const blob = new Blob([contactData], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${company.admin_name}.vcf`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Contact added successfully! Check Downloads for the contact file.');
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {loading && <Loader />}
      <ToastContainer />
      <div className={styles.digitalProfileContainer}>
        <div className={styles.profileCard}>
          <div className={styles.profileHeaderCompany}>
            <div className={styles.profileinfo}>
              <img src={company.company_logo || logo} alt="Company Logo" width={150} className={styles.logo} />
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
              <p><i className="ri-mail-fill"></i> {company.email}</p>
              <p><i className="ri-phone-fill"></i> {company.phone}</p>
              <p><i className="ri-map-pin-fill"></i> {company.address}</p>
              <p><i className="ri-global-fill"></i> <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></p>
            </div>
            <div className={styles.socialIcons}>
              {company.linkedin && (
                <a href={company.linkedin} target="_blank" rel="noopener noreferrer">
                  <img className={styles.icon} src={linkedin} alt="LinkedIn" />
                </a>
              )}
            </div>
          </div>
          <div className={styles.cardActions}>
          <button onClick={shareProfileBack} className={styles.actionButton}>
            <i className="ri-share-forward-line"></i> <span>Share Back</span>
          </button>
          <button onClick={addToContacts} className={styles.actionButton}>
            <i className="ri-user-add-line"></i> <span>Add Contact</span>
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
        <ScheduleMeeting
           attendeeEmail={company.email}
           userId={userId}
           />
      </div>
    </GoogleOAuthProvider>
  );
};

export default ReceivedCompany;
