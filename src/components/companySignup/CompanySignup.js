import React, { useState } from 'react';
import styles from '../../assets/css/authentication/Authentication.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CompanySignup = () => {
  const [companyName, setCompanyName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleFirstNameChange = (e) => setCompanyName(e.target.value);
  const handleLasttNameChange = (e) => setAdminName(e.target.value);
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
      const response = await axios.post('http://127.0.0.1:8000/auth/users/', {
        company_name: companyName,
        admin_name: adminName,
        email,
        username,
        password,
        profile_type: 'company', 
      });


      if (response.status === 201) {
        // localStorage.setItem('id', response.id);
        console.log('Company registered successfully:', response.data);
        const CompanyInfo = response.data;
        // localStorage.setItem('company_name', CompanyInfo.first_name);
        // localStorage.setItem('admin_name', CompanyInfo.last_name);
        localStorage.setItem('email', CompanyInfo.email);
        // localStorage.setItem('username', CompanyInfo.username);
        // localStorage.setItem('password', password);
        // localStorage.setItem('profile_type', 'company');
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
        console.error('Error registering company:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.login} ${styles.marginCustom}`}>
      <form className={styles.login__form} onSubmit={handleSubmit}>
        <h2 className={styles.login__title}>Signup As Company</h2>
        <div className={styles.login__group}>
          <div>
            <label htmlFor="company_name" className={styles.login__label}>Company Name</label>
            <input required type="text" placeholder="Company name" id="companyName" className={styles.login__input} value={companyName} onChange={handleFirstNameChange} />
          </div>
          <div>
            <label htmlFor="admin_name" className={styles.login__label}>Admin Name</label>
            <input required type="text" placeholder="Admin name" id="adminName" className={styles.login__input} value={adminName} onChange={handleLasttNameChange} />
          </div>
          <div>
            <label htmlFor="email" className={styles.login__label}>Email</label>
            <input required type="email" placeholder="Write your email" id="email" className={styles.login__input} value={email} onChange={handleEmailChange} />
            {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
          </div>
          <div>
            <label htmlFor="username" className={styles.login__label}>Username</label>
            <input required type="text" placeholder="Write your username" id="username" className={styles.login__input} value={username} onChange={handleUsernameChange} />
            {usernameError && <p style={{ color: 'red' }}>{usernameError}</p>}
          </div>
          <div>
            <label htmlFor="password" className={styles.login__label}>Password</label>
            <input required type="password" placeholder="Enter your password" id="password" className={styles.login__input} value={password} onChange={handlePasswordChange} />
          </div>
          <div>
            <label htmlFor="confirmpassword" className={styles.login__label}>Confirm Password</label>
            <input required type="password" placeholder="Confirm password" id="confirmpassword" className={styles.login__input} value={confirmPassword} onChange={handleConfirmPasswordChange} />
            {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
          </div>
        </div>
        <div>
          <p className={styles.login__signup}>
            Already have an account? <Link to={"/personal-login"}>Log In</Link>
          </p>
          <button type="submit" className={styles.login__button} disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanySignup;
