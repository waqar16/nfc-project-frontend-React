import React, { useState, useEffect } from 'react';
import styles from '../../assets/css/authentication/Authentication.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true); // Initially disabled
  const [resendTimeLeft, setResendTimeLeft] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const token = localStorage.getItem('authToken');

    let timer;

    if (token) {
      if (resendTimeLeft > 0) {
        timer = setInterval(() => {
          setResendTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
      }
  
      return () => {
        if (timer) clearInterval(timer);
      };
    }

    // else {
    //   navigate('/login');
    // }

  }, [resendTimeLeft, navigate]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
    setMessage('');
  };

  const resendEmail = async () => {
    setResendDisabled(true);
    setResendTimeLeft(60); // 60 seconds for testing, change to 3600 for 60 minutes
    try {
      await axios.post('https://waqar123.pythonanywhere.com/auth/users/resend_activation/', { email });
      setMessage('Password reset link sent to your email again.');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.email) {
        setError(error.response.data.email[0]);
      } else {
        setError('An error occurred. Please try again.');
      }
      setResendDisabled(false); // Reset resend activation button on error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResendDisabled(false); // Enable resend activation button on submit
    try {
      await axios.post('https://waqar123.pythonanywhere.com/auth/users/reset_password/', { email });
      setMessage('Password reset link sent to your email.');
    } catch (error) {
      setIsSubmitting(false);
      if (error.response && error.response.data && error.response.data.email) {
        setError(error.response.data.email[0]);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className={`${styles.login} ${styles['margin-top-custom']}`}>
      <form action="" className={styles.login__form} onSubmit={handleSubmit}>
        <h2 className={styles.login__title}>Reset Password</h2>

        <div className={styles.login__group}>
          <div>
            <label htmlFor="email" className={styles.login__label}>Email</label>
            <input
              required
              type="email"
              placeholder="Write your email"
              id="email"
              className={styles.login__input}
              value={email}
              onChange={handleEmailChange}
            />
          </div>
        </div>
        
        <div className={styles.login__group}>
          <p className={styles.login__signup}>
            {!resendDisabled ? (
              <button onClick={resendEmail} style={{ color: 'blue', cursor: 'pointer' }}>Resend reset link</button>
            ) : (
              resendTimeLeft > 0 && (
                <span>
                  Resend available in {Math.floor(resendTimeLeft / 60)}:{String(resendTimeLeft % 60).padStart(2, '0')} minutes
                </span>
              )
            )}
          </p>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}

        <div>
          <button type="submit" className={`${styles.login__button} ${isSubmitting ? styles.disabled : ''}`} disabled={isSubmitting}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
