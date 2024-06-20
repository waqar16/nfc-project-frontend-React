import React from 'react';
import styles from '../../assets/css/HowItWorksSection.module.css';

const steps = [
  { icon: 'ri-user-add-line', title: 'Sign Up', description: 'Create your account to get started.' },
  { icon: 'ri-profile-line', title: 'Set Up Profile', description: 'Fill in your personal and professional details.' },
  { icon: 'ri-wifi-line', title: 'Write NFC Cards', description: 'Easily write information to your NFC cards.' },
  { icon: 'ri-calendar-line', title: 'Schedule Meetings', description: 'Use our calendar to schedule appointments.' },
];

const HowItWorksSection = () => {
  return (
    <section className={styles.howItWorksSection}>
      <h2 className={styles.title}>How It Works</h2>
      <div className={styles.stepsGrid}>
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
