import React, { useState, useEffect } from 'react';
import styles from '../../assets/css/authentication/Authentication.module.css';
import axios from 'axios';
import ConfirmationModal from '../modal/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import Loader from '../loader/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AccountDeletion = () => {
    const navigate = useNavigate();
    const [isModalOpen, setModalOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [profileType, setProfileType] = useState('');
    const [authType, setAuthType] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);

        const userInfo = async () => {
            const token = localStorage.getItem('authToken');
            const storedAuthType = localStorage.getItem('authentication_type');
            setAuthType(storedAuthType);

            if (token) {
                try {
                    const response = await axios.get('  https://api.onese.shop/auth/users/me', {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    });

                    setProfileType(response.data.profile_type);
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    console.error('Error fetching profile type:', error);
                }
            } else {
                setLoading(false);
                navigate('/login');
            }
        };

        userInfo();
    }, [navigate]);

    const openModal = () => {
        if (authType === 'google' && deleteConfirmation.toLowerCase() !== 'delete') {
            setError('Please type "delete" to confirm account deletion.');
            toast.error('Please type "delete" to confirm account deletion.');
            return;
        }

        if (authType !== 'google' && password === '') {
            setError('Please enter your password.');
            toast.error('Please enter your password.');
            return;
        }
        
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    const handleDeletion = async () => {
        setLoading(true);
        setIsSubmitting(true);
        setError('');
        setMessage('');

        try {
            const authToken = localStorage.getItem('authToken');
            const requestData = authType === 'google' ? {} : { current_password: password };
            const endpoint = authType === 'google' ? `  https://api.onese.shop/auth/delete-user/` : `  https://api.onese.shop/auth/users/me/`;
            const response = await axios.delete(endpoint, {
                headers: {
                    Authorization: `Token ${authToken}`,
                },
                data: requestData
            });

            if (response.status !== 204) {
                setLoading(false);
                setError('An error occurred. Please check your input and try again.');
                toast.error('Failed to delete the account.');
                setIsSubmitting(false);
            } else {
                setLoading(false);
                closeModal();
                localStorage.removeItem('authToken');
                localStorage.removeItem('authentication_type');
                navigate('/');
                window.location.reload();
            }
        } catch (error) {
            setLoading(false);
            setIsSubmitting(false);
            if (error.response && error.response.data) {
                setError(error.response.data.current_password || 'Failed to delete the account.');
                closeModal();
            }
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setError('');
        setMessage('');
    };

    const handleDeleteConfirmationChange = (e) => {
        setDeleteConfirmation(e.target.value);
        setError('');
        setMessage('');
    };

    const handleSubmit = (e) => {
        if (deleteConfirmation !== 'delete') {
            setError('Please type "delete" to confirm account deletion.');
            toast.error('Please type "delete" to confirm account deletion.');
            return;
        }
        e.preventDefault();
        openModal();
    };

    return (
        <div>
            {loading && <Loader />} 
            <ToastContainer />
        <div className={`${styles.login}`}>
            <Sidebar profileType={profileType} />

            <form className={styles.login__form} onSubmit={handleSubmit}>
                <h2 className={styles.login__title}>Delete Account</h2>
                
                {authType === 'google' ? (
                    <div className={styles.login__group}>
                        <div>
                            <label htmlFor="deleteConfirmation" className={styles.login__label}>Type 'delete' to confirm</label>
                            <input
                                required
                                type="text"
                                placeholder="Type 'delete' to confirm"
                                id="deleteConfirmation"
                                className={styles.login__input}
                                value={deleteConfirmation}
                                onChange={handleDeleteConfirmationChange}
                            />
                        </div>
                    </div>
                ) : (
                    <div className={styles.login__group}>
                        <div>
                            <label htmlFor="password" className={styles.login__label}>Password</label>
                            <input
                                required
                                type="password"
                                placeholder="Enter your password"
                                id="password"
                                className={styles.login__input}
                                value={password}
                                onChange={handlePasswordChange}
                            />
                        </div>
                    </div>
                )}

                {error && <p style={{ textAlign: 'left', margin: '0', color: 'red' }}>{error}</p>}
                {message && <p style={{ color: 'green' }}>{message}</p>}

                <div>
                    <button type="button" onClick={openModal} className={`${styles.login__button} ${isSubmitting ? styles.disabled : ''}`} disabled={isSubmitting}>
                        Submit
                    </button>
                    
                </div>
            </form>
            <ConfirmationModal
                        message="Do you want to delete your account? This action cannot be undone."
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        onConfirm={handleDeletion}
                    />
                    
        </div>
        </div>
    );
};

export default AccountDeletion;
