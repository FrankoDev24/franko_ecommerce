import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import FulfillmentHome from '../FulfillmentsHome';
import FulfillmentsOrder from './FulfillmentsOrder';
import FulfillmentsDashboard from './FulfillmentsDashboard';

const FulfillmentPage = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Function to render content based on the current path
  const renderContent = () => {
    switch (currentPath) {
      case '/fulfillment/dashboard':
        return <FulfillmentsDashboard />;
      case '/fulfillment/orders':
        return <FulfillmentsOrder />;
      
      case '/fulfillment':
        return <Navigate to="/fulfillment/dashboard" />;
      default:
        return <Navigate to="/fulfillment/dashboard" />;
    }
  };

  return (
    <FulfillmentHome>
      <div style={{ padding: 5, width: '100%' }}>
        {renderContent()}
      </div>
    </FulfillmentHome>
  );
};

export default FulfillmentPage
