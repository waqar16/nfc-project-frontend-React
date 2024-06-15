import React from 'react';
import styles from '../../assets/css/FeatureSection.module.css';

const features = [
    { icon: 'ri-user-line', title: 'Profile Management', description: 'Manage your personal and professional profiles with ease.' },
    { icon: 'ri-wifi-line', title: 'NFC Card Writing', description: 'Easily write and update information on NFC cards.' },
    { icon: 'ri-calendar-line', title: 'Appointment Scheduling', description: 'Schedule and manage appointments efficiently.' },
    { icon: 'ri-group-line', title: 'Multi-Organization Support', description: 'Support for multiple organizations under a white-label model.' },
  ];
  
  const FeaturesSection = () => {
    return (
      <section className={styles.featuresSection}>
        <h2 className={styles.title}>Features</h2>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <i className={`${feature.icon} ${styles.icon}`}></i>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default FeaturesSection;
