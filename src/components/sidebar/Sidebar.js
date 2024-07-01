import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../assets/css/index/Sidebar.module.css'; // Import the CSS module

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebar__header}>
          {/* <h3>Menu</h3> */}
          {/* <i className={`ri-close-line ${styles.sidebar__close}`} onClick={toggleSidebar}></i> */}
        </div>
        <ul className={styles.sidebar__list}>
          {/* <li className={styles.sidebar__item}>
            <Link to="/dashboard">
              <i className="ri-dashboard-line"></i>
              Dashboard
            </Link>
          </li>
          <li className={styles.sidebar__item}>
            <Link to="/services">
              <i className="ri-server-line"></i>
              Services
            </Link>
          </li>
          <li className={styles.sidebar__item}>
            <Link to="/settings">
              <i className="ri-settings-3-line"></i>
              Settings
            </Link>
          </li>
          <li className={styles.sidebar__item}>
            <Link to="/profile">
              <i className="ri-user-line"></i>
              Profile
            </Link>
          </li>
          <li className={styles.sidebar__item}>
            <Link to="/logout">
              <i className="ri-logout-box-r-line"></i>
              Logout
            </Link>
          </li> */}
          <li className={styles.sidebar__item}>
            <Link to="/user-profile">
              <i className="ri-profile-line"></i>
              Profile Management
            </Link>
          </li>
          <li className={styles.sidebar__item}>
            <Link to="/nfc-management">
              <i className="ri-wifi-line"></i>
              NFC Card Management
            </Link>
          </li>
          <li className={styles.sidebar__item}>
            <Link to="/digital-profile">
              <i className="ri-file-text-line"></i>
              Digital Card Management
            </Link>
          </li>
          <li className={styles.sidebar__item}>
            <Link to="/schedule-meeting">
              <i className="ri-calendar-line"></i>
              Appointment Scheduling
            </Link>
          </li>
          <li className={styles.sidebar__item}>
            <Link to="/analytics">
              <i className="ri-bar-chart-line"></i>
              Analytics
            </Link>
          </li>
        </ul>
      </div>
      <div className={styles.sidebar__toggle} onClick={toggleSidebar}>
        <i className="ri-menu-line"></i>
      </div>
    </div>
  );
};

export default Sidebar;
