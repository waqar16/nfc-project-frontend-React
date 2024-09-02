import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../assets/css/authentication/Authentication.module.css';

const PasswordResetConfirm = () => {
  const { uid, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    setError('');
    setMessage('');
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post('  http://localhost:8000/auth/users/reset_password_confirm/', {
        uid,
        token,
        new_password: newPassword,
      });
      setMessage('Password reset successfully');
      navigate('/personal-login');
    }catch (error) {
        const data = error.response.data;
        setError(data.new_password[0]);
      }
  };

  return (
    <div className={styles.login}>
      <form action="" className={styles.login__form} onSubmit={handleSubmit}>
        <h2 className={styles.login__title}>Reset Password</h2>

        <div className={styles.login__group}>
          <div>
            <label htmlFor="new_password" className={styles.login__label}>New Password</label>
            <input
              required
              type="password"
              placeholder="Enter new password"
              id="new_password"
              className={styles.login__input}
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
          </div>
          <div>
            <label htmlFor="confirm_password" className={styles.login__label}>Confirm Password</label>
            <input
              required
              type="password"
              placeholder="Confirm new password"
              id="confirm_password"
              className={styles.login__input}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}

        <div>
          <button type="submit" className={styles.login__button}>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default PasswordResetConfirm;
