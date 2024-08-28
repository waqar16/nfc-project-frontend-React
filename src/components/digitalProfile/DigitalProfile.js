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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../loader/Loader';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';


const DigitalProfile = () => {
  const { userId, username } = useParams();
  const navigate = useNavigate();
  const [profileTypeWhoShared, setProfileTypeWhoShared] = useState('');
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    address: '',
    bio: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    profilePic: 'https://via.placeholder.com/150',
  });

  const [receivedCards, setReceivedCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userResponse = await axios.get('  https://api.onesec.shop/auth/users/me/', {
        headers: {
          Authorization: `Token ${token}`
        }
      });

      const { id, first_name, last_name, email, username: authenticatedUsername, profile_type } = userResponse.data;

      // Check if the user ID or username from URL parameters does not match the authenticated user's details
      if (profile_type !== profile_type || userId !== id.toString() || username !== authenticatedUsername) {
        navigate('/not-authorized'); // Redirect to not authorized page
      } else {
        const endpoint = profile_type === 'employee' ? `https://api.onesec.shop/api/employees/${email}/` : `  https://api.onesec.shop/api/profiles/${id}/`;
        const profileResponse = await axios.get(endpoint, {
          headers: {
            Authorization: `Token ${token}`
          }
        });

        const profileData = profileResponse.data;

        setUser({
          firstName: first_name,
          lastName: last_name,
          email: email,
          phone: profileData.phone || '',
          position: profileData.position || '',
          address: profileData.address || '',
          bio: profileData.bio || '',
          facebook: profileData.facebook || '',
          instagram: profileData.instagram || '',
          linkedin: profileData.linkedin || '',
          profilePic: profileData.profile_pic || 'https://via.placeholder.com/150',
        });
        setLoading(false);
      }
    } catch (error) {
      console.error('Make sure create profile first to display data:', error);
      setLoading(false);
      toast.warn('Make sure create profile first to display data.');
    }
  }, [navigate, userId, username]);

  const fetchReceivedCards = useCallback(async () => {
    try {
      // setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.get('https://api.onesec.shop/api/received-cards/', {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      const cards = await Promise.all(response.data.results.map(async (card) => {
        setProfileTypeWhoShared(card.profile_type_who_shared);
        const userResponse = await axios.get(`https://api.onesec.shop/api/profiles/${card.shared_from}/`, {
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
      console.log('Received cards:', cards);
    } catch (error) {
      setLoading(false)
      // toast.error('Failed to fetch received cards.');
    }
  }, []);

  useEffect(() => {
    Aos.init({
      duration: 1200,
    });

    const fetchData = async () => {
      await fetchUserData();
      await fetchReceivedCards();
    };

    fetchData();
  }, [fetchUserData, fetchReceivedCards]);

  const handleShareToCard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.post('https://api.onesec.shop/api/share-profile-url/', {}, {
        headers: {
          Authorization: `Token ${token}`
        }
      });

      setShareLink(response.data.profile_url);
      setIsModalOpen(true);
      setLoading(false);
    } catch (error) {
      console.error('Error generating share link:', error);
      toast.error('Failed to generate share link.');
      setLoading(false);
    }
  };

  const handleWriteToNFC = async () => {
    try {
      const token = localStorage.getItem('authToken');
      axios.post('https://api.onesec.shop/api/nfc-write/', user, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      toast.success('Profile written to NFC successfully!');
    } catch (error) {
      console.error('Error writing to NFC:', error);
      toast.error('Failed to write profile to NFC.');
    }

  };

  const handleShareProfile = async (recipient) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.post('https://api.onesec.shop/api/share-profile/', { shared_to: recipient }, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      toast.success('Profile shared successfully!', response.data);
      setIsModalOpen(false);
      setLoading(false);
    } catch (error) {
      console.error('Error sharing profile:', error);
      toast.error('Failed to share profile.');
      setLoading(false);
    }
  };

  const handleShowDetails = (profileId, sharedProfileType) => {
    console.log('Profile Type:', profileTypeWhoShared);
    if (sharedProfileType === 'company') {
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
        <div data-aos="flip-right" className={styles.profileCard}>
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

        <ShareProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onShare={handleShareProfile}
          shareLink={shareLink}  // Pass the share link to the modal
        />
        <div data-aos="flip-right" className={styles.receivedCardsSection}>
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
                      <span
                        onClick={() => handleShowDetails(card.shared_from_user.user, card.profile_type_who_shared)}
                        className={styles.showDetailsButton}
                      >
                        View Card
                      </span>
                    </div>
                  </div>
                ))
            ) : (
              <p>No received cards</p>
            )}
          </div>
          <Link to="received-cards">Load More</Link>
        </div>
      </div>
      <div className={styles.cardActions}>
        <button onClick={handleShareToCard} className={styles.actionButton}>
          <i className="ri-share-forward-line"></i> <span>Share Profile</span>
        </button>
        <button onClick={handleWriteToNFC} className={styles.actionButton}>
          <i className="ri-wifi-line"></i> <span>Write to NFC</span>
        </button>
      </div>
      {loading && <Loader />}
      <ToastContainer />
    </>
  );
};

export default DigitalProfile;

