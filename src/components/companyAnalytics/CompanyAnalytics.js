import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import styles from '../../assets/css/profiles/CompanyAnalytics.module.css';
import Sidebar from '../sidebar/Sidebar';

const cardDistributionDummyData = [
  { name: 'Monday', distributed: 120, active: 90 },
  { name: 'Tuesday', distributed: 130, active: 95 },
  { name: 'Wednesday', distributed: 140, active: 100 },
  { name: 'Thursday', distributed: 150, active: 105 },
  { name: 'Friday', distributed: 160, active: 110 },
];

const engagementMetricsDummyData = [
  { name: 'Monday', interactionRate: 300 },
  { name: 'Tuesday', interactionRate: 400 },
  { name: 'Wednesday', interactionRate: 350 },
  { name: 'Thursday', interactionRate: 450 },
  { name: 'Friday', interactionRate: 500 },
];

const departmentComparisonDummyData = [
  { name: 'Monday', departmentA: 200, departmentB: 300 },
  { name: 'Tuesday', departmentA: 250, departmentB: 350 },
  { name: 'Wednesday', departmentA: 300, departmentB: 400 },
  { name: 'Thursday', departmentA: 350, departmentB: 450 },
  { name: 'Friday', departmentA: 400, departmentB: 500 },
];

const networkingEffectivenessDummyData = [
  {
    name: 'Lily Sanders',
    connections: 10,
    followUps: 7,
    profilePic: 'https://example.com/lily.jpg',
  },
  {
    name: 'Kyle Duncan',
    connections: 8,
    followUps: 5,
    profilePic: 'https://example.com/kyle.jpg',
  },
  {
    name: 'Aila Chandler',
    connections: 12,
    followUps: 9,
    profilePic: 'https://example.com/aila.jpg',
  },
];

const Analytics = () => {
  const [cardDistribution, setCardDistribution] = useState([]);
  const [engagementMetrics, setEngagementMetrics] = useState([]);
  const [departmentComparison, setDepartmentComparison] = useState([]);
  const [networkingEffectiveness, setNetworkingEffectiveness] = useState([]);

  useEffect(() => {
    // Set dummy data for development
    setCardDistribution(cardDistributionDummyData);
    setEngagementMetrics(engagementMetricsDummyData);
    setDepartmentComparison(departmentComparisonDummyData);
    setNetworkingEffectiveness(networkingEffectivenessDummyData);
  }, []);

  return (
    <div className={styles.analyticsContainer}>
      <Sidebar profileType="company" />

      <h2 className={styles.analyticTitle}>Analytics</h2>

        <div className={styles.analyticsContent}>

        <div className={styles.card}>

        <div className={styles.chartContainer}>
          <h3>Card Distribution Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cardDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="distributed" fill="#8884d8" />
              <Bar dataKey="active" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        </div>

        <div className={styles.card}>

        <div className={styles.chartContainer}>
          <h3>Engagement Metrics Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="interactionRate" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        </div>
        </div>

        <div className={styles.analyticsContent}>


        <div className={styles.card}>

        <div className={styles.chartContainer}>
          <h3>Department Comparison Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={departmentComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="departmentA" stroke="#8884d8" />
              <Line type="monotone" dataKey="departmentB" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        </div>

        <div className={styles.card}>

        <div className={styles.chartContainer}>
          <h3>Networking Effectiveness Stats</h3>
          <div className={styles.networkingStats}>
            {networkingEffectiveness.map((item, index) => (
              <div key={index} className={styles.statItem}>
                <img src={item.profilePic} alt={item.name} className={styles.profilePic} />
                <div className={styles.statDetails}>
                  <p>{item.name}</p>
                  <p>{item.connections} connections</p>
                  <p>{item.followUps} follow-ups</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
        </div>

      </div>
  );
};

export default Analytics;
