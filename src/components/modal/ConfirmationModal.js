import React from 'react';
import styles from '../../assets/css/authentication/ConfirmationModal.module.css';
import mark from '../../assets/img/mark.png'

const ConfirmationModal = ({ message, isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
      <button className={styles.closeButton} onClick={onClose}>
          <i className="ri-close-line" style={{ fontSize: '24px' }}></i>
        </button>
        <div className={styles.content}>
          <div className={styles.icon}>
            <img src={mark} alt="icon" />
          </div>
          <h2>Are You Sure?</h2>
          <p>{message}</p>
          <div className={styles.actions}>
            <button className={styles.confirmButton} onClick={onConfirm}>
              Yes, Sure
            </button>
            <button className={styles.cancelButton} onClick={onClose}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
