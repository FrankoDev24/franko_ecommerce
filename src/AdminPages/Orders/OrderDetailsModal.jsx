import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalesOrderById } from '../../Redux/slice/orderSlice';
import { Modal, Spin, Typography, Row, Col, Image, Button, Divider, Card } from 'antd';

const { Title, Text } = Typography;

const OrderDetailsModal = ({ orderId, onClose }) => {
  const dispatch = useDispatch();
  const { salesOrder, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchSalesOrderById(orderId));
    }
  }, [dispatch, orderId]);

  if (loading) return <Spin size="large" />;
  if (error) return <div>Error loading order: {error.message || 'An error occurred'}</div>;
  if (!salesOrder || salesOrder.length === 0) return <div>No order details found.</div>;

  const backendBaseURL = 'https://api.salesmate.app/';

  // Retrieve common customer details from the first order item
  const customer = salesOrder[0];

  return (
    <Modal
      title="Order Details"
      visible={true}
      footer={null}
      width={800}
      onCancel={onClose}
    >
      {/* Customer Information */}
      <Title level={4} style={{ marginBottom: '16px' }}>Customer Information</Title>
      <Card bordered={false} style={{ backgroundColor: '#fafafa', marginBottom: '16px', padding: '16px' }}>
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <Text strong>Name:</Text> <Text>{customer.fullName}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Contact Number:</Text> <Text>{customer.contactNumber}</Text>
          </Col>
          <Col span={24}>
            <Text strong>Address:</Text> <Text>{customer.address}</Text>
          </Col>
        </Row>
      </Card>

      <Divider />

      {/* Order Details */}
      <Title level={4} style={{ marginBottom: '16px' }}>Order Information</Title>
      {salesOrder.map((order, index) => {
        const imagePath = order?.imagePath;
        const imageUrl = imagePath ? `${backendBaseURL}/Media/Products_Images/${imagePath.split('\\').pop()}` : null;

        return (
          <Card
            key={index}
            bordered={false}
            style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#f9f9f9' }}
          >
            <Row gutter={16} align="middle">
              <Col span={8}>
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Product"
                    style={{ width: '70%', maxHeight: '100px', objectFit: 'cover', borderRadius: '5px' }}
                    preview={false}
                  />
                ) : (
                  <Text type="danger">Image not available.</Text>
                )}
              </Col>
              <Col span={16}>
                <Row gutter={[16, 8]}>
                  <Col span={24}>
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
              </Col>
            </Row>
          </Card>
        );
      })}

      <Button onClick={onClose} style={{ marginTop: '16px' }}>
        Cancel
      </Button>
    </Modal>
  );
};

export default OrderDetailsModal;
