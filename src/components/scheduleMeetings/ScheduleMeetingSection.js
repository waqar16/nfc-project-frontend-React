import React from 'react';
import { Link } from 'react-router-dom';
// import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from '../../assets/css/index/ScheduleMeetingSection.module.css';

const ScheduleMeetingSection = () => {
    return (
      <div className={styles.scheduleMeetingSection}>
        {/* <div className={styles.content}>
          <h2 className={styles.title}>Schedule a Meeting</h2>
          <p className={styles.description}>
            Quickly and easily schedule a meeting with us. Select your preferred date and time, and we'll take care of the rest.
          </p>
          <Link to="/schedule-meeting" className={styles.ctaButton}>Schedule Now</Link>
        </div>
        <div className={styles.calendarPreview}>
          <Calendar
            className={styles.previewCalendar}
          />
        </div> */}
                <div className={styles.content}>
          <h2 className={styles.title}>Unmatched First Impression</h2>
          <p className={styles.description}>
            With your elegent one sec NFC Digital Cards
          </p>
          <Link to="/schedule-meeting" className={styles.ctaButton}>Create Now</Link>
        </div>
      </div>
    );
  };
  
  export default ScheduleMeetingSection;