import React, { useState, useEffect, useCallback } from 'react';
import styles from '../../assets/css/profiles/ManageAppointments.module.css';
import Sidebar from '../sidebar/Sidebar';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';

const ListReceivedCards = () => {
    const [receivedCards, setReceivedCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingNextPage, setLoadingNextPage] = useState(false);

    const companyLogo = localStorage.getItem('company_logo');
    const profilePic = localStorage.getItem('profile_pic');

    const navigate = useNavigate();

    const fetchCards = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/received-cards/?page=${page}`, {
                headers: { Authorization: `Token ${localStorage.getItem('authToken')}` }
            });

            const newCards = Array.isArray(response.data.results) ? response.data.results : [];
            setReceivedCards(prev => [...prev, ...newCards]);
            setHasMore(response.data.next !== null);

            setLoading(false);
            setLoadingNextPage(false);
        } catch (error) {
            setError('Error fetching received cards.');
            setLoading(false);
            setLoadingNextPage(false);
            console.error('Error fetching received cards:', error);
        }
    }, [page]);

    useEffect(() => {
        fetchCards();
    }, [fetchCards]);

    const handleLoadMore = () => {
        if (!loadingNextPage && hasMore) {
            setLoadingNextPage(true);
            setPage(prevPage => prevPage + 1);
        }
    };

    const handleViewDetails = (profileId, sharedProfileType, profileEmail, profileUsername) => {
        if (sharedProfileType === 'company') {
          navigate(`/company/${profileId}`);
        }

        else if (sharedProfileType === 'employee') {
          navigate(`/profile/${profileUsername}`);
        }

        else {
          navigate(`/profile/${profileUsername}`);
        }
      };

    return (
        <div className={styles.manageAppointmentsSection}>
            <Sidebar profileType={localStorage.getItem('profile_type')} profilePic={profilePic} logo={companyLogo} />
            <h2 className={styles.title}>Received Cards</h2>
            <div className={styles.manageAppointments}>
                {message && <p className={styles.message}>{message}</p>}
                {error && <p className={styles.error}>{error}</p>}
                {receivedCards.length === 0 && !loading && !loadingNextPage ? (
                    <p>No received cards available.</p>
                ) : (
                    <div className={styles.appointmentList}>
                        {loading && !receivedCards.length ? (
                            [...Array(3)].map((_, index) => (
                                <div key={index} className={styles.placeholderCard}>
                                    <div className={styles.placeholderTitle}></div>
                                    <div className={styles.placeholderDescription}></div>
                                    <div className={styles.placeholderInfo}></div>
                                </div>
                            ))
                        ) : (
                            receivedCards.map((card, index) => (
                                <div key={index} className={styles.appointmentItem}>
                                    {/* <h3 className={styles.cardTitle}>Card ID: {card.id}</h3> */}
                                    <p><i className="ri-time-line"></i> Shared At: {new Date(card.shared_at).toLocaleString()}</p>
                                    <p><i className="ri-user-line"></i> Shared from: {card.shared_from_email}</p>
                                    {/* <p><i className="ri-user-line"></i> Shared With: {card.user}</p> */}
                                    <p><i className="ri-profile-line"></i> Profile Type: {card.profile_type_who_shared}</p>
                                    <button onClick={() => handleViewDetails(card.shared_from, card.profile_type_who_shared, card.shared_from_email, card.shared_from_username)} className={styles.viewCardButton}>
                                        <i className="ri-eye-line"></i> View Details
                                    </button>
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

export default ListReceivedCards;
