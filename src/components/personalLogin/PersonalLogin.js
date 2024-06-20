import React from 'react';
import styles from '../../assets/css/authentication/Authentication.module.css';
import { Link } from 'react-router-dom';

const PersonalLogin = () => {
  return (
    <div className={styles.login}>
      <form action="" className={styles.login__form}>
        <h2 className={styles.login__title}>Log In As Individual</h2>

        <div className={styles.login__group}>
          <div>
            <label htmlFor="email" className={styles.login__label}>Email</label>
            <input type="email" placeholder="Write your email" id="email" className={styles.login__input} />
          </div>
          <div>
            <label htmlFor="password" className={styles.login__label}>Password</label>
            <input type="password" placeholder="Enter your password" id="password" className={styles.login__input} />
          </div>
        </div>

        <div>
          <p className={styles.login__signup}>
            You do not have an account? <Link to={"/personal-signup"}>Signup</Link>
          </p>

          <a href="#" className={styles.login__forgot}>
            You forgot your password
          </a>

          <button type="submit" className={styles.login__button}>Log In</button>
        </div>
      </form>
    </div>
  );
};

export default PersonalLogin;