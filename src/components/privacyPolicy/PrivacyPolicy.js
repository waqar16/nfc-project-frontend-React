import React from 'react';
import styles from '../../assets/css/privacyPolicy/PrivacyPolicy.module.css';

const PrivacyPolicy = () => {
  return (
    <div className={styles.privacyPolicy}>
      <h1 className={styles.title}>Privacy Policy</h1>
      <p>This privacy policy applies to the Onesec app (hereby referred to as "Application") for mobile devices that was created by Creative Jump Consulting (hereby referred to as "Service Provider") as a Free service. This service is intended for use "AS IS".</p>
      
      <h2 className={styles.sectionTitle}>Information Collection and Use</h2>
      <p>The Application collects information when you download and use it. This information may include information such as:</p>
      <ul>
        <li>Your device's Internet Protocol address (e.g. IP address)</li>
        <li>The pages of the Application that you visit, the time and date of your visit, the time spent on those pages</li>
        <li>The time spent on the Application</li>
        <li>The operating system you use on your mobile device</li>
      </ul>
      <p>The Application does not gather precise information about the location of your mobile device.</p>
      <p>The Service Provider may use the information you provided to contact you from time to time to provide you with important information, required notices and marketing promotions.</p>
      <p>For a better experience, while using the Application, the Service Provider may require you to provide us with certain personally identifiable information, including but not limited to Email, Mobile Number. The information that the Service Provider requests will be retained by them and used as described in this privacy policy.</p>
      
      <h2 className={styles.sectionTitle}>Third Party Access</h2>
      <p>Only aggregated, anonymized data is periodically transmitted to external services to aid the Service Provider in improving the Application and their service. The Service Provider may share your information with third parties in the ways that are described in this privacy statement.</p>
      <p>Please note that the Application utilizes third-party services that have their own Privacy Policy about handling data. Below are the links to the Privacy Policy of the third-party service providers used by the Application:</p>
      <ul>
        <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Play Services</a></li>
      </ul>
      <p>The Service Provider may disclose User Provided and Automatically Collected Information:</p>
      <ul>
        <li>As required by law, such as to comply with a subpoena, or similar legal process;</li>
        <li>When they believe in good faith that disclosure is necessary to protect their rights, protect your safety or the safety of others, investigate fraud, or respond to a government request;</li>
        <li>With their trusted services providers who work on their behalf, do not have an independent use of the information we disclose to them, and have agreed to adhere to the rules set forth in this privacy statement.</li>
      </ul>
      
      <h2 className={styles.sectionTitle}>Opt-Out Rights</h2>
      <p>You can stop all collection of information by the Application easily by uninstalling it. You may use the standard uninstall processes as may be available as part of your mobile device or via the mobile application marketplace or network.</p>
      
      <h2 className={styles.sectionTitle}>Data Retention Policy</h2>
      <p>The Service Provider will retain User Provided data for as long as you use the Application and for a reasonable time thereafter. If you'd like them to delete User Provided Data that you have provided via the Application, please contact them at <a href="mailto:hello@onesec.shop">hello@onesec.shop</a> and they will respond in a reasonable time.</p>
      
      <h2 className={styles.sectionTitle}>Children</h2>
      <p>The Service Provider does not use the Application to knowingly solicit data from or market to children under the age of 13.</p>
      <p>The Application does not address anyone under the age of 13. The Service Provider does not knowingly collect personally identifiable information from children under 13 years of age. In the case the Service Provider discovers that a child under 13 has provided personal information, the Service Provider will immediately delete this from their servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact the Service Provider at <a href="mailto:hello@onesec.shop">hello@onesec.shop</a> so that they will be able to take the necessary actions.</p>
      
      <h2 className={styles.sectionTitle}>Security</h2>
      <p>The Service Provider is concerned about safeguarding the confidentiality of your information. The Service Provider provides physical, electronic, and procedural safeguards to protect information the Service Provider processes and maintains.</p>
      
      <h2 className={styles.sectionTitle}>Changes</h2>
      <p>This Privacy Policy may be updated from time to time for any reason. The Service Provider will notify you of any changes to the Privacy Policy by updating this page with the new Privacy Policy. You are advised to consult this Privacy Policy regularly for any changes, as continued use is deemed approval of all changes.</p>
      <p>This privacy policy is effective as of 2026-12-05</p>
      
      <h2 className={styles.sectionTitle}>Your Consent</h2>
      <p>By using the Application, you are consenting to the processing of your information as set forth in this Privacy Policy now and as amended by us.</p>
      
      <h2 className={styles.sectionTitle}>Contact Us</h2>
      <p>If you have any questions regarding privacy while using the Application, or have questions about the practices, please contact the Service Provider via email at <a href="mailto:hello@onesec.shop">hello@onesec.shop</a>.</p>
    </div>
  );
};

export default PrivacyPolicy;