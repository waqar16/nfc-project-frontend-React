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

const options = ['Daily', 'Weekly', 'Monthly'];
const defaultOption = options[0];

const dummyPeakInteractionTime = [
  { name: 'Monday', pv: 0, uv: 4 },
  { name: 'Tuesday', pv: 4, uv: 4 },
  { name: 'Wednesday', pv: 8, uv: 5 },
  { name: 'Thursday', pv: 2, uv: 7 },
  { name: 'Friday', pv: 7, uv: 7 },
  { name: 'Saturday', pv: 7, uv: 6 },
  { name: 'Sunday', pv: 7, uv: 9 },
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userResponse = await axios.get('https://waqar123.pythonanywhere.com/auth/users/me/', {
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
        // Handle errors, e.g., redirect to login page or show error message
      }
    };

    fetchUserData();
  }, [userId, navigate, username]);

  const fetchInteractionFrequency = async (frequency) => {
    try {
      const response = await axios.get(`https://waqar123.pythonanywhere.com/api/interaction-frequency/${frequency.toLowerCase()}`,
    {
      headers: {
        Authorization: `Token ${localStorage.getItem('authToken')}`,
      },
    });
      const formattedData = response.data.map(item => ({
        name: new Date(item.timestamp__date).toLocaleDateString(),
        uv: item.count,
      }));
      setInteractionFrequency(formattedData);
    } catch (error) {
      console.error('Error fetching interaction frequency:', error);
    }
  };

  useEffect(() => {
    fetchInteractionFrequency(defaultOption);
  }, []);

  const handleDropdownChange = async (option) => {
    await fetchInteractionFrequency(option.value);
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
      <h2 className={styles.analyticTitle}>Analytics</h2>
      <Sidebar profileType={localStorage.getItem('profile_type')} />
      <div className={styles.analyticsContent}>
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
              {/* <LineChart data={[interactionFrequency[0],32,34,21,12,90,78,9,23]}> */}
              <LineChart data={interactionFrequency}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotype" dataKey="uv" stroke="#8884d8" />
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
                options={options}
                onChange={(e) => setPeakInteractionTime(dummyPeakInteractionTime)}
                value={defaultOption}
                placeholder="Select an option"
              />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={peakInteractionTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pv" fill="#8884d8" />
                <Bar dataKey="uv" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

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
        {/* Networking stats*/}
        <div className={styles.card}>
          <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
              <h3>Network Stats</h3>
            </div>
            <ul className={styles.userList}>
              <li>
                <span>
                <img src='https://placehold.co/150x150' alt='Profile'/>
                Lily Saunders
                </span>
                <span className={styles.pending} >ID #3124 • Pending</span>
              </li>
              <li>
                <span>
                <img src='https://placehold.co/150x150' alt='Profile'/>
                Lily Saunders
                </span>
                <span className={styles.paid}>ID #3124 • Paid</span>
              </li>
              <li>
                <span>
                <img src='https://placehold.co/150x150' alt='Profile'/>
                Lily Saunders
                </span>
                <span className={styles.paid}>ID #3124 • Paid</span>
              </li>
              <li>
                <span>
                <img src='https://placehold.co/150x150' alt='Profile'/>
                Lily Saunders
                </span>
                <span className={styles.pending} >ID #3124 • Pending</span>
              </li>
              <li>
                <span>
                <img src='https://placehold.co/150x150' alt='Profile'/>
                Lily Saunders
                </span>
                <span className={styles.paid}>ID #3124 • Paid</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
