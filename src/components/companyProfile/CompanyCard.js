import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from '../../assets/css/profiles/DigitalProfile.module.css';
import Sidebar from '../sidebar/Sidebar';
import ShareProfileModal from '../shareProfileModal/ShareProfileModal';
import { useParams, useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo.png';  // Logo image for the company
import linkedin from '../../assets/img/socials/linkedin.png';  // LinkedIn icon image
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../loader/Loader';

const CompanyCard = () => {
  const { userId, username } = useParams();
  const navigate = useNavigate();
  const [receivedCards, setReceivedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [profileTypeWhoShared , setProfileTypeWhoShared] = useState('');
  const [company, setCompany] = useState({
    company_name: '',
    admin_name: '',
    email: '',
    phone: '',
    companyLogo: '',
    address: '',
    company_description: '',
    website: '',
    linkedin: '',
    employees: [],
  });

  // Fetch company data
  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const userResponse = await axios.get('http://54.84.254.221/auth/users/me/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const { id, company_name, admin_name, email, profile_type, username: authenticatedUsername } = userResponse.data;

      // Ensure the profile type and userId match
      if (profile_type !== 'company' || userId !== id.toString() || username !== authenticatedUsername) {
        navigate('/not-authorized');
        return;
      }

      try {
        const companyResponse = await axios.get(`http://54.84.254.221/api/companies/${userId}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        setCompany({
          company_name: companyResponse.data.company_name || '',
          admin_name: companyResponse.data.admin_name || '',
          email: email || '',
          phone: companyResponse.data.phone || '',
          companyLogo: companyResponse.data.companyLogo || logo,
          address: companyResponse.data.address || '',
          company_description: companyResponse.data.company_description || '',
          website: companyResponse.data.website || '',
          linkedin: companyResponse.data.linkedin || '',
          employees: companyResponse.data.employees || [],
        });
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setCompany({
            company_name: company_name || '',
            admin_name: admin_name || '',
            email: email || '',
            companyLogo: logo,
            phone: '',
            address: '',
            company_description: '',
            website: '',
            linkedin: '',
            employees: [],
          });
          setLoading(false);
        } else {
          setLoading(false);
          console.error('Error fetching company profile:', error);
          toast.error('Failed to fetch company profile.');
        }
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching user data:', error);
      toast.error('Failed to fetch user data.');
    }
  };
  // Fetch received cards
  const fetchReceivedCards = useCallback(async () => {
    try {
      // setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://54.84.254.221/api/received-cards/', {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      //   setProfileTypeWhoShared(response.data.profile_type_who_shared);
      const cards = await Promise.all(response.data.map(async (card) => {
        setProfileTypeWhoShared(card.profile_type_who_shared);
        const userResponse = await axios.get(`http://54.84.254.221/api/profiles/${card.shared_from}/`, {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        return {
          ...card,
          shared_from_user: userResponse.data
        };
      }));
      setReceivedCards(cards);
      // setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching received cards:', error);
      toast.error('Failed to fetch received cards.');
    }
  }, []);

  useEffect(() => {
    fetchCompanyData();
    fetchReceivedCards();
  }, [navigate, userId, username, fetchReceivedCards]);


  // Handle share profile to card
  const handleShareToCard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.post('http://54.84.254.221/api/share-profile-url/', {}, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
  
      setShareLink(response.data.profile_url);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error generating share link:', error);
      toast.error('Failed to generate share link.');
    } finally {
      setLoading(false); // Set loading to false after the request is complete
    }
  };
  // Handle share profile
  const handleShareProfile = async (recipient) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.post('http://54.84.254.221/api/share-profile/', { shared_to: recipient }, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      toast.success('Profile shared successfully!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error sharing profile:', error);
      toast.error('Failed to share profile.');
    } finally {
      setLoading(false); // Set loading to false after the request is complete
    }
  };
  // Handle show details of received card
  const handleShowDetails = (profileId) => {
    console.log('Profile ID:', profileTypeWhoShared);
    if (profileTypeWhoShared === 'company') {
      navigate(`/company/${profileId}`);
    }
    else {
      navigate(`/profile/${profileId}`);
    }
  };

  function timeAgo(date) {
    const now = new Date();
    const secondsPast = (now.getTime() - date.getTime()) / 1000;

    if (secondsPast < 60) {
        return `${Math.floor(secondsPast)} seconds ago`;
    }
    if (secondsPast < 3600) {
        return `${Math.floor(secondsPast / 60)} minutes ago`;
    }
    if (secondsPast < 86400) {
        return `${Math.floor(secondsPast / 3600)} hours ago`;
    }
    if (secondsPast < 2592000) {
        return `${Math.floor(secondsPast / 86400)} days ago`;
    }
    if (secondsPast < 31536000) {
        return `${Math.floor(secondsPast / 2592000)} months ago`;
    }
    return `${Math.floor(secondsPast / 31536000)} years ago`;
}


  return (
    <>
      <div className={styles.digitalProfileContainer}>
        <Sidebar profileType={localStorage.getItem('profile_type')} />
        <div className={styles.profileCard}>
          <div className={styles.profileHeaderCompany}>
            <div className={styles.profileinfo}>
              <img src={company.companyLogo} alt="Company Logo" width={150} className={styles.logo} />
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
        </div>

        <ShareProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onShare={handleShareProfile}
          shareLink={shareLink}  // Pass the share link to the modal
        />

<div className={styles.receivedCardsSection}>
    <div className={styles.receivedCardsList}>
    <h2>Received Digital Cards</h2>

        {receivedCards.length > 0 ? (
            receivedCards
                .sort((a, b) => new Date(b.shared_at) - new Date(a.shared_at)) // Sort by shared_at date in descending order
                .map(card => (
                    <div key={card.id} className={styles.receivedCard}>
                        {/* <img src={card.shared_from_user.profilePic || 'https://via.placeholder.com/150'} alt="Profile" className={styles.receivedCardPic} /> */}
                        <div className={styles.receivedCardDetails}>
                            <div className={styles.receivedCardName}>
                                {` From: ${card.shared_from_user.email}`}
                            </div>
                            <div className={styles.receivedCardDate}>Received on: {timeAgo(new Date(card.shared_at))}</div>
                            <span onClick={() => handleShowDetails(card.shared_from_user.user)} className={styles.showDetailsButton}>
                                View Card
                            </span>
                        </div>
                    </div>
                ))
        ) : (
            <p>No received cards</p>
        )}
    </div>
        </div>
      </div>

      <div className={styles.cardActions}>
        <button onClick={handleShareToCard} className={styles.actionButton}>
          <i className="ri-share-forward-line"></i> <span>Share Profile</span>
        </button>
      </div>
      {loading && <Loader />}
      <ToastContainer />
    </>
  );
};

export default CompanyCard;
