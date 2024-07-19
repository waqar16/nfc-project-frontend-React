import React, { useState } from 'react';
import styles from '../../assets/css/authentication/Authentication.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/img/logo.png';
import google from '../../assets/img/socials/google.png';

const LoginPage = () => {
  const [isPersonalLogin, setIsPersonalLogin] = useState(true); // State to toggle between personal and company login
  const toggleLoginMode = () => setIsPersonalLogin(!isPersonalLogin); // Function to toggle login mode
  const navigate = useNavigate();

  return (
    <div className={`${styles.login} ${styles.marginCustom}`}>
      <div className={styles.login__form}>
        <div className={styles.login__group}>
          <img src={logo} alt="Logo" className={styles.auth__logo} />
          <h2 className={styles.login__title}>Welcome Back!</h2>
          <p className={styles.login__subtitle}>
            Please choose your account type and enter your credentials to log in.
          </p>

          <div className={styles.toggle__container}>
            <button
              className={`${styles.toggle__button} ${isPersonalLogin ? styles.active : ''}`}
              onClick={() => toggleLoginMode()}
            >
              Individual/Employee
            </button>
            <button
              className={`${styles.toggle__button} ${!isPersonalLogin ? styles.active : ''}`}
              onClick={() => toggleLoginMode()}
            >
              Company
            </button>
          </div>
          <div className={styles.login__google}>
            <img className={styles.google__icon} src={google}></img>
            Continue with Google
          </div>
          <p className={styles.login__or}>or</p>

          {isPersonalLogin ? (
            <PersonalLogin navigate={navigate} />
          ) : (
            <CompanyLogin navigate={navigate} />
          )}

          <p className={styles.login__signup}>
            Don't have an account? <Link to={"/signup"}>Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const PersonalLogin = ({ navigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    // const navigate = useNavigate();
  
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
        const response = await axios.post('http://127.0.0.1:8000/auth/token/login/', {
          email,
          password,
        });
  
        // const response2 = await axios.get('http://127.0.0.1:8000/api/profile_type/', {
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
          const userResponse = await axios.get('http://127.0.0.1:8000/auth/users/me/', {
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
          else if (profile_type === 'employee'){
            navigate(`/employee-profile/${username}`);
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
    <form onSubmit={handleSubmit}>
      <div className={styles.login__group}>
        <div>
          <label htmlFor="email" className={styles.login__label}>Email</label>
          <input required type="email" placeholder="Write your email" id="email" className={styles.login__input} value={email} onChange={handleEmailChange} />
        </div>
        <div>
          <label htmlFor="password" className={styles.login__label}>Password</label>
          <input required type="password" placeholder="Enter your password" id="password" className={styles.login__input} value={password} onChange={handlePasswordChange} />
        </div>
        {error && (
  <p className={styles.error}>
    <i className="fas fa-exclamation-circle" style={{ marginRight: '8px', borderRadius: '50%' }}></i>
    {error}
  </p>
)}      </div>
      <Link className={styles.login__forgot} to={"/reset-password"}>Forgot Password?</Link>

      <button type="submit" className={styles.login__button} disabled={loading}>
        {loading ? 'Logging In...' : 'Log In as Individual/Employee'}
      </button>
    </form>
  );
};

const CompanyLogin = ({ navigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    // const navigate = useNavigate();
  
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
        const response = await axios.post('http://127.0.0.1:8000/auth/token/login/', {
          email,
          password,
        });
  
        // const response2 = await axios.get('http://127.0.0.1:8000/api/profile_type/', {
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
          const userResponse = await axios.get('http://127.0.0.1:8000/auth/users/me/', {
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
    <form onSubmit={handleSubmit}>
      <div className={styles.login__group}>
        <div>
          <label htmlFor="email" className={styles.login__label}>Email</label>
          <input required type="email" placeholder="Write your email" id="email" className={styles.login__input} value={email} onChange={handleEmailChange} />
        </div>
        <div>
          <label htmlFor="password" className={styles.login__label}>Password</label>
          <input required type="password" placeholder="Enter your password" id="password" className={styles.login__input} value={password} onChange={handlePasswordChange} />
        </div>
        {error && (
  <p className={styles.error}>
    <i className="fas fa-exclamation-circle" style={{ marginRight: '8px', borderRadius: '50%' }}></i>
    {error}
  </p>
)}      </div>
      <Link className={styles.login__forgot} to={"/reset-password"}>Forgot Password?</Link>

      <button type="submit" className={styles.login__button} disabled={loading}>
        {loading ? 'Logging In...' : 'Log In as Company'}
      </button>
    </form>
  );
};

export default LoginPage;
