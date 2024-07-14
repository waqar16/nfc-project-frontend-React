import React, { useState, useEffect } from 'react';
import styles from '../../assets/css/FAQs/Faqs.module.css';

const Faq = () => {
  const [open, setOpen] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFAQ = (index) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [index]: !prevOpen[index],
    }));
  };

  const faqData = [
    {
      question: 'What is this platform about?',
      answer: 'This platform allows customers to manage their profiles, write information to NFC cards, and schedule appointments. It supports multiple organizations under a white-label model.',
    },
    {
      question: 'How can I sign up as a company?',
      answer: 'To sign up as a company, you need to provide detailed company information, administrator information, login credentials, business details, and additional information. You can sign up using the Company Signup form.',
    },
    {
      question: 'How do I update my profile information?',
      answer: 'You can update your profile information by navigating to the profile management section. Here, you can edit your details and save the changes.',
    },
    {
      question: 'Can I manage multiple organizations with one account?',
      answer: 'Yes, our platform supports multiple organizations under a single account through a white-label model. You can manage different organizations seamlessly.',
    },
    {
      question: 'What are NFC cards and how do I use them?',
      answer: 'NFC (Near Field Communication) cards are used to store and share information wirelessly. You can write your profile information to NFC cards using our platform, which can then be used for various purposes such as contact sharing, access control, etc.',
    },
    {
      question: 'How do I schedule appointments?',
      answer: 'To schedule appointments, use the appointment scheduling feature available in your profile. You can set your preferences and manage your appointments through this interface.',
    },
  ];

  return (
    <div className={styles.faq}>
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
