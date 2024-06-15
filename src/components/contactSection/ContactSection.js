import React from 'react';
import styles from '../../assets/css/ContactSection.module.css';

const ContactSection = () => {
  return (
    <section className={styles.contactSection}>
      <h2 className={styles.title}>Contact Us</h2>
      <div className={styles.contactContent}>
        <div className={styles.contactForm}>
          <label className={styles.label} htmlFor="name">Name</label>
          <input className={styles.input} type="text" id="name" placeholder="Your Name" />
          <label className={styles.label} htmlFor="email">Email</label>
          <input className={styles.input} type="email" id="email" placeholder="Your Email" />
          <label className={styles.label} htmlFor="message">Message</label>
          <textarea className={styles.textarea} id="message" placeholder="Your Message"></textarea>
          <button className={styles.submitButton}>Submit</button>
        </div>
        {/* <div className={styles.contactInfo}>
          <p>Email: info@example.com</p>
          <p>Phone: (123) 456-7890</p>
          <p>Address: 123 Main St, Anytown, USA</p>
        </div> */}
      </div>
    </section>
  );
};

export default ContactSection;
