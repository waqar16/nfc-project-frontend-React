import '../../assets/css/styles.css';
import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import Logo from '../../assets/img/logo.png';


const Navbar = () => {
  useEffect(() => {
    const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close'),
      search = document.getElementById('search'),
      searchBtn = document.getElementById('search-btn'),
      searchClose = document.getElementById('search-close'),
      login = document.getElementById('login'),
      loginBtn = document.getElementById('login-btn'),
      loginClose = document.getElementById('login-close');

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

    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        login.classList.add('show-login');
      });
    }

    if (loginClose) {
      loginClose.addEventListener('click', () => {
        login.classList.remove('show-login');
      });
    }

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

      if (loginBtn) {
        loginBtn.removeEventListener('click', () => {
          login.classList.add('show-login');
        });
      }

      if (loginClose) {
        loginClose.removeEventListener('click', () => {
          login.classList.remove('show-login');
        });
      }
    };
  }, []);

  return (
    <>
      {/*==================== HEADER ====================*/}
      <header className="header" id="header">
        <nav className="nav container">
            <img src={Logo}  alt="Logo" className="nav__logo" />
        {/* <a href="#" className="nav__logo">Logo</a> */}
          <div className="nav__menu" id="nav-menu">
            <ul className="nav__list">
              <li className="nav__item">
                <Link className='nav__link' to="/">Home</Link>
              </li>
              <li className="nav__item">
              <Link className='nav__link' to="/about-us">About Us</Link>
              </li>
              <li className="nav__item">
                <Link to={'/schedule-meeting'} className="nav__link">Schedule a Meeting</Link>
              </li>
              <li className="nav__item">
                <Link className='nav__link' to="/FAQS">FAQs</Link>
              </li>
              {/* <li className="nav__item">
                <a href="#" className="nav__link">Pricing</a>
              </li>
              <li className="nav__item">
                <a href="#" className="nav__link">Services</a>
              </li> */}
            </ul>

            {/* Close button */}
            <div className="nav__close" id="nav-close">
              <i className="ri-close-line"></i>
            </div>
          </div>

          <div className="nav__actions">
            {/* Search button */}
            <i className="ri-search-line nav__search" id="search-btn"></i>

            {/* Login button */}
            <Link to={'/user-profile'}> <i className="ri-user-line nav__login"></i></Link>

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

      {/*==================== LOGIN ====================*/}
      {/* <div className="login" id="login">
        <form action="" className="login__form">
          <h2 className="login__title">Log In</h2>

          <div className="login__group">
            <div>
              <label htmlFor="email" className="login__label">Email</label>
              <input type="email" placeholder="Write your email" id="email" className="login__input" />
            </div>
            <div>
              <label htmlFor="password" className="login__label">Password</label>
              <input type="password" placeholder="Enter your password" id="password" className="login__input" />
            </div>
          </div>

          <div>
            <p className="login__signup">
              You do not have an account? <a href="#">Sign up</a>
            </p>

            <a href="#" className="login__forgot">
              You forgot your password
            </a>

            <button type="submit" className="login__button">Log In</button>
          </div>
        </form>
        <i className="ri-close-line login__close" id="login-close"></i>
      </div> */}
      
    </>
  );
};

export default Navbar;
