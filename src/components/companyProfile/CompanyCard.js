import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from '../../assets/css/profiles/DigitalProfile.module.css';
import Sidebar from '../sidebar/Sidebar';
import ShareProfileModal from '../shareProfileModal/ShareProfileModal';
import { useParams, useNavigate } from 'react-router-dom';
// import logo from '../../assets/img/logo.png';  // Logo image for the company
import linkedin from '../../assets/img/socials/linkedin.png';  // LinkedIn icon image
import website from '../../assets/img/socials/connection.png';  // Website icon image
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../loader/Loader';
import { Link } from 'react-router-dom';
import QrCodeModal from '../modal/QrCodeModal';
import { ClipLoader } from 'react-spinners';

const CompanyCard = () => {
  const { userId, username } = useParams();
  const navigate = useNavigate();
  const [receivedCards, setReceivedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [profileTypeWhoShared , setProfileTypeWhoShared] = useState('');
  const [loading2, setLoading2] = useState(true);
  const [company, setCompany] = useState({
    company_name: '',
    admin_name: '',
    email: '',
    display_email: '',  
    phone: '',
    username: '',
    companyLogo: '',
    address: '',
    company_description: '',
    website: '',
    linkedin: '',
    employees: [],
  });

  // Fetch company data

  const companyLogo = localStorage.getItem('company_logo');
  const profilePic = localStorage.getItem('profile_pic');

  const fetchCompanyData = async () => {
    try {
      setLoading2(true);
      const token = localStorage.getItem('authToken');
      const userResponse = await axios.get('https://api.onesec.shop/auth/users/me/', {
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
        const companyResponse = await axios.get(`https://api.onesec.shop/api/companies/${username}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        setCompany({
          company_name: companyResponse.data.company_name || '',
          admin_name: companyResponse.data.admin_name || '',
          email: email || '',
          display_email: companyResponse.data.display_email || '',
          phone: companyResponse.data.phone || '',
          username: companyResponse.data.usernmae || '',
          companyLogo: companyResponse.data.company_logo ,
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
            display_email: '',
            companyLogo:'',
            username: '',
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
      toast.warn('Make sure create profile first to display data.');
    }
  };
  // Fetch received cards
  const fetchReceivedCards = useCallback(async () => {
    try {
      // setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.get('https://api.onesec.shop/api/received-cards/', {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      //   setProfileTypeWhoShared(response.data.profile_type_who_shared);
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
    } catch (error) {
      setLoading2(false);
      console.error('Error fetching received cards:', error);
    }
  }, []);

  useEffect(() => {
    fetchCompanyData();
    fetchReceivedCards();
  }, [navigate, userId, username, fetchReceivedCards]);


  // Handle share profile to card
  const handleShareToCard = async () => {
    try {

      // setLoading(true);
      // const token = localStorage.getItem('authToken');
      // const response = await axios.post('https://api.onesec.shop/api/share-profile-url/', {}, {
      //   headers: {
      //     Authorization: `Token ${token}`
      //   }
      // });
      setShareLink(`https://letsconnect.onesec.shop/company/${username}`)
  
      // setShareLink(response.data.profile_url);
      setIsShareModalOpen(true);
    } catch (error) {
      console.error('Error generating share link:', error);
      toast.error('Failed to generate share link.');
    } finally {
      setLoading(false);
    }
  };
  // Handle share profile
  const handleShareProfile = async (recipient) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.post('https://api.onesec.shop/api/share-profile/', { shared_to: recipient }, {
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

  const handleShowDetails = (profileId, sharedProfileType, profileUsername) => {
    console.log('Profile Type:', profileTypeWhoShared);
    if (sharedProfileType === 'company') {
      navigate(`/company/${profileUsername}`);
    }
    else {
      navigate(`/profile/${profileUsername}`);
    }
  };

  const handleShareQrCode = () => {
    const shareLink = `http://letsconnect.onesec.shop/profile/${username}`;
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
        <Sidebar profileType={localStorage.getItem('profile_type')} logo={companyLogo} profilePic={profilePic} />
        <div className={styles.profileCard}>
          <div className={styles.profileHeaderCompany}>
            <div className={styles.profileinfo}>
            {company.companyLogo ? (
          <img src={company.companyLogo} alt="Profile" className={styles.logo} />
        ) : (
          <>
          <span style={{"padding":"30px"}}>Your Logo Here</span>
          </>
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
                  <i className="ri-mail-fill"></i> {company.display_email}
                </p>
              )}
              {company.phone && (
                <p>
                  <i className="ri-phone-fill"></i> {company.phone}
                </p>
              )}
              {company.address && (
                <p>
                  <i className="ri-map-pin-fill"></i> {company.address}
                </p>
              )}
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

        <button onClick={handleShareToCard} className={styles.actionButton}>
          <i className="ri-share-forward-line"></i> 
        </button>
        <button onClick={handleShareQrCode} className={styles.actionButton}>
          <i className="ri-qr-code-line"></i>
        </button>
      </div>
      </div>
        </div>
{/* 
        <ShareProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onShare={handleShareProfile}
          shareLink={shareLink}  // Pass the share link to the modal
        /> */}



{/* <div className={styles.receivedCardsSection}>
    <div className={styles.receivedCardsList}>
    <h2>Received Digital Cards</h2>

        {receivedCards.length > 0 ? (
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
                            <span onClick={() => handleShowDetails(card.shared_from_user.user, card.profile_type_who_shared, card.shared_from_username)} className={styles.showDetailsButton}>
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


<div data-aos="flip-right" className="p-6 bg-white shadow-2xl rounded-lg mx-5 sm:mx-10 min-w-[300px] md:min-w-[300px] lg:min-w-[500px]">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Recently Received Cards</h2>

      {loading2 ? (
        <div className="flex justify-center items-center py-6">
          <ClipLoader color="#4CAF50" size={30} />
        </div>
      ) : receivedCards.length > 0 ? (
        receivedCards
          .sort((a, b) => new Date(b.shared_at) - new Date(a.shared_at))
          .slice(0, 4)
          .map(card => (
            <div key={card.id} className="flex items-center space-x-6 p-6 border border-gray-300 rounded-lg bg-gray-50 shadow-lg hover:shadow-2xl transition-shadow duration-300 mb-8">
              {/* Profile Picture */}
              <img
                src={card.shared_from_user.profile_pic || card.shared_from_user.company_logo} // Replace with dynamic profile picture URL
                alt="Profile"
                className={`w-24 h-30 object-cover border-blue-500 ${card.shared_from_user.profile_pic ? 'rounded-full' : 'rounded-lg'}`}
              />

              {/* User Details */}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    {/* First Name and Last Name */}
                    <h3 className="text-2xl font-semibold text-gray-800">
                    {card.shared_from_user.first_name && card.shared_from_user.last_name
                      ? `${card.shared_from_user.first_name} ${card.shared_from_user.last_name}`
                      : card.shared_from_user.company_name}
                  </h3>
                    {/* Username */}
                    <p className="text-sm text-gray-500">@{card.shared_from_user.username}</p>
                    {/* Received Date */}
                  <p className="text-sm text-gray-400">{timeAgo(new Date(card.shared_at))}</p>
                  </div>

                </div>
                {/* View Card Button */}
                <button
                  onClick={() => handleShowDetails(card.shared_from_user.username, card.profile_type_who_shared)}
                  className="mt-4 inline-block text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-full transition duration-300 ease-in-out"
                >
                  View Card
                </button>
              </div>
            </div>
          ))
      ) : (
        <p className="text-center text-lg text-gray-500 py-6">No received cards</p>
      )}

      {/* Load More Button */}
      <Link
        to="received-cards"
        className="block text-center text-white text-sm font-medium mt-10 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-full transition duration-300 ease-in-out"
      >
        View all
      </Link>
    </div>







      </div>

      <ShareProfileModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          onShare={handleShareProfile}
          shareLink={shareLink}  
          name={`${company.company_name}`}
          // position={company.position}
          logo={company.companyLogo} 
        />
        <QrCodeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          shareLink={shareLink}
          name={`${company.company_name}`}
          // position={company.position}
          logo={company.companyLogo} 
        />

      {loading && <Loader />}
      <ToastContainer />
    </>
  );
};

export default CompanyCard;
