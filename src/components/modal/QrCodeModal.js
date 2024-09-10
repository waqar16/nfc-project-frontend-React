import React, { useRef } from 'react';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';
import styles from './QrCodeModal.module.css';

const QrCodeModal = ({ name, position, profilePic, isOpen, onClose, shareLink, logo }) => {
  const contentRef = useRef(null);
  if (!isOpen) return null;

  const handleAddToGallery = () => {
    html2canvas(contentRef.current, {
      allowTaint: true,
      useCORS: true,
    }).then((canvas) => {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = 'profile_qrcode.png';
      link.click();
    });
  };
  
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.closeButton}>
          <i className="ri-close-line" style={{ fontSize: '24px' }}></i>
        </button>
        <div className={styles.content} ref={contentRef}>
          <div className={styles.header}>
          {profilePic ? (
            <img className={styles.profilePic} src={profilePic} alt="Profile" />
          ) : (
            logo && <img className={styles.logo} src={logo} alt="Logo" />
          )}
            <h2>{name}</h2>
            <p>{position}</p>
          </div>
          <div className={styles.qRCodeContainer}>
            <QRCode value={shareLink} size={100} />
          </div>
        </div>
        <div className={styles.actionButton}>
        <button onClick={handleAddToGallery} className={styles.galleryButton}>
            <i className="ri-download-line"></i> 
          </button>
        </div>
        </div>

    </div>
  );
};

export default QrCodeModal;