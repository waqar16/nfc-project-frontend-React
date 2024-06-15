import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../assets/css/Home.module.css';
import main from'../../assets/img/banner.png'
// import airbnbLogo from './images/airbnb-logo.png';
// import slackLogo from './images/slack-logo.png';
// import envatoLogo from './images/envato-logo.png';
// import drivewayLogo from './images/driveway-logo.png';
// import githubLogo from './images/github-logo.png';
// import nodeLogo from './images/node-logo.png';

const Home = () => {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Revolutionize Your Business Cards</h1>
          <p>Our innovative NFC Business Card platform helps you manage profiles, write information to NFC cards, and schedule appointments seamlessly. Say goodbye to traditional business cards and embrace the future.</p>
          <div className={styles.btnDiv}>
          <Link to="/company-signup">
          <button className={styles.ctaButton1}>For Company <i class="ri-arrow-right-line"></i></button>
          </Link>
          <Link to="/personal-signup">
          <button className={styles.ctaButton2}>For Individual <i class="ri-arrow-right-line"></i></button>
          </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img src={main} alt="NFC Card app mock" />
        </div>
      </section>
      {/* <section className={styles.brands}>
        <img src={airbnbLogo} alt="Airbnb" />
        <img src={slackLogo} alt="Slack" />
        <img src={envatoLogo} alt="Envato" />
        <img src={drivewayLogo} alt="Driveway" />
        <img src={githubLogo} alt="GitHub" />
        <img src={nodeLogo} alt="Node.js" />
      </section> */}
    </div>
  );
};

export default Home;
