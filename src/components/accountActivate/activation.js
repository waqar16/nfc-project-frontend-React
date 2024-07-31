import React, { useState } from 'react';
import styles from '../../assets/css/authentication/Authentication.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Activation = () => {
  const { uid, token } = useParams();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  

  const handleActivation = async () => {
    try {
      // Activate user account
      const response = await axios.post('http://localhost:8000/auth/users/activation/', {
        uid,
        token,
      });

      if (response.status === 204) {
        setMessage('You have successfully activated your account.');
        navigate('/login')

        // // Retrieve email and password from local storage
        // const email = localStorage.getItem('email');
        // const password = localStorage.getItem('password');

        // // Login user
        // const loginResponse = await axios.post('http://localhost:8000/auth/token/login/', {
        //   email,
        //   password,
        // });

        // localStorage.setItem('authToken', loginResponse.data.auth_token);
      }
    } catch (error) {
      setMessage('Error activating account. Please try again.');
      console.error('Activation error:', error);
    }

    // finally{
    //           // Fetch user data
    //           const authToken = localStorage.getItem('authToken');
    //           const userResponse = await axios.get('http://localhost:8000/auth/users/me/', {
    //             headers: {
    //               Authorization: `Token ${authToken}`,
    //             },
    //           });

    //           console.log(userResponse.data);
      
    //           // Create profile type
    //           const profile = {
    //             user: userResponse.data.id,
    //             profile_type: localStorage.getItem('profile_type'),
    //           }
    //           await axios.post('http://localhost:8000/api/profile_type/', profile, {
    //             headers: {
    //               Authorization: `Token ${authToken}`,
    //             },
    //           });
      
    //           // Redirect based on profile type
    //           if (localStorage.getItem('profile_type') === 'company') {
    //             navigate('/company-profile');
    //           } else {
    //             navigate('/profile-summary');
    //           }
    // }
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
