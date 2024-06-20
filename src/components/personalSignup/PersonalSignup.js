import React from 'react';
import styles from '../../assets/css/PersonalSignup.module.css';
import { Link } from 'react-router-dom';

const PersonalSignup = () => {
  return (
    <div className={styles.login}>
      <form action="" className={styles.login__form}>
        <h2 className={styles.login__title}>Sign Up As Individual</h2>

        <div className={styles.login__group}>
          <div>
            <label htmlFor="email" className={styles.login__label}>Email</label>
            <input type="email" placeholder="Write your email" id="email" className={styles.login__input} />
          </div>
          <div>
            <label htmlFor="password" className={styles.login__label}>Password</label>
            <input type="password" placeholder="Enter your password" id="password" className={styles.login__input} />
          </div>
          <div>
            <label htmlFor="confirmpassword" className={styles.login__label}>Confirm Password</label>
            <input type="confirmpassword" placeholder="Confirm password" id="confirmpassword" className={styles.login__input} />
          </div>
        </div>

        <div>
          <p className={styles.login__signup}>
            Already have an account? <Link to={"/personal-login"}>Log In</Link>
          </p>
          <div className={styles.socialSignup}>
            <h3 className={styles.socialSignup__title}>Or Sign Up with</h3>
            <button className={styles.socialSignup__button}>
              <i className="ri-google-line"></i> Google
            </button>
            {/* <button className={styles.socialSignup__button}>
              <i className="ri-facebook-box-line"></i> Facebook
            </button> */}
          </div>
          <button type="submit" className={styles.login__button}>Sign Up</button>

        </div>
      </form>
    </div>
  );
};

export default PersonalSignup;