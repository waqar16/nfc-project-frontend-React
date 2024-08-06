import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from '../../assets/css/profiles/DigitalProfile.module.css';
import Sidebar from '../sidebar/Sidebar';
import ShareProfileModal from '../shareProfileModal/ShareProfileModal';
import { useParams, useNavigate } from 'react-router-dom';
import facebook from '../../assets/img/socials/facebook.png';
import instagram from '../../assets/img/socials/instagram.png';
import linkedin from '../../assets/img/socials/linkedin.png';
import whatsapp from '../../assets/img/socials/whatsapp.png';
import logo from '../../assets/img/logo.png';  // Logo image for the company

const CompanyCard = () => {
  const { userId, username } = useParams();
  const navigate = useNavigate();
  const [receivedCards, setReceivedCards] = useState([]);
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
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userResponse = await axios.get('  https://waqar123.pythonanywhere.com/auth/users/me/', {
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
          const companyResponse = await axios.get(`  https://waqar123.pythonanywhere.com/api/companies/${userId}/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          setCompany({
            company_name: companyResponse.data.company_name || '',
            admin_name: companyResponse.data.admin_name || '',
            email: email || '',
            phone: companyResponse.data.phone || '',
            companyLogo: companyResponse.data.companyLogo || '',
            address: companyResponse.data.address || '',
            company_description: companyResponse.data.company_description || '',
            website: companyResponse.data.website || '',
            linkedin: companyResponse.data.linkedin || '',
            employees: companyResponse.data.employees || [],
          });
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setCompany({
              company_name: company_name || '',
              admin_name: admin_name || '',
              email: email || '',
              companyLogo: '',
              phone: '',
              address: '',
              company_description: '',
              website: '',
              linkedin: '',
              employees: [],
            });
          } else {
            console.error('Error fetching company profile:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchCompanyData();
  }, [navigate, userId, username]);

  // Fetch received cards
  const fetchReceivedCards = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('  https://waqar123.pythonanywhere.com/api/received-cards/', {
        headers: {
          Authorization: `Token ${token}`
        }
      });
    //   setProfileTypeWhoShared(response.data.profile_type_who_shared);
      const cards = await Promise.all(response.data.map(async (card) => {
        setProfileTypeWhoShared(card.profile_type_who_shared);
        const userResponse = await axios.get(`  https://waqar123.pythonanywhere.com/api/profiles/${card.shared_from}/`, {
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
    } catch (error) {
      console.error('Error fetching received cards:', error);
    }
  }, []);

  useEffect(() => {
    fetchReceivedCards();
  }, [fetchReceivedCards]);

  // Handle share profile to card
  const handleShareToCard = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('  https://waqar123.pythonanywhere.com/api/share-profile-url/', {}, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
  
      setShareLink(response.data.profile_url);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error generating share link:', error);
      alert('Failed to generate share link.');
    }
  };

  // Handle share profile
  const handleShareProfile = async (recipient) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('  https://waqar123.pythonanywhere.com/api/share-profile/', { shared_to: recipient }, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      alert('Profile shared successfully!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error sharing profile:', error);
      alert('Failed to share profile.');
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

  return (
    <>
      <div className={styles.digitalProfileContainer}>
        <Sidebar profileType={localStorage.getItem('profile_type')} />
        <div className={styles.profileCard}>
          <div className={styles.profileHeaderCompany}>
            <div className={styles.profileinfo}>
              <img src={company.companyLogo || logo} alt="Company Logo" width={150} className={styles.logo} />
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
          shareLink={shareLink}
        />

        <div className={styles.receivedCardsSection}>
          <h2>Received Digital Cards</h2>
          <div className={styles.receivedCardsList}>
            {receivedCards.length > 0 ? (
              receivedCards.map(card => (
                <div key={card.id} className={styles.receivedCard}>
                  {/* <img src={card.shared_from_user.profilePic || 'https://via.placeholder.com/150'} alt="Profile" className={styles.receivedCardPic} /> */}
                  <div className={styles.receivedCardDetails}>
                    <div className={styles.receivedCardName}>{`Email: ${card.shared_from_user.email}`}</div>
                    <div className={styles.receivedCardDate}>Received on: {new Date(card.shared_at).toLocaleDateString()}</div>
                    <span onClick={() => handleShowDetails(card.shared_from_user.user)} className={styles.showDetailsButton}>
                      View Card
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>No received digital cards.</p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.cardActions}>
        <button onClick={handleShareToCard} className={styles.actionButton}>
          <i className="ri-share-forward-line"></i> <span>Share Profile</span>
        </button>
      </div>
    </>
  );
};

export default CompanyCard;
