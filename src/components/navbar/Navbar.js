import '../../assets/css/index/styles.css';
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/img/logo.png';
import axios from 'axios';




const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [profileType, setProfileType] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');



  useEffect(() => {
    window.scrollTo(0, 0);

    const userInfo = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        setIsAuthenticated(true);
        try {
          const response = await axios.get('  https://waqar123.pythonanywhere.com/auth/users/me', {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          setProfileType(response.data.profile_type);
          setUserId(response.data.id);
          setUsername(response.data.username)

          setLoading(false); // Data fetching complete
        } catch (error) {
          console.error('Error fetching profile type:', error);
          setLoading(false); // Data fetching complete even if there is an error
        }
      } else {
        setLoading(false); // No token found, data fetching complete
      }
    };

    userInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/');
    const profile = document.getElementById('profile');
    if (profile) {
      profile.classList.remove('show-profile');
    }  
    // window.location.reload();
  };

  const manageProfile = () => {
    // if (loading) {
    //   console.log('Profile type is still loading.');
    //   return;
    // }

    // if (!profileType) {
    //   console.log('Profile type is not set yet.');
    //   return;
    // }

    // console.log(profileType);  
    if (profileType === 'individual') {
      navigate(`/user-profile/${userId}/${username}`);
    } else if (profileType === 'company'){
      navigate(`/company-profile/${userId}/${username}`);
    } else if (profileType === 'employee'){
      navigate(`/employee-profile/${userId}/${username}`);
    }
  };

  const closeProfile = useCallback(() => {
    const profile = document.getElementById('profile');
    if (profile) {
      profile.classList.remove('show-profile');
    }
  }, []);

  const closeNotifications = useCallback(() => {
    const notifications = document.getElementById('notifications');
    if (notifications) {
      notifications.classList.remove('show-notifications');
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const search = document.getElementById('search');
    const searchBtn = document.getElementById('search-btn');
    const searchClose = document.getElementById('search-close');
    const profile = document.getElementById('profile');
    const profileBtn = document.getElementById('profile-btn');
    const profileClose = document.getElementById('profile-close');
    const notifications = document.getElementById('notifications');
    const notificationsBtn = document.getElementById('notifications-btn');
    const notificationsClose = document.getElementById('notifications-close');

    if (navToggle) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
      });
    }

    if (navClose) {
      navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        search.classList.add('show-search');
      });
    }

    if (searchClose) {
      searchClose.addEventListener('click', () => {
        search.classList.remove('show-search');
      });
    }

    if (profileBtn) {
      profileBtn.addEventListener('click', () => {
        profile.classList.add('show-profile');
      });
    }

    if (profileClose) {
      profileClose.addEventListener('click', closeProfile);
    }

    if (notificationsBtn) {
      notificationsBtn.addEventListener('click', () => {
        notifications.classList.add('show-notifications');
      });
    }

    if (notificationsClose) {
      notificationsClose.addEventListener('click', closeNotifications);
    }

    const profileItems = document.querySelectorAll('.profile__item');
    profileItems.forEach((item) => {
      item.addEventListener('click', closeProfile);
    });

    // Cleanup event listeners on component unmount
    return () => {
      if (navToggle) {
        navToggle.removeEventListener('click', () => {
          navMenu.classList.add('show-menu');
        });
      }

      if (navClose) {
        navClose.removeEventListener('click', () => {
          navMenu.classList.remove('show-menu');
        });
      }

      if (searchBtn) {
        searchBtn.removeEventListener('click', () => {
          search.classList.add('show-search');
        });
      }

      if (searchClose) {
        searchClose.removeEventListener('click', () => {
          search.classList.remove('show-search');
        });
      }

      if (profileBtn) {
        profileBtn.removeEventListener('click', () => {
          profile.classList.add('show-profile');
        });
      }

      if (profileClose) {
        profileClose.removeEventListener('click', closeProfile);
      }

      if (notificationsBtn) {
        notificationsBtn.removeEventListener('click', () => {
          notifications.classList.add('show-notifications');
        });
      }

      if (notificationsClose) {
        notificationsClose.removeEventListener('click', closeNotifications);
      }

      profileItems.forEach((item) => {
        item.removeEventListener('click', closeProfile);
      });
    };
  }, [closeProfile, closeNotifications]);

  return (
    <>
      {/*==================== HEADER ====================*/}
      <header className="header" id="header">
        <nav className="nav container">
          <Link to={'/'}>
            <img src={Logo} alt="Logo" className="nav__logo" />
          </Link>

          <div className="nav__menu" id="nav-menu">
            <ul className="nav__list">
              <li className="nav__item">
                <Link className="nav__link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav__item">
                <Link className="nav__link" to="/about-us">
                  About Us
                </Link>
              </li>
              {/* <li className="nav__item">
                <Link to={'/schedule-meeting'} className="nav__link">
                  Schedule a Meeting
                </Link>
              </li> */}
              <li className="nav__item">
                <Link className="nav__link" to="/FAQS">
                  FAQs
                </Link>
              </li>
            </ul>
            {/* Close button */}
            <div className="nav__close" id="nav-close">
              <i className="ri-close-line"></i>
            </div>
          </div>

          <div className="nav__actions">
            {/* Search button */}
            <i className="ri-search-line nav__search" id="search-btn"></i>

            {/* Notification button */}
            {/*<i className="ri-notification-line nav__search" id="notifications-btn"></i> */}

            {/* Profile button */}
            <i className="ri-user-line nav__login" id="profile-btn"></i>

            {/* Toggle button */}
            <div className="nav__toggle" id="nav-toggle">
              <i className="ri-menu-line"></i>
            </div>
          </div>
        </nav>
      </header>

      {/*==================== SEARCH ====================*/}
      <div className="search" id="search">
        <form action="" className="search__form">
          <i className="ri-search-line search__icon"></i>
          <input type="search" placeholder="What are you looking for?" className="search__input" />
        </form>
        <i className="ri-close-line search__close" id="search-close"></i>
      </div>

      {/*==================== PROFILE ====================*/}
      <div className="profile" id="profile">
        {isAuthenticated ? (
          <ul className="profile__list">
            <span >
              <li onClick={manageProfile} className="profile__item">Manage Profile</li>
            </span>
            {/* <Link to={'manage-card'}>
              <li className="profile__item">NFC Card</li>
            </Link>
            <Link to={'digital-profile'}>
              <li className="profile__item">Digital Profile</li>
            </Link> */}
            <Link to={'/'}>
              <li onClick={handleLogout} className="profile__item">
                Logout
              </li>
            </Link>


          </ul>
        ) : (
          <div className="nonAuthbtns">
            <Link to={'/login'}><i className='ri-user-line'></i> Login / Signup?
            </Link>
            {/* <Link to={'/company-signup'}>
              <button className="login__btn">Company Signup</button>
            </Link>
            <Link to={'/personal-signup'}>
              <button className="login__btn">Personal Signup</button>
            </Link> */}
          </div>
        )}
        <i className="ri-close-line profile__close" id="profile-close"></i>
      </div>

      {/*==================== NOTIFICATIONS ====================*/}
      <div className="notifications" id="notifications">
        <div className="notifications-container">
          <ul className="notifications__list">
            <li className="notifications__item"><i style={{color:"black", padding:"8px"}} className="ri-notification-line "></i> Digital card sent successfully to user 125</li>
          </ul>
          <ul className="notifications__list">
          <li className="notifications__item"><i style={{color:"black", padding:"8px"}} className="ri-notification-line "></i> Digital card sent successfully to user 125</li>
          </ul>
          <ul className="notifications__list">
          <li className="notifications__item"><i style={{color:"black", padding:"8px"}} className="ri-notification-line "></i> Digital card sent successfully to user 125</li>
          </ul>
        </div>
        <i className="ri-close-line notifications__close" id="notifications-close"></i>
      </div>
    </>
  );
};

export default Navbar;
