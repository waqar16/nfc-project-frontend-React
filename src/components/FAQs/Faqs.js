import React, { useState, useEffect } from 'react';
import styles from '../../assets/css/FAQs/Faqs.module.css';
import AoS from 'aos';
import 'aos/dist/aos.css';

const Faq = () => {
  const [open, setOpen] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    AoS.init({
      duration: 1200,
    });
  }, []);

  const toggleFAQ = (index) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [index]: !prevOpen[index],
    }));
  };

  const faqData = [
    {
      question: 'What is Onesec?',
      answer: 'Onesec is an online platform offering NFC (Near Field Communication) solutions and products. Our services include NFC cards designed for instant contact sharing, environmentally friendly usage, and enhanced interaction.',
    },
    {
      question: 'How do I use my digital NFC card?',
      answer: 'Ensure that NFC is enabled on your device. Tap the digital Onesec card against the Onesec app to transmit the stored information.',
    },
    {
      question: 'Can I customize my Onesec digital card?',
      answer: 'Yes, you can customize your Onesec digital card with various information or content, such as personal contact details, links to websites or social media profiles, and schedule meetings.',
    },
    {
      question: 'What should I do if I encounter issues with my Onesec digital card?',
      answer: 'If you experience issues with your Onesec digital card, ensure NFC is enabled on your device and functioning correctly. Confirm that you are using the card with the Onesec app. Contact our customer support team for assistance if the issue persists.',
    },
    {
      question: 'How can I update or modify the information on my Onesec digital card?',
      answer: 'To update or modify the information on your digital NFC card, log in to your account on Letsconnect.onesec.shop or the Onesec app. Navigate to your profile and save the updated information. The changes will be reflected the next time the card is tapped.',
    },
    {
      question: 'How do I track my purchase or access my Onesec digital card?',
      answer: 'After purchasing, you will receive an email with a link to sign up for your Onesec digital card. You can also sign up for your account on Letsconnect.onesec.shop or download our Onesec app from the Play Store and App Store to view and manage your digital NFC cards.',
    },
  ];
  

  return (
    <div data-aos="fade-left" className={styles.faq}>
      <h2 className={styles.faq__title}>FAQs</h2>
      {faqData.map((faq, index) => (
        <div key={index} className={styles.faq__item}>
          <div
            className={styles.faq__question}
            onClick={() => toggleFAQ(index)}
          >
            {faq.question}
            <span className={styles.faq__icon}>{open[index] ? '-' : '+'}</span>
          </div>
          <div
            className={`${styles.faq__answer} ${open[index] ? styles.open : ''}`}
          >
            {faq.answer}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Faq;
