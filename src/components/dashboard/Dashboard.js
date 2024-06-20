import React from 'react';
import styles from '../../assets/css/Dashboard.module.css';

const Dashboard = ({ analytics }) => {
  return (
    <div className={styles.dashboardContainer}>
      <h3>Profile Visit Analytics</h3>
      <div className={styles.analyticsCard}>
        <div className={styles.analyticsItem}>
          <i className="ri-smartphone-fill"></i>
          <p>NFC Visits</p>
          <h4>{analytics.nfc}</h4>
        </div>
        <div className={styles.analyticsItem}>
          <i className="ri-external-link-line"></i>
          <p>Digital Card Visits</p>
          <h4>{analytics.digitalCard}</h4>
        </div>
        <div className={styles.analyticsItem}>
          <i className="ri-link"></i>
          <p>Total Visits</p>
          <h4>{analytics.total}</h4>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
