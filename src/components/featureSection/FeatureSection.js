import React from 'react';
import styles from '../../assets/css/FeatureSection.module.css';

const features = [
  { title: 'Profile Management', description: 'Manage your personal and professional profiles.' },
  { title: 'NFC Card Writing', description: 'Easily write information to NFC cards.' },
  { title: 'Appointment Scheduling', description: 'Schedule meetings and appointments seamlessly.' },
  { title: 'Multi-Organization Support', description: 'Support for multiple organizations with a white-label model.' },
];

const FeaturesSection = () => {
  return (
    <section className={styles.featuresSection}>
      <h2 className={styles.title}>Features</h2>
      <div className={styles.featuresGrid}>
        {features.map((feature, index) => (
          <div key={index} className={styles.featureCard}>
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <p className={styles.featureDescription}>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
