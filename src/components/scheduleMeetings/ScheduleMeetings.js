import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
// import axios from 'axios';
import styles from '../../assets/css/profiles/ScheduleMeeting.module.css';

const ScheduleMeeting = ({ attendeeEmail, userId, username }) => {
  const [date, setDate] = useState(new Date());
  const [meetingDetails, setMeetingDetails] = useState({
    attendee_email: '',
    title: '',
    description: '',
    time: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getQueryParams = (search) => {
      return new URLSearchParams(search);
    };

    const queryParams = getQueryParams(window.location.search); 
    const status = queryParams.get('status');

    if (status === 'success') {
      setMessage({ type: 'success', text: 'Meeting scheduled successfully.' });
    } else if (status === 'failure') {
      setMessage({ type: 'error', text: 'Error scheduling meeting.' });
    }
    const newUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  }, []); 

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

  // Form validation
  const validateForm = () => {
    if (!meetingDetails.title) {
      setMessage('Meeting title is required.');
      return false;
    }
    if (!meetingDetails.description) {
      setMessage('Meeting description is required.');
      return false;
    }
    if (!meetingDetails.time) {
      setMessage('Meeting time is required.');
      return false;
    }
    if (!attendeeEmail) {
      setMessage('Attendee email is required.');
      return false;
    }
    return true;
  };

  const handleAuthAndSchedule = async () => {
    if (!validateForm()) {
      return; 
    }

    try {
      const dateString = date.toISOString().split('T')[0];
      const combinedDateTime = `${dateString}T${meetingDetails.time}:00.000Z`;

      const authUrl = `https://api.onesec.shop/google/auth-request/?title=${encodeURIComponent(meetingDetails.title)}&description=${encodeURIComponent(meetingDetails.description)}&start_datetime=${combinedDateTime}&attendee_email=${encodeURIComponent(attendeeEmail)}&user_id=${encodeURIComponent(userId)}&username=${encodeURIComponent(username)}`;
      
      window.location.href = authUrl;
    } catch (error) {
      setMessage('Error starting authorization process.');
      console.error('Error initiating Google OAuth flow:', error);
    }
  };

  return (
    <div className={styles.scheduleMeeting}>
      <h2 className={styles.title}>Schedule a Meeting</h2>
      <div className={styles.calendarContainer}>
        <Calendar onChange={handleDateChange} value={date} className={styles.customCalendar} />
      </div>
      <form className={styles.form}>
        <div className={styles.formGroup}>
          <input
            type="hidden"
            id="email"
            value={attendeeEmail}
            name="email"
            onChange={handleChange}
            className={styles.input}
            required
            readOnly
          />
        </div>
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
            required
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
            required
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
            required
          />
        </div>
        <button type="button" onClick={handleAuthAndSchedule} className={styles.button}>
          Schedule Meeting
        </button>
        {message && (
  <p className={`${styles.message} ${message.type === 'success' ? styles.success : styles.error}`}>
    <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} style={{ marginRight: '8px' }}></i>
    {message.text}
  </p>
)}
      </form>
    </div> 
  );
};

export default ScheduleMeeting;
