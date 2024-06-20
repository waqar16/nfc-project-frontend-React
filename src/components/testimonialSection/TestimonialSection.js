import React from 'react';
import styles from '../../assets/css/index/TestimonialsSection.module.css';

const testimonials = [
  { name: 'John Doe', feedback: 'This platform has transformed the way I manage my schedule and profiles!' },
  { name: 'Jane Smith', feedback: 'The NFC card writing feature is incredibly useful and easy to use.' },
  { name: 'Mike Johnson', feedback: 'Highly recommend this platform for anyone looking to streamline their business operations.' },
];

const TestimonialsSection = () => {
  return (
    <section className={styles.testimonialsSection}>
      <h2 className={styles.title}>Testimonials</h2>
      <div className={styles.testimonialsGrid}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className={styles.testimonialCard}>
            <p className={styles.feedback}>{testimonial.feedback}</p>
            <p className={styles.name}>- {testimonial.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
