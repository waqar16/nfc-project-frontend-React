import React, { useState, useEffect, useCallback } from 'react';
import styles from '../../assets/css/profiles/ManageAppointments.module.css';
import Sidebar from '../sidebar/Sidebar';
import axios from 'axios';
import CompanyCard from '../companyProfile/CompanyCard';

const ManageAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); 
    const [loadingNextPage, setLoadingNextPage] = useState(false);

    const companyLogo = localStorage.getItem('company_logo');
    const profilePic = localStorage.getItem('profile_pic');
    

    const fetchAppointments = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/get-meetings/?page=${page}`, {
                headers: { Authorization: `Token ${localStorage.getItem('authToken')}` }
            });

            console.log(response.data)

            let newAppointments = Array.isArray(response.data.results) ? response.data.results : [];

            newAppointments.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

            setAppointments(prev => [...prev, ...newAppointments]);
            setHasMore(response.data.next !== null);

            setLoading(false);
            setLoadingNextPage(false);
        } catch (error) {
            setError('Error fetching appointments.');
            setLoading(false);
            setLoadingNextPage(false);
            console.error('Error fetching appointments:', error);
        }
    }, [page]);
    
    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleLoadMore = () => {
        if (!loadingNextPage && hasMore) {
            setLoadingNextPage(true);
            setPage(prevPage => prevPage + 1);
        }
    };

    const handleDelete = async (id) => {
        try {
            // Assume you have a DELETE API endpoint for appointments
            // await axios.delete(`http://localhost:8000/api/delete-appointment/${id}/`, {
            //     headers: { Authorization: `Token ${localStorage.getItem('authToken')}` }
            // });

            setAppointments(prevAppointments =>
                prevAppointments.filter(appointment => appointment.id !== id)
            );
            setMessage('Appointment deleted successfully!');
        } catch (error) {
            setMessage('Error deleting appointment.');
            console.error('Error deleting appointment:', error);
        }
    };

    return (
        <div className={styles.manageAppointmentsSection}>
            <Sidebar profileType={localStorage.getItem('profile_type')} logo={companyLogo} profilePic={profilePic} />
            <h2 className={styles.title}>Appointments</h2>
            <div className={styles.manageAppointments}>
                {message && <p className={styles.message}>{message}</p>}
                {error && <p className={styles.error}>{error}</p>}
                {appointments.length === 0 && !loading && !loadingNextPage ? (
                    <p>No appointments available.</p>
                ) : (
                    <div className={styles.appointmentList}>
                        {loading && !appointments.length ? (
                            [...Array(3)].map((_, index) => (
                                <div key={index} className={styles.placeholderCard}>
                                    <div className={styles.placeholderTitle}></div>
                                    <div className={styles.placeholderDescription}></div>
                                    <div className={styles.placeholderInfo}></div>
                                </div>
                            ))
                        ) : (
                            appointments.map((appointment, index) => (
                                <div key={index} className={styles.appointmentItem}>
                                    <i className="ri-calendar-event-line"></i>
                                    <h3 className={styles.appointmentTitle}>{appointment.title}</h3>
                                    <p className={styles.appointmentDescription}>{appointment.description}</p>
                                    {/* <p><i className="ri-user-line"></i> Host: {appointment.host_email}</p> */}
                                    <p><i className="ri-time-line"></i> Date: {new Date(appointment.datetime).toLocaleString()}</p>
                                    <p className={styles.appointmentStatus}>
                                        <i className="ri-check-double-line"></i> Status:
                                        <span className={styles.statusText}>
                                            {appointment.meeting_status === 'pending' ? 'Pending' :
                                                appointment.meeting_status === 'completed' ? 'Completed' : 'Unknown'}
                                        </span>
                                    </p>
                                    {/* <button onClick={() => handleDelete(appointment.id)} className={styles.deleteButton}>
                                        <i className="ri-delete-bin-6-line"></i> Delete
                                    </button> */}
                                </div>
                            ))
                        )}
                        {loadingNextPage && (
                            <div className={styles.placeholderCard}>
                                <div className={styles.placeholderTitle}></div>
                                <div className={styles.placeholderDescription}></div>
                                <div className={styles.placeholderInfo}></div>
                            </div>
                        )}
                    </div>
                )}
                {!loading && hasMore && !loadingNextPage && (
                    <button onClick={handleLoadMore} className={styles.loadMoreButton}>
                        <i className="ri-loader-4-line" style={{ marginRight: '8px' }}></i>
                        Load More
                    </button>
                )}
            </div>
        </div>
    );
};

export default ManageAppointments;
