// import React, { useState } from 'react';
// import styles from '../../assets/css/profiles/DigitalProfile.module.css';
// import QRCode from 'qrcode.react';

// const ShareProfileModal = ({ isOpen, onClose, onShare, shareLink }) => {
//   const [recipient, setRecipient] = useState('');

//   if (!isOpen) return null;

//   const handleShare = () => {
//     if (recipient) {
//       onShare(recipient);
//     } else {
//       alert('Please enter a recipient.');
//     }
//   };

//   return (
//     <div className={styles.modalOverlay}>
//       <div className={styles.modalContent}>
//         <h2>Share Profile</h2>
//         <p>Copy the link to share your profile:</p>
//         <input type="text" value={shareLink} readOnly className={styles.shareLinkInput} />
//         <button onClick={() => navigator.clipboard.writeText(shareLink)} className={styles.copyButton}>Copy Link</button>
//         <div className={styles.qrCodeContainer}>
//           <p>Scan the QR code to open your profile:</p>
//           <QRCode value={shareLink} size={100} />
//         </div>
//         <p>Or share directly on email:</p>
//         <input
//           type="email"
//           placeholder="Recipient's Email"
//           value={recipient}
//           onChange={(e) => setRecipient(e.target.value)}
//           className={styles.recipientInput}
//         />

//         <div className={styles.modalActions}>
//           <button onClick={handleShare} className={styles.shareButton}>Share</button>
//           <button onClick={onClose} className={styles.closeButton}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShareProfileModal;

import React, { useState, useRef } from 'react';
import QRCode from 'qrcode.react';
import styles from '../../assets/css/profiles/DigitalProfile.module.css';

const ShareProfileModal = ({ isOpen, onClose, onShare, shareLink, }) => {
  const [recipient, setRecipient] = useState('');
  const qrCodeRef = useRef(null);

  if (!isOpen) return null;


  const handleShare = () => {
    if (recipient) {
      onShare(recipient);
    } else {
      alert('Please enter a valid email recipient.');
    }
  };



  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        
        <h2>Share Profile</h2>
        {/* <p>Copy the link to share your profile:</p> */}
        <input type="text" value={shareLink} readOnly className={styles.shareLinkInput} />
        <button onClick={() => navigator.clipboard.writeText(shareLink)} className={styles.copyButton}>
          Copy Link To Clipboard
        </button>

        {/* QR Code Container with User Details */}
        <div ref={qrCodeRef} className={styles.styledQRCode}>
          <QRCode value={shareLink} size={80} />
          <p className={styles.qrFooter}>Scan the QR code to view profile</p>
          

        </div>

        {/* Email Sharing */}
        <p>Or share directly via email:</p>
        <input
          type="email"
          placeholder="Recipient's Email"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className={styles.recipientInput}
        />
        <div className={styles.modalActions}>
          <button onClick={handleShare} className={styles.shareButton}>Share</button>
          <button onClick={onClose} className={styles.closeButton}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ShareProfileModal;
