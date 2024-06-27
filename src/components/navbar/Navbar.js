import '../../assets/css/index/styles.css';
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/img/logo.png';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/');
  };

  const closeProfile = useCallback(() => {
    const profile = document.getElementById('profile');
    if (profile) {
      profile.classList.remove('show-profile');
    }
  }, []);

  useEffect(() => {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const search = document.getElementById('search');
    const searchBtn = document.getElementById('search-btn');
    const searchClose = document.getElementById('search-close');
    const profile = document.getElementById('profile');
    const profileBtn = document.getElementById('profile-btn');
    const profileClose = document.getElementById('profile-close');

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

      profileItems.forEach((item) => {
        item.removeEventListener('click', closeProfile);
      });
    };
  }, [closeProfile]);

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
              <li className="nav__item">
                <Link to={'/schedule-meeting'} className="nav__link">
                  Schedule a Meeting
                </Link>
              </li>
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
            <Link to={'user-profile'}>
              <li className="profile__item">View Profile</li>
            </Link>
            <Link to={'settings'}>
              <li className="profile__item">Settings</li>
            </Link>
            <Link to={'help'}>
              <li className="profile__item">Help</li>
            </Link>
            <Link to={'/'}>
              <li onClick={handleLogout} className="profile__item">
                Logout
              </li>
            </Link>
          </ul>
        ) : (
          <div className="nonAuthbtns">
            <Link to={'/personal-login'}>
              <button className="login__btn">Login</button>
            </Link>
            <Link to={'/company-signup'}>
              <button className="login__btn">Company Signup</button>
            </Link>
            <Link to={'/personal-signup'}>
              <button className="login__btn">Personal Signup</button>
            </Link>
          </div>
        )}
        <i className="ri-close-line profile__close" id="profile-close"></i>
      </div>
    </>
  );
};

export default Navbar;
