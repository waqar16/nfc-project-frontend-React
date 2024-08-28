import React from 'react';
import googlePlayBadge from '../../assets/img/play.png'; 
import appStoreBadge from '../../assets/img/ios.png'; 
import styles from '../../assets/css/index/OurApp.module.css'; 
import Aos from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const DownloadSection = () => {
  useEffect(() => {
    Aos.init({
      duration: 1200,
    });
  }, []);

  return (
    <section data-aos="fade-up" className={styles.downloadSection}>
      <h2 className={styles.title}>Download The Latest Version Of Our App</h2>
      <p className={styles.subtitle}>
        Experience the full potential of our NFC Eco System with our mobile app. Download the One Sec APP from the Google Play Store or Apple App Store to:
      </p>
      {/* <p className={styles.featuresDescription}>
        Manage your business and personal profiles effortlessly, write and update information on your NFC cards on-the-go, create and share digital cards directly from your mobile device, schedule and manage appointments with ease, and access real-time analytics to track interactions.
      </p> */}
      <div className={styles.badges}>
        <img src={googlePlayBadge} alt="Get it on Google Play" className={styles.badge} />
        <img src={appStoreBadge} alt="Available on the App Store" className={styles.badge} />
      </div>
    </section>
  );
};

export default DownloadSection;
