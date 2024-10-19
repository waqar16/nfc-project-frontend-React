import React from 'react';
import { ClipLoader } from 'react-spinners';
import styles from '../../assets/css/Loader.module.css';

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <ClipLoader color="#4CAF50" size={30}
      />
      <p className={styles.loaderText}>Redirecting</p>
    </div>
  );
};

export default Loader;
