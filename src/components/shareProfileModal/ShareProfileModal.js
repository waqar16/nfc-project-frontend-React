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
import html2canvas from 'html2canvas';
import styles from '../../assets/css/profiles/DigitalProfile.module.css';

const ShareProfileModal = ({ isOpen, onClose, onShare, shareLink, user }) => {
  const [recipient, setRecipient] = useState('');
  const qrCodeRef = useRef(null);

  if (!isOpen) return null;

  // Function to download styled QR code with user details
  const handleDownloadQRCode = async () => {
    const qrElement = qrCodeRef.current;
    const canvas = await html2canvas(qrElement, { scale: 3 });
    const image = canvas.toDataURL('image/png');

    const a = document.createElement('a');
    a.href = image;
    a.download = `${user.firstName}_${user.lastName}_QR_Code.png`;
    a.click();
  };

  const handleShare = () => {
    if (recipient) {
      onShare(recipient);
    } else {
      alert('Please enter a valid email recipient.');
    }
  };

  const handleEmail = () => {
    if (recipient) {
      window.location.href = `mailto:${recipient}?subject=Check out this profile&body=You can view the profile here: ${shareLink}`;
    } else {
      alert('Please enter a valid email.');
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
          <div className={styles.qrHeader}>
            <p className={styles.name}>{`${user.firstName} ${user.lastName}`}</p>
            {/* <p className={styles.status}>{user.isActive ? 'Active' : 'Inactive'}</p> */}
          </div>
          <QRCode value={shareLink} size={80} />
          <p className={styles.qrFooter}>Scan the QR code to view profile</p>
          

        </div>
                {/* Button to Download QR Code */}
                <button onClick={handleDownloadQRCode} className={styles.downloadButton}>
          Save QR Code
        </button>

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
          <button onClick={handleEmail} className={styles.emailButton}>Send Email</button>
          <button onClick={handleShare} className={styles.shareButton}>Share</button>
          <button onClick={onClose} className={styles.closeButton}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ShareProfileModal;
