import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import styles from '../../assets/css/profiles/CompanyAnalytics.module.css';

const CardsDistributionBarChart = ({ employeeData }) => {
  return (
    <div className={styles.barChartContainer}>
      <h3>Cards Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={employeeData}>
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
  );
};

export default CardsDistributionBarChart;
