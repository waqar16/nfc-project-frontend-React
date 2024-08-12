import React, { useState, useEffect } from 'react';
import styles from '../../assets/css/authentication/Authentication.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/img/logo.png';
import google from '../../assets/img/socials/google.png';

const PersonalSignup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFirstNameChange = (e) => setFirstName(e.target.value);
  const handleLasttNameChange = (e) => setLastName(e.target.value);
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUsernameError('');
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError('');
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (confirmPassword && e.target.value !== confirmPassword) {
      setPasswordError('Passwords do not match.');
    } else {
      setPasswordError('');
    }
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (password && password !== e.target.value) {
      setPasswordError('Passwords do not match.');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      setLoading(false);
      return;
    }
    setPasswordError('');

    try {
      const response = await axios.post('  http://54.84.254.221/auth/users/', {
        first_name: firstName,
        last_name: lastName,
        email,
        username,
        password,
        profile_type: 'individual', 
      });

      if (response.status === 201) {
        console.log('User registered successfully:', response.data);
        const userInfo = response.data;
        localStorage.setItem('first_name', userInfo.first_name);
        localStorage.setItem('last_name', userInfo.last_name);
        localStorage.setItem('email', userInfo.email);
        localStorage.setItem('username', userInfo.username);
        localStorage.setItem('profile_type', userInfo.profile_type);
        navigate('/activation-sent');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const data = error.response.data;
        if (data.email) {
          setEmailError(data.email[0]);
        }
        if (data.username) {
          setUsernameError(data.username[0]);
        }
        if (data.password) {
          setPasswordError(data.password[0]);
        }
      } else {
        console.error('Error registering user:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.login} ${styles.marginCustom}`}>
      <form className={styles.login__form} onSubmit={handleSubmit}>
      <img src={logo} alt="Logo" className={styles.auth__logo} />
        <h2 className={styles.login__title}>Hi, Welcome Back!</h2>
        <p className={styles.login__subtitle}>Please enter your credentials to sign up and create your account.</p>    
        <div className={styles.login__google}><img className={styles.google__icon} src={google}></img>Log in with Google </div>
          <p className={styles.login__or}>or</p>
          
            <div className={styles.login__group}>
          <div>

            <label htmlFor="first_name" className={styles.login__label}>First Name</label>
            <input required type="text" placeholder="First name" id="firstName" className={styles.login__input} value={firstName} onChange={handleFirstNameChange} />
          </div>
          <div>
            <label htmlFor="last_name" className={styles.login__label}>Last Name</label>
            <input required type="text" placeholder="Last Name" id="lastName" className={styles.login__input} value={lastName} onChange={handleLasttNameChange} />
          </div>
          <div>
            <label htmlFor="email" className={styles.login__label}>Email</label>
            <input required type="email" placeholder="Write your email" id="email" className={styles.login__input} value={email} onChange={handleEmailChange} />
            {emailError && <p style={{textAlign:'left', color: 'red' }}>{emailError}</p>}
          </div>
          <div>
            <label htmlFor="username" className={styles.login__label}>Username</label>
            <input required type="text" placeholder="Write your username" id="username" className={styles.login__input} value={username} onChange={handleUsernameChange} />
            {usernameError && <p style={{textAlign:'left', color: 'red' }}>{usernameError}</p>}
          </div>
          <div>
            <label htmlFor="password" className={styles.login__label}>Password</label>
            <input required type="password" placeholder="Enter your password" id="password" className={styles.login__input} value={password} onChange={handlePasswordChange} />
          </div>
          <div>
            <label htmlFor="confirmpassword" className={styles.login__label}>Confirm Password</label>
            <input required type="password" placeholder="Confirm password" id="confirmpassword" className={styles.login__input} value={confirmPassword} onChange={handleConfirmPasswordChange} />
            {passwordError && <p style={{textAlign:'left', color: 'red' }}>{passwordError}</p>}
          </div>
        </div>
        <div>
          <div className={styles.login__agreement}>
        <input required type="checkbox" id="agreement" className={styles.login__checkbox} />
        <label htmlFor="agreement">
          I agree with
          <a href="/terms-of-service">Terms of Service</a>,
          <a href="/privacy-policy">Privacy Policy</a>
        </label>
      </div>
          <button type="submit" className={styles.login__button} disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up as Individual'}
          </button>
          <p className={styles.login__signup}>
            Already have an account? <Link to={"/personal-login"}>Log in here</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default PersonalSignup;
