import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import Dropdown from 'react-dropdown';
import axios from 'axios';
import 'react-dropdown/style.css';
import styles from '../../assets/css/profiles/IndividualAnalaytics.module.css';
import Sidebar from '../sidebar/Sidebar';

const options = ['Daily', 'Weekly', 'Monthly'];
const defaultOption = options[0];

const dummyData = [
  { name: 'No Data', uv: 0, pv: 0, amt: 0 },
];

const fetchAnalyticsData = async (endpoint, setData) => {
  try {
    const response = await axios.get(endpoint, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    setData(response.data.length > 0 ? response.data : dummyData);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    setData(dummyData);
  }
};

const Analytics = () => {
  const [interactionFrequency, setInteractionFrequency] = useState([]);
  const [peakInteractionTime, setPeakInteractionTime] = useState([]);
  const [geoData, setGeoData] = useState([]);

  useEffect(() => {
    fetchAnalyticsData('/api/interaction-frequency/', setInteractionFrequency);
    fetchAnalyticsData('/api/peak-interaction-time/', setPeakInteractionTime);
    
    // Dummy data for geographic data
    const dummyGeoData = [
      { name: 'USA', interactions: 120 },
      { name: 'Germany', interactions: 85 },
      { name: 'Japan', interactions: 60 },
      { name: 'France', interactions: 55 },
      { name: 'Canada', interactions: 45 },
    ];
    setGeoData(dummyGeoData);
  }, []);

  // Function to determine the most interacted country for highlighting
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

      <Sidebar profileType="individual" />
      <div className={styles.analyticsContent}>
      {/* Interaction Frequency Chart */}
      <div className={styles.card}>
        <div className={styles.chartContainer}>
          <div className={styles.chartHeader}>
            <h3>Interaction Frequency</h3>
            <Dropdown
              options={options}
              onChange={(e) => setInteractionFrequency(e.value)}
              value={defaultOption}
              placeholder="Select an option"
            />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={interactionFrequency}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="uv" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
          {interactionFrequency === dummyData && <p>No data found</p>}
        </div>
      </div>

      {/* Peak Interactions Time Chart */}
      <div className={styles.card}>
        <div className={styles.chartContainer}>
          <div className={styles.chartHeader}>
            <h3>Peak Interactions Time</h3>
            <Dropdown
              options={options}
              onChange={(e) => setPeakInteractionTime(e.value)}
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
          {peakInteractionTime === dummyData && <p>No data found</p>}
        </div>
      </div>
      </div>

      <div className={styles.analyticsContent}>
      {/* Geographic Data */}
      <div className={styles.card}>
        <div className={styles.chartContainer}>
          <div className={styles.chartHeader}>
            <h3>Geographic Data</h3>
            {/* Dropdown for frequency options if needed */}
          </div>
          <div className={styles.geoList}>
            <ul>
              {geoData.map((country, index) => (
                <li key={index} className={country.name === mostInteractedCountry ? styles.highlighted : ''}>
                  <span>{country.name}</span>
                  <span>({country.interactions} interactions)</span>
                </li>
              ))}
              {geoData.length === 0 && <p>No geographic data found</p>}
            </ul>
          </div>
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
        <span>Lily Saunders</span>
        <span>ID #3124 • Paid</span>
      </li>
      <li>
        <span>Franklin Jackson</span>
        <span>ID #3124 • Paid</span>
      </li>
      <li>
        <span>Kyle Duncan</span>
        <span>ID #3124 • Pending</span>
      </li>
      <li>
        <span>Alta Chandler</span>
        <span>ID #3124 • Pending</span>
      </li>
      <li>
        <span>Anthony Hubbard</span>
        <span>ID #3124 • Paid</span>
      </li>
    </ul>
  </div>
</div>
      </div>

    </div>
  );
};

export default Analytics;
