import React, { useState } from 'react';
import styles from '../../assets/css/profiles/DigitalProfile.module.css';

const ShareProfileModal = ({ isOpen, onClose, onShare }) => {
  const [recipient, setRecipient] = useState('');

  const handleShare = () => {
    onShare(recipient);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Share Profile</h2>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Enter email or username"
        />
        <button onClick={handleShare}>Send</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ShareProfileModal;
