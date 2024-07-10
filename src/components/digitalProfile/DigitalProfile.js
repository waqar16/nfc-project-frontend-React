import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from '../../assets/css/profiles/DigitalProfile.module.css';
import Sidebar from '../sidebar/Sidebar';
import ShareProfileModal from '../shareProfileModal/ShareProfileModal';
import { useParams, useNavigate } from 'react-router-dom';

const DigitalProfile = () => {
  const { userId, username } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
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

  const [receivedCards, setReceivedCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userResponse = await axios.get('http://127.0.0.1:8000/auth/users/me/', {
        headers: {
          Authorization: `Token ${token}`
        }
      });

      const { id, first_name, last_name, email, username: authenticatedUsername, profile_type } = userResponse.data;

      // Check if the user ID or username from URL parameters does not match the authenticated user's details
      if (profile_type !== 'individual' || userId !== id.toString() || username !== authenticatedUsername) {
        navigate('/not-authorized'); // Redirect to not authorized page
      } else {
        const profileResponse = await axios.get(`http://127.0.0.1:8000/api/profiles/${id}/`, {
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
          address: profileData.address || '',
          bio: profileData.bio || '',
          facebook: profileData.facebook || '',
          instagram: profileData.instagram || '',
          linkedin: profileData.linkedin || '',
          profilePic: profileData.profilePic || 'https://via.placeholder.com/150',
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle errors, e.g., redirect to login page or show error message
    }
  }, [navigate, userId, username]);

  const fetchReceivedCards = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://127.0.0.1:8000/api/received-cards/', {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      const cards = await Promise.all(response.data.map(async (card) => {
        const userResponse = await axios.get(`http://127.0.0.1:8000/auth/users/${card.shared_from}/`, {
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
      console.log('Received cards:', cards);
    } catch (error) {
      console.error('Error fetching received cards:', error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData();
      await fetchReceivedCards();
    };

    fetchData();
  }, [fetchUserData, fetchReceivedCards]);

  const handleShareToCard = () => {
    setIsModalOpen(true);
  };

  const handleWriteToNFC = async () => {
    try {
      const token = localStorage.getItem('authToken');
      axios.post('http://127.0.0.1:8000/api/nfc-write/', user, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      alert('Profile written to NFC successfully!');
    } catch (error) {
      console.error('Error writing to NFC:', error);
      alert('Failed to write profile to NFC.');
    }
  };

  const handleShareProfile = async (recipient) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('http://127.0.0.1:8000/api/share-profile/', { shared_to: recipient }, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      alert('Profile shared successfully!', response.data);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error sharing profile:', error);
      alert('Failed to share profile.');
    }
  };

  const handleShowDetails = (profileId) => {
    navigate(`/profile/${profileId}`);
  };

  return (
    <>
      <div className={styles.digitalProfileContainer}>
        <Sidebar profileType="individual" />
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <img src={user.profilePic} alt="Profile" className={styles.profilePic} />
            <div className={styles.name}>{`${user.firstName} ${user.lastName}`}</div>
            <div className={styles.contactInfo}>
              <p><i className="ri-mail-fill"></i> {user.email}</p>
              <p><i className="ri-phone-fill"></i> {user.phone}</p>
              <p><i className="ri-map-pin-fill"></i> {user.address}</p>
            </div>
          </div>
          <div className={styles.profileBody}>
            <p className={styles.bio}>{user.bio}</p>
            <div className={styles.socialIcons}>
              {user.facebook && (
                <a href={user.facebook} target="_blank" rel="noopener noreferrer">
                  <i className="ri-facebook-circle-fill"></i>
                </a>
              )}
              {user.instagram && (
                <a href={user.instagram} target="_blank" rel="noopener noreferrer">
                  <i className="ri-instagram-fill"></i>
                </a>
              )}
              {user.linkedin && (
                <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
                  <i className="ri-linkedin-box-fill"></i>
                </a>
              )}
            </div>
          </div>
        </div>

        <ShareProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onShare={handleShareProfile}
        />
        <div className={styles.receivedCardsSection}>
          <h2>Received Digital Cards</h2>
          <div className={styles.receivedCardsList}>
            {receivedCards.length > 0 ? (
              receivedCards.map(card => (
                <div key={card.id} className={styles.receivedCard}>
                  <img src={card.shared_from_user.profilePic || 'https://via.placeholder.com/150'} alt="Profile" className={styles.receivedCardPic} />
                  <div className={styles.receivedCardDetails}>
                    <div className={styles.receivedCardName}>{`${card.shared_from_user.first_name} ${card.shared_from_user.last_name}`}</div>
                    <div className={styles.receivedCardDate}>Received on: {new Date(card.shared_at).toLocaleDateString()}</div>
                    <span onClick={() => handleShowDetails(card.shared_from_user.id)} className={styles.showDetailsButton}>
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
        <button onClick={handleWriteToNFC} className={styles.actionButton}>
          <i className="ri-wifi-line"></i> <span>Write to NFC</span>
        </button>
      </div>
    </>
  );
};

export default DigitalProfile;
