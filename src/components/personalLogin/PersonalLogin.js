import React, { useState, useEffect } from 'react';
import styles from '../../assets/css/authentication/Authentication.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/img/logo.png';
import google from '../../assets/img/socials/google.png';

const PersonalLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // window.location.reload();
    setLoading(true);

    try {
      const response = await axios.post('  https://api.onesec.shop/auth/token/login/', {
        email,
        password,
      });

      // const response2 = await axios.get('  https://api.onesec.shop/api/profile_type/', {
      // });

      // console.log(response2.data.profile_type);
      
      if (response.status === 200) {
        const authToken = response.data;
        localStorage.setItem('authToken', authToken.auth_token);
        console.log('User logged in successfully:', response.data);
        console.log('Token:', authToken.auth_token);

        // Dispatch custom event to update Navbar state
        const event = new Event('authStatusChanged');
        window.dispatchEvent(event);

        const token = localStorage.getItem('authToken');
        const userResponse = await axios.get('  https://api.onesec.shop/auth/users/me/', {
          headers: {
            Authorization: `Token ${token}`
          }
        });

        const { id, username, profile_type } = userResponse.data;

        if (profile_type === 'company'){
          navigate(`/company-analytics/${id}/${username}`);
        }
        else if (profile_type === 'individual'){
          navigate(`/user-analytics/${id}/${username}`);
        }
        
        // Hard refresh the page
        window.location.reload();

      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        const data = error.response.data;
        if (data.non_field_errors) {
          setError(data.non_field_errors[0]);
        }
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
        <img src={logo} alt="Logo" className={styles.auth__logo} />
        <h2 className={styles.login__title}>Hi, Welcome Back!</h2>
        <p className={styles.login__subtitle}>Please enter your credentials to log in and access your account.</p>
        <div className={styles.login__group}>
          <div>
            <div className={styles.login__google}><img className={styles.google__icon} src={google}></img>Log in with Google </div>
            <p className={styles.login__or}>or</p>
            <label htmlFor="email" className={styles.login__label}>Email</label>
            <input required type="email" placeholder="Write your email" id="email" className={styles.login__input} value={email} onChange={handleEmailChange} />
          </div>
          <div>
            <label htmlFor="password" className={styles.login__label}>Password</label>
            <input required type="password" placeholder="Enter your password" id="password" className={styles.login__input} value={password} onChange={handlePasswordChange} />
          </div>
        </div>

        {error && <p style={{ textAlign:'left', color: 'red' }}>{error}</p>}

        <div>

          <Link className={styles.login__forgot} to={"/reset-password"}>Forgot Password?</Link>

          <button type="submit" className={styles.login__button} disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
          <p className={styles.login__signup}>
            You do not have an account? <Link to={"/personal-signup"}>Sign up as individual</Link> or <Link to={"/company-signup"}>Sign up as a company</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default PersonalLogin;
