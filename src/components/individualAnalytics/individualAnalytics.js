import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import styles from '../../assets/css/profiles/IndividualAnalaytics.module.css';
import Sidebar from '../sidebar/Sidebar';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Map from '../Map/Map';
import Loader from '../loader/Loader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const options = ['Daily', 'Weekly', 'Monthly'];
const options2 = ['Time of Day', 'Day of Week'];
const defaultOption = options[0];
const defaultOption2 = options2[0];

const dummyPeakInteractionTime = [
  { period: '00:00 - 03:59', count: 0 },
  { period: '03:00 - 06:59', count: 0 },
  { period: '06:00 - 09:59', count: 1 },
  { period: '09:00 - 12:59', count: 5 },
  { period: '12:00 - 15:59', count: 0 },
  { period: '15:00 - 18:59', count: 0 },
  { period: '18:00 - 21:59', count: 5 },
  { period: '21:00 - 24:59', count: 0 },
];

const dummyGeoData = [
  { name: 'USA', interactions: 120 },
  { name: 'Germany', interactions: 85 },
  { name: 'Japan', interactions: 60 },
  { name: 'France', interactions: 55 },
  { name: 'Canada', interactions: 45 },
];

const Analytics = () => {
  const [interactionFrequency, setInteractionFrequency] = useState([]);
  const [peakInteractionTime, setPeakInteractionTime] = useState(dummyPeakInteractionTime);
  const [geoData] = useState(dummyGeoData);
  const { userId, username } = useParams();
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userResponse = await axios.get('https://letsconnect.onesec.shop/auth/users/me/', {
          headers: {
            Authorization: `Token ${token}`
          }
        });

        const { id, profile_type, username: authenticatedUsername } = userResponse.data;

        if (profile_type !== localStorage.getItem('profile_type') || userId !== id.toString() || username !== authenticatedUsername) {
          console.log(`UserId from URL: ${userId}, User ID: ${id}`);
          navigate('/not-authorized');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId, navigate, username]);

  const fetchInteractionFrequency = async (frequency) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://letsconnect.onesec.shop/api/interaction-frequency/${frequency.toLowerCase()}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('authToken')}`,
        },
      });
      const formattedData = response.data.map(item => ({
        Period: item.period,
        Count: item.count,
      }));
      setInteractionFrequency(formattedData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching interaction frequency:', error);
    }
  };

  const fetchPeakInteractionTime = async (frequency) => {
    try {
      setLoading(true);
      const formattedFrequency = frequency.toLowerCase().replace(/ /g, '_');
      const response = await axios.get(`  https://letsconnect.onesec.shop/api/peak-interaction-time/${formattedFrequency}`, {        headers: {
          Authorization: `Token ${localStorage.getItem('authToken')}`,
        },
      });
      const transformedData = response.data.data.map(item => ({
        period: item.period,
        count: item.count,
      }));
      setPeakInteractionTime(transformedData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching peak interaction time:', error);
    }
  };

  useEffect(() => {
    fetchInteractionFrequency(defaultOption);
    fetchPeakInteractionTime(defaultOption2);
  }, []);

  const handleDropdownChange = async (option) => {
    await fetchInteractionFrequency(option.value);
    await fetchPeakInteractionTime(defaultOption2);
  };

  const handleDropdownChange2 = async (option) => {
    await fetchPeakInteractionTime(option.value);
  };

  const getMostInteractedCountry = () => {
    let maxInteractions = 0;
    let mostInteractedCountry = null;
    geoData.forEach(country => {
      if (country.interactions > maxInteractions) {
        maxInteractions = country.interactions;
        mostInteractedCountry = country.name;
      }
    });
    return mostInteractedCountry;
  };

  const mostInteractedCountry = getMostInteractedCountry();

  return (
    <div className={styles.analyticsContainer}>
      <h2 className={styles.analyticTitle}>Analytics Dashboard</h2>
      <Sidebar profileType={localStorage.getItem('profile_type')} />
      <div className={styles.analyticsContent}>
                {/* Geographic Data */}
                <div className={styles.card}>
          <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
              <h3>Geographic Data</h3>
            </div>
            <Map />
          </div>
        </div>
        {/* Interaction Frequency Chart */}
        <div className={styles.card}>
          <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
              <h3>Interaction Frequency</h3>
              <Dropdown
                options={options}
                onChange={handleDropdownChange}
                value={defaultOption}
                placeholder="Select an option"
              />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={interactionFrequency}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Period" />
                <YAxis tickFormatter={(tick) => Math.round(tick)} />
                <Tooltip />
                <Line type="monotone" dataKey="Count" stroke="purple" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Interactions Time Chart */}
        <div className={styles.card}>
          <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
              <h3>Peak Interactions Time</h3>
              <Dropdown
                options={options2}
                onChange={handleDropdownChange2}
                value={defaultOption2}
                placeholder="Select an option"
              />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={peakInteractionTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis tickFormatter={(tick) => Math.round(tick)} />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className={styles.analyticsContent}>
        {/* Networking stats */}
        {/* <div className={styles.card}>
          <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
              <h3>Network Stats</h3>
            </div>
            <ul className={styles.userList}>
              <li>
                <span>
                  <img src='https://placehold.co/150x150' alt='Profile' />
                  Lily Saunders
                </span>
                <span className={styles.pending} >ID #3124 • Pending</span>
              </li>
              <li>
                <span>
                  <img src='https://placehold.co/150x150' alt='Profile' />
                  Lily Saunders
                </span>
                <span className={styles.paid}>ID #3124 • Paid</span>
              </li>
              <li>
                <span>
                  <img src='https://placehold.co/150x150' alt='Profile' />
                  Lily Saunders
                </span>
                <span className={styles.paid}>ID #3124 • Paid</span>
              </li>
              <li>
                <span>
                  <img src='https://placehold.co/150x150' alt='Profile' />
                  Lily Saunders
                </span>
                <span className={styles.pending}>ID #3124 • Pending</span>
              </li>
            </ul>
          </div>
        </div> */}
      </div>
      {loading && <Loader />}
      <ToastContainer />
    </div>
  );
};

export default Analytics;
