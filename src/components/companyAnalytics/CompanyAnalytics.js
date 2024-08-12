import React, { useState, useEffect } from 'react';
import CardStatusPieChart from './CardStatusPieChart';
import EngagementMetricsChart from './EngagementMetrics';
import styles from '../../assets/css/profiles/IndividualAnalaytics.module.css';
import Sidebar from '../sidebar/Sidebar';
import axios from 'axios';
import Map from '../Map/Map';

const Analytics = () => {
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [interactionFrequency, setInteractionFrequency] = useState([]);

  const options = ['Daily', 'Weekly', 'Monthly'];
const defaultOption = options[0];

  const fetchInteractionFrequency = async (frequency) => {
    try {
      const response = await axios.get(`  http://54.84.254.221/api/interaction-frequency/${frequency.toLowerCase()}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('authToken')}`,
        },
      });
      const formattedData = response.data.map(item => ({
        Period: item.period,
        Count: item.count,
      }));
      setInteractionFrequency(formattedData);
    } catch (error) {
      console.error('Error fetching interaction frequency:', error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchInteractionFrequency(defaultOption);
    // Dummy data for development
    setActiveCount(800); // Example value
    setInactiveCount(200); // Example value
  }, []);

  const handleDropdownChange = async (option) => {
    await fetchInteractionFrequency(option.value);
  };

  return (
    <div className={styles.analyticsContainer}>
      <Sidebar profileType={localStorage.getItem('profile_type')} />

      <h2 className={styles.analyticTitle}>Analytics</h2>
      <div className={styles.analyticsContent}>
      <div className={styles.card}>
          <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
              <h3>Geographic Data</h3>
            </div>
            <Map />
          </div>
        </div>
        </div>
      <div className={styles.analyticsContent}>
        {/* <CardStatusPieChart activeCount={activeCount} inactiveCount={inactiveCount} /> */}
        <EngagementMetricsChart
          interactionFrequency={interactionFrequency}
          onDropdownChange={handleDropdownChange}
        />
      </div>
    </div>
  );
};

export default Analytics;
