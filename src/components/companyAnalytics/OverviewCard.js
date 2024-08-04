import React from 'react';
import styles from '../../assets/css/profiles/CompanyAnalytics.module.css';

const OverviewCard = ({ totalCards }) => {
  return (
    <div className={styles.overviewCard}>
      <h3>Total Cards Distributed to Employees</h3>
      <p>{totalCards}</p>
    </div>
  );
};

export default OverviewCard;
