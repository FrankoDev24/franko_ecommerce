import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalesOrderById, fetchOrderDeliveryAddress } from '../../Redux/slice/orderSlice';
import { Modal, Spin, Typography, Image, Divider, Card } from 'antd';
import { UserOutlined, PhoneOutlined, HomeOutlined , EditOutlined} from '@ant-design/icons';

const { Title, Text } = Typography;

const formatPrice = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const OrderModal = ({ orderId, isModalVisible, onClose }) => {
  const dispatch = useDispatch();
  const { salesOrder, loading, error, deliveryAddress } = useSelector((state) => state.orders);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchSalesOrderById(orderId));
      dispatch(fetchOrderDeliveryAddress(orderId)); // Fetch delivery address by orderId
    }
  }, [dispatch, orderId]);

  // Loading, Error, and No Orders checks
  if (loading) return <Spin size="large" />;
  if (error) return <div>Error loading order: {error.message || 'An error occurred'}</div>;
  if (!salesOrder || salesOrder.length === 0) return <div>No order details found.</div>;

  // Assuming the first element of salesOrder contains the delivery address
  const order = salesOrder[0]; // First order in the list
  const address = deliveryAddress?.[0] || {}; // Use deliveryAddress from Redux state

  const backendBaseURL = 'https://smfteapi.salesmate.app';
  const totalAmount = salesOrder.reduce((acc, item) => acc + item.total, 0);

  return (
    <Modal
      title={`Order: ${order?.orderCode || 'Details'}`}
      visible={isModalVisible}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
      className="rounded-lg"
    >
      {/* Order Date at the top */}
      <div className="mb-4">
        <Text strong>Order Date: </Text>
        <Text>{new Date(order?.orderDate).toLocaleDateString()}</Text>
      </div>

      {/* Delivery Address Section */}
      {address ? (
        <Card className="mb-4 text-gray-800 shadow-md">
          <Title level={5} className="text-sm font-medium">Delivery Address</Title>
          <div className="space-y-2">
            <div><Text strong><UserOutlined /> Recipient:</Text> <Text>{address?.recipientName}</Text></div>
            <div><Text strong><PhoneOutlined /> Contact:</Text> <Text>{address?.recipientContactNumber}</Text></div>
            <div><Text strong><HomeOutlined /> Address:</Text> <Text>{address?.address}</Text></div>
            <div><Text strong> <EditOutlined /> Note:</Text> <Text>{address?.orderNote}</Text></div>
          </div>
        </Card>
      ) : (
        <Text>No delivery address available.</Text>
      )}

      <Divider />

      {/* Order Items */}
      {salesOrder.map((item, index) => {
        const imagePath = item?.imagePath;
        const imageUrl = imagePath ? `${backendBaseURL}/Media/Products_Images/${imagePath.split('\\').pop()}` : null;

        return (
          <div key={index} className="flex items-center space-x-4 mb-4">
            <div className="flex-shrink-0">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Product"
                  className="w-16 max-h-16 object-cover rounded-md"
                  preview={false}
                />
              ) : (
                <Text type="danger">Image not available.</Text>
              )}
            </div>
            <div className="flex-1">
              <div><Text strong>Product Name:</Text> <Text>{item?.productName || 'N/A'}</Text></div>
              <div><Text strong>Quantity:</Text> <Text>{item?.quantity || 0}</Text></div>
              <div><Text strong>Price:</Text> <Text>₵{formatPrice(item?.price || 0)}.00</Text></div>
            </div>
          </div>
        );
      })}

      <Divider />

      <div className="flex justify-end mt-4">
        <div>
          <Text strong className="text-lg">Total Amount: </Text>
          <Text strong className="text-lg text-red-500">₵{formatPrice(totalAmount)}.00</Text>
        </div>
      </div>
    </Modal>
  );
};

export default OrderModal;
