import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import OverviewCard from './OverviewCard';
import styles from '../../assets/css/profiles/CompanyAnalytics.module.css';

const CardStatusPieChart = ({ activeCount, inactiveCount }) => {
  const data = [
    { name: 'Active', value: activeCount },
    { name: 'Inactive', value: inactiveCount },
  ];

  const COLORS = ['#82ca9d', '#8884d8'];

  return (
    <div className={styles.pieChartContainer}>
      <h3>Card Status</h3>
      <OverviewCard totalCards="88" />

      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="value"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

    </div>
  );
};

export default CardStatusPieChart;
