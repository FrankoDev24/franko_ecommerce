import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalesOrderById } from '../../Redux/slice/orderSlice';
import { Modal, Spin, Typography, Row, Col, Image, Button } from 'antd';

const { Title, Text } = Typography;

const OrderDetailsModal = ({ orderId, onClose }) => {
  const dispatch = useDispatch();
  const { salesOrder, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchSalesOrderById(orderId));
    }
  }, [dispatch, orderId]);

  if (loading) return <Spin size="large" />; // Show loading spinner
  if (error) return <div>Error loading order: {error.message || 'An error occurred'}</div>;
  if (!salesOrder || salesOrder.length === 0) return <div>No order details found.</div>; // Handle empty or null salesOrder

  const backendBaseURL = 'https://api.salesmate.app/';

  return (
    <Modal
      title="Order Details"
      visible={true}
      footer={null}
      width={800} // Set the modal width
      onCancel={onClose} // Close modal on clicking the close icon or backdrop
    >
      <Title level={4}>Order Information</Title>
      
      {salesOrder.map((order, index) => {
        const imagePath = order?.imagePath;
        const imageUrl = imagePath ? `${backendBaseURL}/Media/Products_Images/${imagePath.split('\\').pop()}` : null;

        return (
          <div key={index} style={{ marginBottom: '24px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
            <Row gutter={16} style={{ marginTop: '16px' }}>
              <Col span={24}>
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Product"
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '5px', marginTop: '8px' }}
                    preview={false} // Disable image preview
                  />
                ) : (
                  <Text type="danger">Image not available.</Text>
                )}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>Name:</Text> <Text>{order.fullName}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Contact Number:</Text> <Text>{order.contactNumber}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Address:</Text> <Text>{order.address}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Product Name:</Text> <Text>{order.productName}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Quantity:</Text> <Text>{order.quantity}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Price:</Text> <Text>₵{order.price}.00</Text>
              </Col>
              <Col span={12}>
                <Text strong>Total:</Text> <Text>₵{order.total}.00</Text>
              </Col>
              <Col span={12}>
                <Text strong>Order Date:</Text> <Text>{new Date(order.orderDate).toLocaleDateString()}</Text>
              </Col>
            </Row>
          </div>
        );
      })}
      
      <Button onClick={onClose} style={{ marginTop: '16px' }}>
        Cancel
      </Button>
    </Modal>
  );
};

export default OrderDetailsModal;
