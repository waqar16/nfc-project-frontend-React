import React, { useState } from 'react';
import styles from '../../assets/css/authentication/Authentication.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../loader/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Activation = () => {
  const { uid, token } = useParams();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const handleActivation = async () => {
    try {
      setLoading(true);
      const response = await axios.post('https://api.onesec.shop/auth/users/activation/', {
        uid,
        token,
      });

      if (response.status === 204) {
        setMessage('You have successfully activated your account.');
        toast.success('Account activated successfully. Please login.');
        navigate('/login')
      }
    } catch (error) {
      setLoading(false);
      setMessage('Error activating account. Please try again.');
      toast.error('Error activating account. Please try again.');
      console.error('Activation error:', error);
    }

    finally {
      setLoading(false);
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

        </div>
      </form>
      {loading && <Loader />}
      <ToastContainer />
    </div>
  );
};

export default Activation;
