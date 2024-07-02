import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../assets/css/index/Sidebar.module.css'; // Import the CSS module

const Sidebar = ({ profileType }) => {
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
          {profileType === 'individual' && (
            <>
              <li className={styles.sidebar__item}>
                <Link to="/profile-summary">
                  <i className="ri-user-line"></i>
                  Profile Summary
                </Link>
              </li>
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
            </>
          )}
          {profileType === 'company' && (
            <>
              <li className={styles.sidebar__item}>
                <Link to="/company-overview">
                  <i className="ri-building-line"></i>
                  Company Overview
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link to="/team-management">
                  <i className="ri-team-line"></i>
                  Team Management
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link to="/project-management">
                  <i className="ri-projector-line"></i>
                  Project Management
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link to="/company-profile">
                  <i className="ri-profile-line"></i>
                  Company Profile
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link to="/client-management">
                  <i className="ri-customer-service-line"></i>
                  Client Management
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link to="/company-analytics">
                  <i className="ri-bar-chart-line"></i>
                  Company Analytics
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
