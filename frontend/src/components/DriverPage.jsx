import React from 'react';
import { DriverProvider } from '../hooks/useDriver';
import DriverDashboard from './DriverDashboard';

const DriverPage = () => {
  return (
    <DriverProvider>
      <div className="driver-page">
        <div className="driver-container">
          <DriverDashboard />
        </div>
      </div>
    </DriverProvider>
  );
};

export default DriverPage;