import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../assets/css/authentication/Authentication.module.css';
import Loader from '../loader/Loader'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ActivationSentTemplate = () => {
  const [timer, setTimer] = useState(60); // Initial timer set to 60 seconds
  const [canResend, setCanResend] = useState(true);
  const [loading, setLoading] = useState(false); // Loading state for the loader

  useEffect(() => {
    window.scrollTo(0, 0);
    let countdown;
    if (!canResend) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(countdown);
            setCanResend(true);
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
      setLoading(true); // Start loading
      setCanResend(false); // Disable button to prevent multiple clicks

      const email = localStorage.getItem('email'); // Assuming the email is stored in localStorage
      await axios.post('http://localhost:8000/auth/users/resend_activation/', { email });

      toast.success('Activation email resent successfully!');

      setTimer((prevTimer) => prevTimer * 2); // Double the timer duration
    } catch (error) {
      console.error('Error resending activation email:', error);
      toast.error('Failed to resend activation email.');
      setCanResend(true); // Re-enable the button on error
    } finally {
      setLoading(false); // Stop loading after the request completes
    }
  };

  return (
    <div className={styles.login}>
      {loading && <Loader />} 
      <form action="" className={styles.login__form}>
        <h2 className={styles.login__title}>Account Activation Link Sent</h2>

        <div className={styles.login__group}>
          <p style={{ color: 'green' }}>
            Activation email sent to your email address successfully. Kindly check your email inbox. Check the spam folder if not received in inbox.
          </p>
          {canResend ? (
            <button
              type="button"
              onClick={handleResendActivation}
              className={styles.login__button}
              disabled={loading} // Disable button when loading
            >
              Resend Activation Email
            </button>
          ) : (
            <p>Resend available in {timer} seconds</p>
          )}
        </div>
      </form>
      <ToastContainer /> {/* Container for toast notifications */}
    </div>
  );
};

export default ActivationSentTemplate;
