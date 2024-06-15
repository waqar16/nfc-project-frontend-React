import React from 'react';
import styles from '../../assets/css/HowItWorksSection.module.css';

const steps = [
  { step: 1, title: 'Sign Up', description: 'Create your account to get started.' },
  { step: 2, title: 'Set Up Profile', description: 'Fill in your personal and professional details.' },
  { step: 3, title: 'Write NFC Cards', description: 'Easily write information to your NFC cards.' },
  { step: 4, title: 'Schedule Meetings', description: 'Use our calendar to schedule appointments.' },
];

const HowItWorksSection = () => {
  return (
    <section className={styles.howItWorksSection}>
      <h2 className={styles.title}>How It Works</h2>
      <div className={styles.steps}>
        {steps.map((step, index) => (
          <div key={index} className={styles.stepCard}>
            <div className={styles.stepNumber}>{step.step}</div>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDescription}>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
