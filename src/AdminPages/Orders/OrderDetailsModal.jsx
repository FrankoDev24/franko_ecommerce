/* eslint-disable react/prop-types */
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
  if (error) return <div>Error loading order: {error}</div>;
  if (!salesOrder || salesOrder.length === 0) return <div>No order details found.</div>;

  // Construct the image URL
  const backendBaseURL = 'http://197.251.217.45:5000/'; // Replace with your actual backend URL
  const imageUrl = `${backendBaseURL}/Media/Products_Images/${salesOrder[0]?.imagePath.split('\\').pop()}`;

  return (
    <Modal
      title="Order Details"
      visible={true}
      footer={null}
      width={600} // Set the modal width
      onCancel={onClose} // Close modal on clicking the close icon or backdrop
    >
      <Title level={4}>Order Information</Title>
      <Row style={{ marginTop: '16px' }}>
        <Col span={24}>
          <Image
            src={imageUrl}
            alt="Product"
            style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '5px', marginTop: '8px' }}
            preview={false} // Disable image preview
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Text strong>Name:</Text> <Text>{salesOrder[0]?.fullName}</Text>
        </Col>
        <Col span={12}>
          <Text strong>Contact Number:</Text> <Text>{salesOrder[0]?.contactNumber}</Text>
        </Col>
        <Col span={12}>
          <Text strong>Address:</Text> <Text>{salesOrder[0]?.address}</Text>
        </Col>
        <Col span={12}>
          <Text strong>Product Name:</Text> <Text>{salesOrder[0]?.productName}</Text>
        </Col>
        <Col span={12}>
          <Text strong>Quantity:</Text> <Text>{salesOrder[0]?.quantity}</Text>
        </Col>
        <Col span={12}>
          <Text strong>Price:</Text> <Text>₵{salesOrder[0]?.price}.00</Text>
        </Col>
        <Col span={12}>
          <Text strong>Total:</Text> <Text>₵{salesOrder[0]?.total}.00</Text>
        </Col>
        <Col span={12}>
          <Text strong>Order Date:</Text> <Text>{salesOrder[0]?.orderDate}</Text>
        </Col>
      </Row>
      <Button onClick={onClose} style={{ marginTop: '16px' }}>
        Cancel
      </Button>
    </Modal>
  );
};

export default OrderDetailsModal;
