import React from 'react';
import googlePlayBadge from '../../assets/img/play.png'; 
import appStoreBadge from '../../assets/img/ios.png'; 
import styles from '../../assets/css/index/OurApp.module.css'; 
const DownloadSection = () => {
  return (
    <section className={styles.downloadSection}>
      <h2 className={styles.title}>Download Our App</h2>
      <p className={styles.subtitle}>
        Download One Sec APP From Google Play Store And Apple APP Store To Manage Your Business And Personal Info By Your Self
      </p>
      <div className={styles.badges}>
        <img src={googlePlayBadge} alt="Get it on Google Play" className={styles.badge} />
        <img src={appStoreBadge} alt="Available on the App Store" className={styles.badge} />
      </div>
    </section>
  );
};

export default DownloadSection;
