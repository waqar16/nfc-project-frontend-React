import React, { useState, useEffect } from 'react';
import styles from '../../assets/css/profiles/ManageAppointments.module.css';
import Sidebar from '../sidebar/Sidebar';
import axios from 'axios';


const ManageAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Simulate API call with dummy data
        const fetchAppointments = async () => {
            try {
                const appointmentsdata = await axios.get('http://54.84.254.221/api/get-meetings/',
                    { headers: { Authorization: `Token ${localStorage.getItem('authToken')}` } }
                )

                console.log(appointmentsdata.data)
                setAppointments(appointmentsdata.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching appointments.');
                setLoading(false);
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, []);

    const handleDelete = (id) => {
        try {
            // Simulate delete action
            setAppointments((prevAppointments) =>
                prevAppointments.filter((appointment) => appointment.id !== id)
            );
            setMessage('Appointment deleted successfully!');
        } catch (error) {
            setMessage('Error deleting appointment.');
            console.error('Error deleting appointment:', error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.manageAppointmentsSection}>
            <Sidebar profileType={localStorage.getItem('profile_type')} />
            <h2 className={styles.title}>Upcomming Appointments</h2>
            <div className={styles.manageAppointments}>

                {message && <p className={styles.message}>{message}</p>}
                {appointments.length === 0 ? (
                    <p>No appointments available.</p>
                ) : (
                    <div className={styles.appointmentList}>
                        {appointments.map((appointment) => (
                            <div key={appointment.id} className={styles.appointmentItem}>
                                <h3 className={styles.appointmentTitle}>{appointment.title}</h3>
                                <p className={styles.appointmentDescription}>{appointment.description}</p>
                                <p><strong>Host:</strong> {appointment.host_email}</p>
                                <p><strong>Date:</strong> {appointment.datetime}</p>
                                <p className={styles.appointmentStatus}>
                                    Status:
                                    <span
                                        style={{
                                            color: appointment.meeting_status === 'pending' ? 'red' : appointment.meeting_status === 'completed' ? 'green' : 'black'
                                        }}
                                    >
                                        {appointment.meeting_status}
                                    </span>
                                </p>                             
                                  {/* <button onClick={() => handleDelete(appointment.id)} className={styles.deleteButton}>Delete</button> */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageAppointments;
