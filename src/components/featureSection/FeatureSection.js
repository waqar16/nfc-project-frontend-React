import React from 'react';
import styles from '../../assets/css/FeatureSection.module.css';

const features = [
  {
    icon: 'ri-user-line',
    title: 'Profile Management',
    description: 'Manage your personal and professional profiles with ease.',
  },
  {
    icon: 'ri-wifi-line',  // Changed icon to better represent NFC integration
    title: 'NFC Card Integration',
    description: 'Easily write and update information on NFC cards for quick sharing.',
  },
  {
    icon: 'ri-file-list-line',
    title: 'Digital Card Creation',
    description: 'Design, create, and send digital cards seamlessly.',
  },
  {
    icon: 'ri-calendar-check-line',
    title: 'Appointment Scheduling',
    description: 'Schedule and manage appointments efficiently.',
  },
];

const FeaturesSection = () => {
  return (
    <section className={styles.featuresSection}>
      <h2 className={styles.title}>Core Features</h2>
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
