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
import website from '../../assets/img/socials/connection.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../loader/Loader';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';
import QrCodeModal from '../modal/QrCodeModal';
import { ClipLoader } from 'react-spinners';



const DigitalProfile = () => {
  const { userId, userName } = useParams();
  const navigate = useNavigate();
  const [profileTypeWhoShared, setProfileTypeWhoShared] = useState('');
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username:'',
    display_email: '',
    position: '',
    address: '',
    website: '',
    bio: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    whatsapp: '',
    profilePic: '',
  });

  const [receivedCards, setReceivedCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userResponse = await axios.get('https://api.onesec.shop/auth/users/me/', {
        headers: {
          Authorization: `Token ${token}`
        }
      });

      const { id, first_name, last_name, email, username: authenticatedUsername, profile_type } = userResponse.data;

      // Check if the user ID or username from URL parameters does not match the authenticated user's details
      if (profile_type !== profile_type || userId !== id.toString() || userName !== authenticatedUsername) {
        navigate('/not-authorized'); // Redirect to not authorized page
      } else {
        const endpoint = profile_type === 'employee' ? `https://api.onesec.shop/api/employees/${email}/` : `  https://api.onesec.shop/api/profiles/${userName}/`;
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
          display_email: profileData.display_email || '',
          username: profileData.username || '',
          phone: profileData.phone || '',
          position: profileData.position || '',
          address: profileData.address || '',
          bio: profileData.bio || '',
          website: profileData.website || '',
          facebook: profileData.facebook || '',
          instagram: profileData.instagram || '',
          linkedin: profileData.linkedin || '',
          whatsapp: profileData.whatsapp || '',
          profilePic: profileData.profile_pic || '',
        });
        setLoading(false);
      }
    } catch (error) {
      console.error('Make sure create profile first to display data:', error);
      setLoading(false);
      toast.warn('Make sure create profile first to display data.');
    }
  }, [navigate, userId, userName]);

  const fetchReceivedCards = useCallback(async () => {
    try {
      setLoading2(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.get('https://api.onesec.shop/api/received-cards/', {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      const cards = await Promise.all(response.data.results.map(async (card) => {
        setProfileTypeWhoShared(card.profile_type_who_shared);
        const userResponse = await axios.get(`https://api.onesec.shop/api/profiles/${card.shared_from_username}/`, {
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
      setLoading2(false);
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
      // setLoading(true);
      // const token = localStorage.getItem('authToken');
      // const response = await axios.post('https://api.onesec.shop/api/share-profile-url/', {}, {
      //   headers: {
      //     Authorization: `Token ${token}`
      //   }
      // });

      // setShareLink(response.data.profile_url);
      setShareLink(`https://letsconnect.onesec.shop/profile/${user.username}`)
      setIsShareModalOpen(true);
      // setLoading(false);
    } catch (error) {
      console.error('Error generating share link:', error);
      toast.error('Failed to generate share link.');
      setLoading(false);
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
      setIsShareModalOpen(false);
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

  const handleShareQrCode = () => {
    const shareLink = `http://letsconnect.onesec.shop/profile/${user.username}`;
    setShareLink(shareLink);
    setIsModalOpen(true);
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
        <Sidebar profileType={localStorage.getItem('profile_type')} profilePic= {localStorage.getItem('profile_pic')} />
        <div data-aos="flip-right" className={styles.profileCard}>
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
            { user.phone || user.address || user.display_email ?
            (<p className={styles.titleText}>Contact me</p>)
            : null
            }
            <div className={styles.contactInfo}>
            {user.display_email && (
            <p>
              <a href={`mailto:${user.display_email}`}>
                <i className="ri-mail-fill"></i> {user.display_email}
              </a>
            </p>
          )}
          {user.phone && (
            <p>
              <a href={`tel:${user.phone}`}>
                <i className="ri-phone-fill"></i> {user.phone}
              </a>
            </p>
          )}
          {user.address && (
            <p>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(user.address)}`} target="_blank" rel="noopener noreferrer" className="contact-link">
                <i className="ri-map-pin-fill contact-icon"></i> {user.address}
              </a>
            </p>
          )}
              {/* <p><i className="ri-mail-fill"></i> {user.email}</p>
              <p><i className="ri-phone-fill"></i> {user.phone}</p>
              <p><i className="ri-map-pin-fill"></i> {user.address}</p> */}
              {/* <p><i className="ri-global-fill"></i> <a href={user.website} target="_blank" rel="noopener noreferrer">{user.website}</a></p> */}

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
                <a
                href={`https://wa.me/${user.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
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

        <button onClick={handleShareToCard} className={styles.actionButton}>
          <i className="ri-share-forward-line"></i> 
        </button>
        <button onClick={handleShareQrCode} className={styles.actionButton}>
          <i className="ri-qr-code-line"></i>
        </button>
      </div>
      </div>
        </div>

        <ShareProfileModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          onShare={handleShareProfile}
          shareLink={shareLink}  // Pass the share link to the modal
          name={`${user.firstName} ${user.lastName}`}
          position={user.position}
          profilePic={user.profilePic} 
        />
        <QrCodeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          shareLink={shareLink}
          name={`${user.firstName} ${user.lastName}`}
          position={user.position}
          profilePic={user.profilePic} 
        />
        {/* <div data-aos="flip-right" className={styles.receivedCardsSection}>
          <div className={styles.receivedCardsList}>
            <h2>Received Digital Cards</h2>

            {receivedCards.length > 0 ? (
              receivedCards
                .sort((a, b) => new Date(b.shared_at) - new Date(a.shared_at)) // Sort by shared_at date in descending order
                .map(card => (
                  <div key={card.id} className={styles.receivedCard}>
                    <div className={styles.receivedCardDetails}>
                      <div className={styles.receivedCardName}>
                        {` From: ${card.shared_from_user.email}`}
                      </div>
                      <div className={styles.receivedCardDate}>Received on: {timeAgo(new Date(card.shared_at))}</div>
                      <span
                        onClick={() => handleShowDetails(card.shared_from_user.username, card.profile_type_who_shared)}
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
        </div> */}
        <div data-aos="flip-right" className={styles.receivedCardsSection}>
  <div className={styles.receivedCardsList}>
    <h2>Received Digital Cards</h2>

    {loading2 ? (
      <div className={styles.loaderContainer}>
        <ClipLoader color="#4CAF50" size={25} />
        {/* <p>Loading received cards...</p> */}
      </div>
    ) : (
      receivedCards.length > 0 ? (
        receivedCards
          .sort((a, b) => new Date(b.shared_at) - new Date(a.shared_at)) // Sort by shared_at date in descending order
          .slice(0, 2)
          .map(card => (
            <div key={card.id} className={styles.receivedCard}>
              <div className={styles.receivedCardDetails}>
                <div className={styles.receivedCardName}>
                  {` From: ${card.shared_from_user.email}`}
                </div>
                <div className={styles.receivedCardDate}>Received on: {timeAgo(new Date(card.shared_at))}</div>
                <span
                  onClick={() => handleShowDetails(card.shared_from_user.username, card.profile_type_who_shared)}
                  className={styles.showDetailsButton}
                >
                  View Card
                </span>
              </div>
            </div>
          ))
      ) : (
        <p>No received cards</p>
      )
    )}
  </div>
  <Link to="received-cards">Load More</Link>
</div>
      </div>

      {loading && <Loader />}
      <ToastContainer />
    </>
  );
};

export default DigitalProfile;

