import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../assets/css/index/Sidebar.module.css';
import axios from 'axios';

const Sidebar = ({ profileType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('  http://localhost:8000/auth/users/me/', {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle errors, e.g., redirect to login page or show error message
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebar__header}></div>
        <ul className={styles.sidebar__list}>
          {profileType === 'individual' && (
            <>
              {/* <li className={styles.sidebar__item}>
                <Link to={`/profile-summary/${userData.id}/${userData.username}`}>
                  <i className="ri-user-line"></i>
                  Profile Summary
                </Link>
              </li> */}
              <div className={styles.sidebar__toggle} onClick={toggleSidebar}>
                <i className="ri-menu-line"></i>
              </div>
              <li className={styles.sidebar__item}>
                <Link to={`/user-profile/${userData.id}/${userData.username}`}>
                  <i className="ri-profile-line"></i>
                  Profile Management
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link to={`/nfc-management/${userData.id}/${userData.username}`}>
                  <i className="ri-wifi-line"></i>
                  NFC Card Management
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link to={`/digital-profile/${userData.id}/${userData.username}`}>
                  <i className="ri-file-text-line"></i>
                  Digital Card Management
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link to={`/manage-appointments/${userData.id}/${userData.username}`}>
                  <i className="ri-calendar-line"></i>
                  Manage Appointments
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link to={`/user-analytics/${userData.id}/${userData.username}`}>
                  <i className="ri-bar-chart-line"></i>
                  Analytics
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link to={`/account-deletion/`}>
                  <i className="ri-settings-3-line"></i>
                  Account Deletion
                </Link>
              </li>
            </>
          )}
          {profileType === 'company' && (
            <>
              <li className={styles.sidebar__item}>
                <Link to={`/company-profile/${userData.id}/${userData.username}`}>
                  <i className="ri-profile-line"></i>
                  Company Profile
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link to={`/team-management/${userData.id}/${userData.username}`}>
                  <i className="ri-team-line"></i>
                  Team Management
                </Link>
              </li>

              <li className={styles.sidebar__item}>
                <Link to={`/manage-appointments/${userData.id}/${userData.username}`}>
                  <i className="ri-calendar-line"></i>
                  Manage Appointments
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link to={`/company-analytics/${userData.id}/${userData.username}`}>
                  <i className="ri-bar-chart-line"></i>
                  Analytics
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link to={`/company-card/${userData.id}/${userData.username}`}>
                <i className="ri-file-text-line"></i>
                Company Card
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link to={`/account-deletion/`}>
                  <i className="ri-settings-3-line"></i>
                  Account Deletion
                </Link>
              </li>
            </>
          )}
          {profileType === 'employee' && (
            <>
              <li className={styles.sidebar__item}>
                <Link to={`/employee-profile/${userData.id}/${userData.username}`}>
                  <i className="ri-profile-line"></i>
                  Employee Profile
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link to={`/nfc-management/${userData.id}/${userData.username}`}>
                  <i className="ri-wifi-line"></i>
                  NFC Card Management
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link to={`/digital-profile/${userData.id}/${userData.username}`}>
                  <i className="ri-file-text-line"></i>
                  Digital Card Management
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link to={`/manage-appointments/${userData.id}/${userData.username}`}>
                  <i className="ri-calendar-line"></i>
                  Manage Appointments
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link to={`/user-analytics/${userData.id}/${userData.username}`}>
                  <i className="ri-bar-chart-line"></i>
                  Analytics
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className={styles.sidebar__toggle} onClick={toggleSidebar}>
        <i className="ri-menu-line"></i>
      </div>
    </div>
  );
};

export default Sidebar;
