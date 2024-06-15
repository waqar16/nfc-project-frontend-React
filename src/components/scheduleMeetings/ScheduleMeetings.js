import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from '../../assets/css/ScheduleMeeting.module.css';

const ScheduleMeeting = () => {
  const [date, setDate] = useState(new Date());
  const [meetingDetails, setMeetingDetails] = useState({
    title: '',
    description: '',
    time: ''
  });

  const handleDateChange = (date) => {
    setDate(date);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeetingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Meeting scheduled successfully!');
  };

  return (
    <div className={styles.scheduleMeeting}>
      <h2 className={styles.title}>Schedule a Meeting</h2>
      <div className={styles.calendarContainer}>
        <Calendar onChange={handleDateChange} value={date} className={styles.customCalendar} />
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>Meeting Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={meetingDetails.title}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter meeting title"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>Description</label>
          <textarea
            id="description"
            name="description"
            value={meetingDetails.description}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Enter meeting description"
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="time" className={styles.label}>Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={meetingDetails.time}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>Schedule Meeting</button>
      </form>
    </div>
  );
};

export default ScheduleMeeting;
