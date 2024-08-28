import styles from '../../assets/css/index/FeatureSection.module.css';
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import the AOS CSS

const features = [
  {
    icon: 'ri-user-line',
    title: 'Profile Management',
    description: 'Manage both personal and professional profiles seamlessly.',
  },
  {
    icon: 'ri-wifi-line',  // Represents NFC integration
    title: 'NFC Card Integration',
    description: 'Easily write and update information on NFC cards for instant sharing.',
  },
  {
    icon: 'ri-file-list-line',
    title: 'Digital Card Profile Creation',
    description: 'Create and manage profiles to be added to digital cards for easy sharing.',
  },
  {
    icon: 'ri-calendar-check-line',
    title: 'Appointment Scheduling',
    description: 'Streamline your meetings with integrated scheduling and reminders.',
  },
  {
    icon: 'ri-bar-chart-line',
    title: 'Analytics & Insights',
    description: 'Track interactions and engagements with your NFC and digital cards.',
  },
  {
    icon: 'ri-share-forward-line',
    title: 'Seamless Sharing',
    description: 'Share your NFC or digital card profiles with a simple tap or click.',
  },
  {
    icon: 'ri-team-line',
    title: 'Team Management',
    description: 'Efficiently manage employees and their NFC cards, giving you control over team profiles and interactions.',
  },
  {
    icon: 'ri-shield-user-line',
    title: 'Data Security Ensurance',
    description: 'Ensure your data is secure with robust authentication and encryption.',
  },
];

const FeaturesSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200, 
    });
  }, []);

  return (
    <section className={styles.featuresSection}>
      <h2 data-aos="fade-up" className={styles.title}>Core Features</h2>
      <div data-aos="fade-up" className={styles.featuresGrid}>
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
