import React from 'react';
import { ClipLoader } from 'react-spinners';
import styles from '../../assets/css/Loader.module.css';

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <ClipLoader color="#ffffff" size={150} />
    </div>
  );
};

export default Loader;
