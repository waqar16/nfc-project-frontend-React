import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../assets/css/authentication/Authentication.module.css';

const ActivationSentTemplate = () => {
  const [timer, setTimer] = useState(60); // Initial timer set to 60 seconds
  const [canResend, setCanResend] = useState(true); // State to manage button visibility and prevent multiple clicks

  useEffect(() => {

    let countdown;
    if (canResend) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(countdown);
            setCanResend(true); // Enable button after countdown ends
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdown); // Clear interval on component unmount
  }, [canResend]);

  const handleResendActivation = async () => {
    try {
      setCanResend(false); // Disable button to prevent multiple clicks
      const email = localStorage.getItem('email'); // Assuming the email is stored in localStorage
      await axios.post('http://127.0.0.1:8000auth/users/resend_activation/', { email });
      // alert('Activation email resent successfully!');

      // Double the timer duration
      setTimer((prevTimer) => prevTimer * 2);

      // Start the countdown with the updated timer duration
      let countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(countdown);
            setCanResend(true); // Enable button after countdown ends
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error resending activation email:', error);
      alert('Failed to resend activation email.');
      setCanResend(true); // Re-enable the button on error
    }
  };

  return (
    <div className={styles.login}>
      <form action="" className={styles.login__form}>
        <h2 className={styles.login__title}>Account Activation Link Sent</h2>

        <div className={styles.login__group}>
          <p style={{ color: 'green' }}>
            Activation email sent to your email address successfully. Kindly check your email inbox. Check the spam folder if not received in inbox.
          </p>
          {canResend ? (
            <button type="button" onClick={handleResendActivation} className={styles.login__button}>
              Resend Activation Email
            </button>
          ) : (
            <p>Resend available in {timer} seconds</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ActivationSentTemplate;
