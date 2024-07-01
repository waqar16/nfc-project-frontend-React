import React, { useState } from 'react';
import axios from 'axios';
import styles from '../../assets/css/index/Feedback.module.css'

const FeedbackForm = () => {
    const [feedback, setFeedback] = useState({
      name: '',
      email: '',
      message: '',
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFeedback((prevFeedback) => ({
        ...prevFeedback,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post('http://example.com/api/feedback', feedback);
        alert('Feedback submitted successfully!');
        setFeedback({ name: '', email: '', message: '' });
      } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('Failed to submit feedback.');
      }
    };
  
    return (
      <div className={styles['feedback-form']}>
        <h2><i className="ri-feedback-line"></i> Feedback Form</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={feedback.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={feedback.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Message:
            <textarea
              name="message"
              value={feedback.message}
              onChange={handleChange}
              rows={4}
              required
            ></textarea>
          </label>
          <button type="submit">Submit Feedback</button>
        </form>
      </div>
    );
  };
  
  export default FeedbackForm;