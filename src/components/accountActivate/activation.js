import React, { useState } from 'react';
import styles from '../../assets/css/authentication/Authentication.module.css';
import {useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Activation = () => {
  const { uid, token } = useParams();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleActivation = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/users/activation/', {
        uid,
        token,
      });
      if (response.status === 204) {
        setMessage('You have successfully activated your account.');
        navigate('/personal-login');
      }
    } catch (error) {
      setMessage('Error activating account. Please try again.');
      console.error('Activation error:', error);
    }
  };

  return (
    <div className={styles.login}>
      <form action="" className={styles.login__form} onSubmit={e => e.preventDefault()}>
        <h2 className={styles.login__title}>Account Activation</h2>
        <div className={styles.login__group}>
          <button type="button" onClick={handleActivation} className={styles.login__button}>
            Confirm Activation
          </button>
        </div>
        {message && <p style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
        <div>
          {/* <Link to={'/'} className={styles.login__button}>Go to site</Link> */}
        </div>
      </form>
    </div>
  );
};

export default Activation;
