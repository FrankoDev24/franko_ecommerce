import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalesOrderById } from '../../Redux/slice/orderSlice';
import { Modal, Spin, Typography, Row, Col, Image, Button, Divider, Card } from 'antd';
import { UserOutlined, PhoneOutlined, HomeOutlined, DollarCircleOutlined, CalendarOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Function to format price with commas
const formatPrice = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

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
  const customer = salesOrder[0];
  const totalAmount = salesOrder.reduce((acc, order) => acc + order.total, 0); // Calculate total amount

  return (
    <Modal
      title="Order Details"
      visible={true}
      footer={null}
      width={800}
      onCancel={onClose}
  
    >
      {/* Customer Information */}
      <Title level={4} style={{ marginBottom: '16px', color: 'red' }}>Customer Information</Title>
      <Card bordered={false} style={{ backgroundColor: '#e6f7ff', marginBottom: '16px', padding: '16px' }}>
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <Text strong className=' font-medium'><UserOutlined /> Name:</Text> <Text>{customer.fullName}</Text>
          </Col>
          <Col span={12}>
            <Text strong><PhoneOutlined /> Contact Number:</Text> <Text>{customer.contactNumber}</Text>
          </Col>
          <Col span={24}>
            <Text strong><HomeOutlined /> Address:</Text> <Text>{customer.address}</Text>
          </Col>
        </Row>
      </Card>

      <Divider />

      {/* Order Details */}
      <Title level={4} style={{ marginBottom: '16px', color: 'red' }}>Order Information</Title>
      {salesOrder.map((order, index) => {
        const imagePath = order?.imagePath;
        const imageUrl = imagePath ? `${backendBaseURL}/Media/Products_Images/${imagePath.split('\\').pop()}` : null;

        return (
          <Card
            key={index}
            bordered={false}
            style={{ 
              marginBottom: '16px', 
              padding: '16px', 
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
              transition: 'transform 0.2s', 
            }}
            hoverable
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <Row gutter={16} align="middle">
              <Col span={8}>
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Product"
                    style={{ width: '100%', maxHeight: '100px', objectFit: 'cover', borderRadius: '5px' }}
                    preview={false}
                  />
                ) : (
                  <Text type="danger">Image not available.</Text>
                )}
              </Col>
              <Col span={16}>
                <Row gutter={[16, 8]}>
                  <Col span={24}>
                    <Text strong><ShoppingCartOutlined /> Product Name:</Text> <Text>{order.productName}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Quantity:</Text> <Text>{order.quantity}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong><DollarCircleOutlined /> Price:</Text> <Text>₵{formatPrice(order.price)}.00</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Total:</Text> <Text>₵{formatPrice(order.total)}.00</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong><CalendarOutlined /> Order Date:</Text> <Text>{new Date(order.orderDate).toLocaleDateString()}</Text>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        );
      })}

      <Divider />
      {/* Total Amount Section */}
      <Row justify="end" style={{ marginTop: '16px' }}>
        <Col>
          <Text strong style={{ fontSize: '18px' }}>Total Amount: </Text>
          <Text strong style={{ fontSize: '18px', color: '#ff4d4f' }}>₵{formatPrice(totalAmount)}.00</Text>
        </Col>
      </Row>

      <Button 
        onClick={onClose} 
        style={{ marginTop: '16px', backgroundColor: 'green', color: '#fff', border: 'none', borderRadius: '5px' }}
        shape="round"
      >
        Cancel
      </Button>
    </Modal>
  );
};

export default OrderDetailsModal;
