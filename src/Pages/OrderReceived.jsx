import React from 'react';
import { CheckCircleOutlined } from '@ant-design/icons'; // Check icon from Ant Design
import { useNavigate } from 'react-router-dom';

function OrderReceived() {
  const navigate = useNavigate();

  const handleViewOrders = () => {
    navigate('/order-history'); // Navigate to the orders page
  };

  const handleBackToShopping = () => {
    navigate('/'); // Navigate back to the shopping page
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-100 p-6 flex items-center justify-center">
    <div className="bg-white p-10 rounded-xl shadow-2xl w-full sm:w-3/4 md:w-2/3 lg:w-1/2 text-center">
      <CheckCircleOutlined className="text-green-500 text-6xl mb-6 mx-auto" />
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">Thank You for Your Order!</h2>
      <p className="text-lg text-gray-600 mb-6">Your order has been successfully received and is being processed.</p>
  
      <div className="space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={handleViewOrders}
          className="w-full sm:w-auto py-3 px-8 bg-green-500 text-white font-semibold rounded-lg shadow-lg transform transition duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          View Orders
        </button>
        <button
          onClick={handleBackToShopping}
          className="w-full sm:w-auto py-3 px-8 bg-white text-green-500 font-semibold rounded-lg shadow-lg border-2 border-green-500 transform transition duration-300 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Back to Shopping
        </button>
      </div>
    </div>
  </div>
  );
}

export default OrderReceived;
