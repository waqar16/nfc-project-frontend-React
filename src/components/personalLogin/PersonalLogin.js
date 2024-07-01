import React, { useState } from 'react';
import styles from '../../assets/css/authentication/Authentication.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PersonalLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/token/login/', {
        email,
        password,
      });
      
      if (response.status === 200) {
        const token = response.data;
        localStorage.setItem('authToken', token.auth_token);
        console.log('User logged in successfully:', response.data);
        console.log('Token:', token.auth_token);

        // Dispatch custom event to update Navbar state
        const event = new Event('authStatusChanged');
        window.dispatchEvent(event);
        navigate('/')
        // Hard refresh the page
        // window.location.reload();

      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        const data = error.response.data;
        if (data.error) {
          setError(data.error[0]);
        }
      } else {
        console.error('Error logging in user:', error.message);
      }
    }
  };

  return (
    <div className={`${styles.login} ${styles.marginCustom}`}>
      <form action="" className={styles.login__form} onSubmit={handleSubmit}>
        <h2 className={styles.login__title}>Log In As Individual</h2>

        <div className={styles.login__group}>
          <div>
            <label htmlFor="email" className={styles.login__label}>Email</label>
            <input required type="email" placeholder="Write your email" id="email" className={styles.login__input} value={email} onChange={handleEmailChange} />
          </div>
          <div>
            <label htmlFor="password" className={styles.login__label}>Password</label>
            <input required type="password" placeholder="Enter your password" id="password" className={styles.login__input} value={password} onChange={handlePasswordChange} />
          </div>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div>
          <p className={styles.login__signup}>
            You do not have an account? <Link to={"/personal-signup"}>Signup</Link>
          </p>

          <Link className={styles.login__forgot} to={"/reset-password"}>You forgot your password</Link>

          <button type="submit" className={styles.login__button} disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalLogin;
