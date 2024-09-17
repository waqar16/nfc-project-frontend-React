import React, { useState, useEffect } from 'react';
import styles from '../../assets/css/authentication/Authentication.module.css';
import { Link,useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/img/logo.png';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../loader/Loader';

const EmployeeSignup = () => {
  const { uid, e_mail, first_name, last_name } = useParams();
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
    setFirstName(first_name);
    setLastName(last_name);
    setEmail(e_mail);
  }, [e_mail, first_name, last_name]);

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
      const response = await axios.post('http://localhost:8000/auth/users/', {
        first_name: firstName,
        last_name: lastName,
        email,
        username,
        password,
        profile_type: 'employee', 
        authentication_type:'manual'
      });

      if (response.status === 201) {
        console.log('User registered successfully:', response.data);
        toast.success('User registered successfully. Please check your email to activate your account.');
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
        toast.error('Error registering user. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.login} ${styles.marginCustom}`}>
      <ToastContainer />
      <form className={styles.login__form} onSubmit={handleSubmit}>
      <img src={logo} alt="Logo" className={styles.auth__logo} />
        <h2 className={styles.login__title}>Employee Signup</h2>
        <p className={styles.login__subtitle}>Please enter your credentials and complete your account.</p>    
            <div className={styles.login__group}>
          <div>

            <label htmlFor="first_name" className={styles.login__label}>First Name</label>
            <input required type="text" placeholder="First name" id="firstName" className={styles.login__input} value={firstName} onChange={handleFirstNameChange} readOnly />
          </div>
          <div>
            <label htmlFor="last_name" className={styles.login__label}>Last Name</label>
            <input required type="text" placeholder="Last Name" id="lastName" className={styles.login__input} value={lastName} onChange={handleLasttNameChange} readOnly />
          </div>
          <div>
            <label htmlFor="email" className={styles.login__label}>Email</label>
            <input required type="email" placeholder="Write your email" id="email" className={styles.login__input} value={email} onChange={handleEmailChange} readOnly />
            {emailError && (
            <p className={styles.error}>
              <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
              {emailError}
            </p>
          )}    
           </div>
          <div>
            <label htmlFor="username" className={styles.login__label}>Username</label>
            <input required type="text" placeholder="Write your username" id="username" className={styles.login__input} value={username} onChange={handleUsernameChange} />
            {usernameError && (
            <p className={styles.error}>
              <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
              {usernameError}
            </p>
          )}    
                    </div>
          <div>
            <label htmlFor="password" className={styles.login__label}>Password</label>
            <input required type="password" placeholder="Enter your password" id="password" className={styles.login__input} value={password} onChange={handlePasswordChange} />
          </div>
          <div>
            <label htmlFor="confirmpassword" className={styles.login__label}>Confirm Password</label>
            <input required type="password" placeholder="Confirm password" id="confirmpassword" className={styles.login__input} value={confirmPassword} onChange={handleConfirmPasswordChange} />
            {passwordError && (
            <p className={styles.error}>
              <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
              {passwordError}
            </p>
          )} 
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
            {loading ? 'Signing Up...' : 'Sign Up as Employee'}
          </button>
          <p className={styles.login__signup}>
            Already have an account? <Link to={"/login"}>Log in here</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default EmployeeSignup;
