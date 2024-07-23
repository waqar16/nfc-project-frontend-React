// SignupPage.js
import React, { useState } from 'react';
import styles from '../../assets/css/authentication/Authentication.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/img/logo.png';
// import google from '../../assets/img/socials/google.png';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const SignupPage = () => {
  const [isPersonalSignup, setIsPersonalSignup] = useState(true); // State to toggle between personal and company signup
  const toggleSignupMode = () => setIsPersonalSignup(!isPersonalSignup); // Function to toggle signup mode
  const navigate = useNavigate();

  const clientId = '1036461909018-v32f9s35hefkbeq70gterh12sioug5a5.apps.googleusercontent.com';

  const handleGoogleSuccess = async (response) => {
    const tokenId = response.credential; // Token ID from Google

    try {
      console.log('Google login response:', response);
      const profileType = isPersonalSignup ? "individual" : "company";
      const res = await axios.post('http://localhost:8000/auth/custom-google-login/', {
        access_token: tokenId,
        profile_type: profileType
      });

      // Store the authentication token in localStorage
      localStorage.setItem('authToken', res.data.auth_token);

      // Redirect or perform additional actions
      navigate('/');
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google login failure:', error);
  };

  return (
    <div className={`${styles.login} ${styles.marginCustom}`}>
      <div className={styles.login__form}>
        <div className={styles.login__group}>
          <img src={logo} alt="Logo" className={styles.auth__logo} />
          <h2 className={styles.login__title}>Hi, Welcome Back!</h2>
          <p className={styles.login__subtitle}>
            Please choose your account type and enter your credentials to sign up and create your account.
          </p>

          <div className={styles.toggle__container}>
            <button
              className={`${styles.toggle__button} ${isPersonalSignup ? styles.active : ''}`}
              onClick={() => toggleSignupMode()}
            >
              Individual
            </button>
            <button
              className={`${styles.toggle__button} ${!isPersonalSignup ? styles.active : ''}`}
              onClick={() => toggleSignupMode()}
            >
              Company
            </button>
          </div>



          {/* <div className={styles.login__google}><img className={styles.google__icon} src={google}></img>Continue with Google </div> */}
          <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              useOneTap
            />
          </GoogleOAuthProvider>


          <p className={styles.login__or}>or</p>

          {isPersonalSignup ? (
            <PersonalSignup navigate={navigate} />
          ) : (
            <CompanySignup navigate={navigate} />
          )}

          <p className={styles.login__signup}>
            Already have an account? <Link to={"/login"}>Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const PersonalSignup = ({ navigate }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFirstNameChange = (e) => setFirstName(e.target.value);
  const handleLastNameChange = (e) => setLastName(e.target.value);
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
      const response = await axios.post('http://127.0.0.1:8000auth/users/', {
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
    <form onSubmit={handleSubmit}>
      <div className={styles.login__group}>
        <div>
          <label htmlFor="first_name" className={styles.login__label}>First Name</label>
          <input required type="text" placeholder="First name" id="firstName" className={styles.login__input} value={firstName} onChange={handleFirstNameChange} />
        </div>
        <div>
          <label htmlFor="last_name" className={styles.login__label}>Last Name</label>
          <input required type="text" placeholder="Last Name" id="lastName" className={styles.login__input} value={lastName} onChange={handleLastNameChange} />
        </div>
        <div>
          <label htmlFor="email" className={styles.login__label}>Email</label>
          <input required type="email" placeholder="Write your email" id="email" className={styles.login__input} value={email} onChange={handleEmailChange} />
          {emailError && (
            <p className={styles.error}>
              <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
              {emailError}
            </p>
          )}        </div>
        <div>
          <label htmlFor="username" className={styles.login__label}>Username</label>
          <input required type="text" placeholder="Write your username" id="username" className={styles.login__input} value={username} onChange={handleUsernameChange} />
          {usernameError && (
            <p className={styles.error}>
              <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
              {usernameError}
            </p>
          )}        </div>
        <div>
          <label htmlFor="password" className={styles.login__label}>Password</label>
          <input required type="password" placeholder="Enter your password" id="password" className={styles.login__input} value={password} onChange={handlePasswordChange} />
        </div>
        <div>
          <label htmlFor="confirmPassword" className={styles.login__label}>Confirm Password</label>
          <input required type="password" placeholder="Confirm password" id="confirmPassword" className={styles.login__input} value={confirmPassword} onChange={handleConfirmPasswordChange} />
          {passwordError && (
            <p className={styles.error}>
              <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
              {passwordError}
            </p>
          )}        </div>
      </div>
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
    </form>
  );
};

const CompanySignup = ({ navigate }) => {
  const [companyName, setCompanyName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCompanyNameChange = (e) => setCompanyName(e.target.value);
  const handleAdminNameChange = (e) => setAdminName(e.target.value);
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
      const response = await axios.post('http://127.0.0.1:8000auth/users/', {
        company_name: companyName,
        admin_name: adminName,
        email,
        username,
        password,
        profile_type: 'company',
      });

      if (response.status === 201) {
        console.log('Company registered successfully:', response.data);
        const companyInfo = response.data;
        localStorage.setItem('company_name', companyInfo.company_name);
        localStorage.setItem('admin_name', companyInfo.admin_name);
        localStorage.setItem('email', companyInfo.email);
        localStorage.setItem('username', companyInfo.username);
        localStorage.setItem('profile_type', companyInfo.profile_type);
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
    <form onSubmit={handleSubmit}>
      <div className={styles.login__group}>
        <div>
          <label htmlFor="companyName" className={styles.login__label}>Company Name</label>
          <input required type="text" placeholder="Enter company name" id="companyName" className={styles.login__input} value={companyName} onChange={handleCompanyNameChange} />
        </div>
        <div>
          <label htmlFor="adminName" className={styles.login__label}>Admin Name</label>
          <input required type="text" placeholder="Enter admin name" id="adminName" className={styles.login__input} value={adminName} onChange={handleAdminNameChange} />
        </div>
        <div>
          <label htmlFor="email" className={styles.login__label}>Email</label>
          <input required type="email" placeholder="Write your email" id="email" className={styles.login__input} value={email} onChange={handleEmailChange} />
          {emailError && (
            <p className={styles.error}>
              <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
              {emailError}
            </p>
          )}        </div>
        <div>
          <label htmlFor="username" className={styles.login__label}>Username</label>
          <input required type="text" placeholder="Write your username" id="username" className={styles.login__input} value={username} onChange={handleUsernameChange} />
          {usernameError && (
            <p className={styles.error}>
              <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
              {usernameError}
            </p>
          )}        </div>
        <div>
          <label htmlFor="password" className={styles.login__label}>Password</label>
          <input required type="password" placeholder="Enter your password" id="password" className={styles.login__input} value={password} onChange={handlePasswordChange} />
        </div>
        <div>
          <label htmlFor="confirmPassword" className={styles.login__label}>Confirm Password</label>
          <input required type="password" placeholder="Confirm password" id="confirmPassword" className={styles.login__input} value={confirmPassword} onChange={handleConfirmPasswordChange} />
          {passwordError && (
            <p className={styles.error}>
              <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
              {passwordError}
            </p>
          )}        </div>
      </div>
      <div className={styles.login__agreement}>
        <input required type="checkbox" id="agreement" className={styles.login__checkbox} />
        <label htmlFor="agreement">
          I agree with
          <a href="/terms-of-service">Terms of Service</a>,
          <a href="/privacy-policy">Privacy Policy</a>
        </label>
      </div>
      <button type="submit" className={styles.login__button} disabled={loading}>
        {loading ? 'Signing Up...' : 'Sign Up as Company'}
      </button>
    </form>
  );
};

export default SignupPage;
