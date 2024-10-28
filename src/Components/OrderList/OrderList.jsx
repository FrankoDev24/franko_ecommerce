import React, { useState } from 'react';

const OrderList = () => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const orders = [
    {
      id: '384553946',
      image: '/api/placeholder/80/80',
      title: 'Universal Broadband 4G Router + Backup Battery',
      status: 'DELIVERED',
      date: '08-05',
      color: 'White with Black Box',
      price: '$129.99',
      quantity: 1,
      shippingAddress: '123 Main St, New York, NY 10001',
      trackingNumber: 'TN123456789',
      paymentMethod: 'Credit Card (**** 1234)',
      orderDate: '2024-02-15',
      estimatedDelivery: '2024-02-20'
    },
    {
      id: '344298832',
      image: '/api/placeholder/80/80',
      title: 'Earbuds Bluetooth Headsets Sports Headset',
      status: 'IN_TRANSIT',
      date: '20-02-2024',
      price: '$49.99',
      quantity: 2,
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
      trackingNumber: 'TN987654321',
      paymentMethod: 'PayPal',
      orderDate: '2024-02-18',
      estimatedDelivery: '2024-02-25'
    },
  ];

  const OrderModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="border-b p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Order Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Product Section */}
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                <img
                  src={order.image}
                  alt={order.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-lg">{order.title}</h3>
                <p className="text-gray-600">Order #{order.id}</p>
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded-md text-sm ${
                    order.status === 'DELIVERED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700">Price Details</h4>
                  <p className="text-gray-600">Price: {order.price}</p>
                  <p className="text-gray-600">Quantity: {order.quantity}</p>
                  <p className="text-gray-600 font-medium">
                    Total: ${(parseFloat(order.price.replace('$', '')) * order.quantity).toFixed(2)}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Payment Information</h4>
                  <p className="text-gray-600">Method: {order.paymentMethod}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700">Shipping Details</h4>
                  <p className="text-gray-600">Address:</p>
                  <p className="text-gray-600">{order.shippingAddress}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Tracking Information</h4>
                  <p className="text-gray-600">Number: {order.trackingNumber}</p>
                  <p className="text-gray-600">Order Date: {order.orderDate}</p>
                  <p className="text-gray-600">Estimated Delivery: {order.estimatedDelivery}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t p-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`py-2 px-4 relative ${
              activeTab === 'ongoing'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ONGOING/DELIVERED
            <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded-full text-sm">
              4
            </span>
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`py-2 px-4 relative ${
              activeTab === 'cancelled'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            CANCELLED/RETURNED
            <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded-full text-sm">
              10
            </span>
          </button>
        </div>
      </div>

      {/* Order List */}
      {activeTab === 'ongoing' && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4"
            >
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Product Image */}
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <img
                    src={order.image}
                    alt={order.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Order Details */}
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row justify-between gap-2">
                    <h3 className="font-medium text-lg">{order.title}</h3>
                    <button 
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsModalOpen(true);
                      }}
                      className="text-orange-500 whitespace-nowrap hover:text-orange-600"
                    >
                      SEE DETAILS
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-500 mt-1">
                    Order {order.id}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span 
                      className={`px-2 py-1 rounded-md text-sm ${
                        order.status === 'DELIVERED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      On {order.date}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'cancelled' && (
        <div className="text-center text-gray-500 py-8">
          No cancelled or returned orders
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <OrderModal
          order={selectedOrder}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default OrderList;