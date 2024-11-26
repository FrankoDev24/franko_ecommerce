import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import AgentLayout from '../Layout/AgentLayout';  // Assuming AgentLayout provides sidebar and layout
import AgentDashboard from './AgentDashboard';
import AgentOrders from './AgentOrders';

const AgentPage = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Function to render content based on the current path
  const renderContent = () => {
    switch (currentPath) {
      case '/agent-dashboard':
        return <AgentDashboard />;
      case '/agent-dashboard/orders':
        return <AgentOrders />;
      case '/agent':
        return <Navigate to="/agent-dashboard" />;
      default:
        return <Navigate to="/agent/dashboard" />;
    }
  };

  return (
    <AgentLayout>
      <div style={{ padding: 5, width: '100%' }}>
        {renderContent()}
      </div>
    </AgentLayout>
  );
};

export default AgentPage;
