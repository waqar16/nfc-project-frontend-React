import React from 'react';
import styles from '../../assets/css/Terms/TermsAndConditions.module.css';

const TermsAndConditions = () => {
  return (
    <div className={styles.termsAndConditions}>
      <h1 className={styles.title}>Terms and Conditions</h1>
      <p className={styles.intro}>
        Welcome to Onesec, a product of Creative Jump Consulting. Please read these Terms and Conditions ("Terms") carefully before using our app. By accessing or using Onesec, you agree to be bound by these Terms. If you do not agree with any part of these Terms, please do not use our app.
      </p>
      
      <h2 className={styles.sectionTitle}>1. Definitions</h2>
      <p>
        <strong>"Onesec"</strong> refers to our app and any associated services provided by Creative Jump Consulting.<br />
        <strong>"Creative Jump Consulting"</strong> refers to the business entity owning and operating Onesec, with the address Office 104 - 105, 1st Floor, Emaar Square, Building 4, Sheikh Mohammed Bin Rashid Boulevard, Downtown Dubai, Dubai, UAE.<br />
        <strong>"User"</strong> refers to any individual who accesses or uses Onesec.
      </p>
      
      <h2 className={styles.sectionTitle}>2. Account Creation</h2>
      <p>
        Users may create an account to access certain features of Onesec. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
      </p>
      
      <h2 className={styles.sectionTitle}>3. Content Creation and Upload</h2>
      <p>
        Users can create and upload content, including text and images, to Onesec. You retain ownership of the content you create and upload. However, by submitting content, you grant Creative Jump Consulting a perpetual, worldwide, royalty-free, and non-exclusive license to use, reproduce, modify, and display such content for the purposes of operating and promoting Onesec.
      </p>
      
      <h2 className={styles.sectionTitle}>4. Intellectual Property</h2>
      <p>
        All content, logos, visual designs, trademarks, and other intellectual property associated with Onesec are the exclusive property of Creative Jump Consulting. Users may not use, reproduce, or distribute any of our intellectual property without prior written permission.
      </p>
      
      <h2 className={styles.sectionTitle}>5. Feedback and Suggestions</h2>
      <p>
        If you provide feedback or suggestions regarding Onesec, you agree that Creative Jump Consulting may use such feedback or suggestions without any compensation or credit to you.
      </p>
      
      <h2 className={styles.sectionTitle}>6. Promotions, Contests, and Sweepstakes</h2>
      <p>
        From time to time, we may offer promotions, contests, or sweepstakes. These will be governed by additional terms and conditions which will be made available to participants at the time of the promotion.
      </p>
      
      <h2 className={styles.sectionTitle}>7. Prohibited Conduct</h2>
      <p>
        Users agree not to use Onesec for any unlawful purposes or in a way that could damage, disable, or impair the app. Prohibited conduct includes but is not limited to the following:
      </p>
      <ul>
        <li>Posting or transmitting any content that is illegal, defamatory, obscene, or offensive.</li>
        <li>Impersonating another person or entity.</li>
        <li>Interfering with the security or integrity of Onesec.</li>
      </ul>
      
      <h2 className={styles.sectionTitle}>8. Termination</h2>
      <p>
        We reserve the right to terminate or suspend your account and access to Onesec at our sole discretion, without prior notice, if you violate these Terms or engage in any conduct that we believe to be harmful to Onesec or its users.
      </p>
      
      <h2 className={styles.sectionTitle}>9. Limitation of Liability</h2>
      <p>
        Creative Jump Consulting shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of Onesec.
      </p>
      
      <h2 className={styles.sectionTitle}>10. Changes to Terms</h2>
      <p>
        We may update these Terms from time to time. Any changes will be effective immediately upon posting on Onesec. Your continued use of the app following any changes constitutes your acceptance of the revised Terms.
      </p>
      
      <h2 className={styles.sectionTitle}>11. Contact Us</h2>
      <p>
        For any questions regarding these Terms and Conditions, please contact us by email at <a href="mailto:insertemail@example.com">insertemail@example.com</a>.
      </p>
      
      <p>
        By using Onesec, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. Thank you for using Onesec!
      </p>
    </div>
  );
};

export default TermsAndConditions;
