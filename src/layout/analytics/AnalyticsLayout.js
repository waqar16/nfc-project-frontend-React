import Analytics from '../../components/dashboard/Dashboard';
import { useState } from 'react';

const AnalyticsLayout = () => {
    const [analytics, setAnalytics] = useState({
        nfc: 300,
        digitalCard: 200,
        total: 500,
      });

    return (
        <div>
            <Analytics analytics={analytics} />
        </div>
    );
};

export default AnalyticsLayout;