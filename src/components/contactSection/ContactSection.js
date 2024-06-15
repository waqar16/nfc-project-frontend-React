import React from 'react';
import styles from '../../assets/css/ContactSection.module.css';

const ContactUsSection = () => {
    return (
      <section className={styles.contactUsSection}>
        <h2 className={styles.title}>Contact Us</h2>
        <p className={styles.description}>We would love to hear from you! Please fill out the form below and we will get in touch with you shortly.</p>
        <div className={styles.contactContainer}>

          <form className={styles.contactForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Name</label>
              <input type="text" id="name" className={styles.input} placeholder="Your Name" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input type="email" id="email" className={styles.input} placeholder="Your Email" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>Message</label>
              <textarea id="message" className={styles.textarea} placeholder="Your Message"></textarea>
            </div>
            <button type="submit" className={styles.button}>Send Message</button>
          </form>
          <div className={styles.contactInfo}>
            <h3 className={styles.contactTitle}>Get in Touch</h3>
            <p className={styles.contactDetail}><i className="ri-map-pin-line"></i> 123 Main St, Springfield, IL</p>
            <p className={styles.contactDetail}><i className="ri-phone-line"></i> (123) 456-7890</p>
            <p className={styles.contactDetail}><i className="ri-mail-line"></i> contact@example.com</p>
          </div>
        </div>
      </section>
    );
  };
  
  export default ContactUsSection;