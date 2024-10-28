import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import AdminLayout from '../Layout/Layout';  // Assuming AdminLayout provides sidebar and layout
import Dashboard from './Dashboard';
import Brands from './Brands';
import Categories from './Categories';
import Products from './Products/Products';
import Orders from './Orders/Orders';
import ShowRoom from './ShowRoom';
import Users from './Users';
import Customers from './Customers';
import { setupSocketListeners } from '../services/socketService'; // Make sure this path is correct

const AdminPage = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [messages, setMessages] = useState([]); // State to store received messages

  // Function to render content based on the current path
  const renderContent = () => {
    switch (currentPath) {
      case '/admin/dashboard':
        return <Dashboard />;
      case '/admin/brands':
        return <Brands />;
      case '/admin/categories':
        return <Categories />;
      case '/admin/products':
        return <Products />;
      case '/admin/orders':
        return <Orders />;
      case '/admin/showroom':
        return <ShowRoom />;
      case '/admin/users':
        return <Users />;
      case '/admin/customers':
        return <Customers />;
      case '/admin':
        return <Navigate to="/admin/dashboard" />;
      default:
        return <Navigate to="/admin/dashboard" />;
    }
  };

  useEffect(() => {
    // Set up WebSocket listeners when the component mounts
    const handleIncomingMessage = (data) => {
      console.log('Incoming message:', data);
      setMessages((prevMessages) => [...prevMessages, data]); // Update state with the new message
    };

    // Set up the socket listeners
    setupSocketListeners(handleIncomingMessage);

    // Clean up function to remove listeners if necessary
    return () => {
      // Optionally, you can disconnect the socket here
      // disconnectSocket();
    };
  }, []);

  return (
    <AdminLayout>
      <div style={{ padding: 16, width: '100%' }}>
        {renderContent()}
      </div>
      <div>
   
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{JSON.stringify(msg)}</li> // Display messages as JSON strings
          ))}
        </ul>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;
