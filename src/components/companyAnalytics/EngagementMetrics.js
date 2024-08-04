import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import styles from '../../assets/css/profiles/IndividualAnalaytics.module.css';

const options = ['Daily', 'Weekly', 'Monthly'];
const defaultOption = options[0];

const EngagementMetricsChart = ({ interactionFrequency, onDropdownChange }) => {
  return (
    <div className={styles.card}>
      <div className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <h3>Interaction Frequency</h3>
          <Dropdown
            options={options}
            onChange={onDropdownChange}
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
  );
};

export default EngagementMetricsChart;
