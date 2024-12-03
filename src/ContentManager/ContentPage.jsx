import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import ContentManagerPage from './ContentHome';  // Assuming ContentManagerPage provides sidebar and layout
import ContentDashboard from './ContentManager/ContentDashboard';
import Products from './ContentManager/Products';
import Showroom from './ContentManager/Showroom';
import Brands from './ContentManager/Brands';
import Category from './ContentManager/Category';

const ContentPage = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Function to render content based on the current path
  const renderContent = () => {
    switch (currentPath) {
      case '/content/dashboard':
        return <ContentDashboard />;
      case '/content/products':
        return <Products />;
      case '/content/showroom':
        return <Showroom />;
      case '/content/brands':
        return <Brands />;
      case '/content/category':
        return <Category />;
      case '/webcontent':
        return <Navigate to="/content/dashboard" />;
      default:
        return <Navigate to="/content/dashboard" />;
    }
  };

  return (
    <ContentManagerPage>
      <div style={{ padding: 5, width: '100%' }}>
        {renderContent()}
      </div>
    </ContentManagerPage>
  );
};

export default ContentPage;
