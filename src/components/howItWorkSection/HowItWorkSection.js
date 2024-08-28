import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import the AOS CSS
import styles from '../../assets/css/index/HowItWorksSection.module.css';

const steps = [
  { icon: 'ri-user-add-line', title: 'Sign Up', description: 'Create your account to get started.' },
  { icon: 'ri-profile-line', title: 'Set Up Profile', description: 'Fill in your personal and professional details to create your profile.' },
  { icon: 'ri-wifi-line', title: 'Integrate NFC Cards', description: 'Write and update information on your NFC cards for quick sharing.' },
  { icon: 'ri-file-list-line', title: 'Create Digital Card Profile', description: 'Add your profile details to digital cards and share them easily.' },
  { icon: 'ri-calendar-line', title: 'Schedule Appointments', description: 'Use our calendar feature to schedule and manage meetings.' },
  { icon: 'ri-bar-chart-line', title: 'View Analytics', description: 'Track interactions and engagement with your NFC and digital cards.' },
];

const HowItWorksSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
    });
  }, []);

  return (
    <section className={styles.howItWorksSection}>
      <h2 data-aos="fade-up" className={styles.title}>How It Works</h2>
      <div data-aos="fade-up" className={styles.stepsGrid}>
        {steps.map((step, index) => (
          <div key={index} className={styles.stepCard}>
            <i className={`${step.icon} ${styles.icon}`}></i>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDescription}>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
