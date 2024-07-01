import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../assets/css/index/EmployeeProfile.module.css'; // Import CSS module
import defaultProfilePic from '../../assets/img/bg-image.png';

const EmployeeProfile = () => {
    const [employee, setEmployee] = useState({
      name: 'John Doe',
      profilePic: defaultProfilePic,
      nfcStatus: 'Active',
      recentInteractions: [
        { id: 1, description: 'Interacted with client A' },
        { id: 2, description: 'Reviewed project details' },
        { id: 3, description: 'Attended team meeting' },
      ],
      upcomingAppointments: [
        { id: 1, date: '2024-07-10', time: '10:00 AM', client: 'Client B' },
        { id: 2, date: '2024-07-12', time: '2:00 PM', client: 'Client C' },
      ],
    });
  
    return (
      <div className={styles.employeeProfileContainer}>
        <div className={styles.profileSummary}>
          <h2>Emplyee Profile</h2>
          <div className={styles.profileSummaryContent}>
            <div className={styles.profilePicContainer}>
              <img src={employee.profilePic} alt="Profile" className={styles.profilePic} />
            </div>
            <div className={styles.profileInfo}>
              <h3>{employee.name}</h3>
              <p>NFC Card Status:</p>
              <span className={employee.nfcStatus === 'Active' ? styles.active : ''}> {employee.nfcStatus}</span>
            </div>
          </div>
        </div>
  
        <div className={styles.section}>
          <h2>Recent Interactions</h2>
          <ul className={styles.interactionsList}>
            {employee.recentInteractions.length > 0 ? (
              employee.recentInteractions.map((interaction) => (
                <li key={interaction.id}>{interaction.description}</li>
              ))
            ) : (
              <li>No recent interactions</li>
            )}
          </ul>
        </div>
  
        <div className={styles.section}>
          <h2>Upcoming Appointments</h2>
          <ul className={styles.appointmentsList}>
            {employee.upcomingAppointments.length > 0 ? (
              employee.upcomingAppointments.map((appointment) => (
                <li key={appointment.id}>
                  {appointment.date} - {appointment.time} with {appointment.client}
                </li>
              ))
            ) : (
              <li>No upcoming appointments</li>
            )}
          </ul>
        </div>
      </div>
    );
  };
  
  export default EmployeeProfile;