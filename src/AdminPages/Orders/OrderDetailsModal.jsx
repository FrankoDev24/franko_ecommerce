import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalesOrderById, fetchOrderDeliveryAddress } from '../../Redux/slice/orderSlice';
import { Modal, Spin, Typography, Row, Col, Button, Divider, Card, Image } from 'antd';
import { 
  UserOutlined, 
  PhoneOutlined, 
  HomeOutlined, 
  EditOutlined 
} from '@ant-design/icons';
import PrintableInvoice from './PrintableInvoice';

const { Title, Text } = Typography;

const formatPrice = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const OrderDetailsModal = ({ orderId, onClose }) => {
  const dispatch = useDispatch();
  const { salesOrder, loading, error, deliveryAddress } = useSelector((state) => state.orders);

  const printRef = useRef(); // Ref for the hidden invoice div

  useEffect(() => {
    if (orderId) {
      dispatch(fetchSalesOrderById(orderId));
      dispatch(fetchOrderDeliveryAddress(orderId));
    }
  }, [dispatch, orderId]);

  const handlePrint = () => {
    const printContent = printRef.current;
    const newWindow = window.open('', '_blank');
    newWindow.document.write(printContent.innerHTML);
    newWindow.document.close();
    newWindow.print();
  };

  if (loading) return <Spin size="large" />;
  if (error) return <div>Error loading order: {error.message || 'An error occurred'}</div>;
  if (!salesOrder || salesOrder.length === 0) return <div>No order details found.</div>;

  const backendBaseURL = 'https://smfteapi.salesmate.app/';
  const totalAmount = salesOrder.reduce((acc, order) => acc + order.total, 0);
  const address = deliveryAddress?.[0] || {};

  return (
    <Modal
      title="Order Details"
      visible={true}
      footer={null}
      width={800}
      onCancel={onClose}
      className="rounded-lg shadow-lg"
    >
      {/* Customer Information */}
      <Title level={5} style={{color:"red"}}>Customer Information</Title>
      <Card bordered={true} className=" mb-4 p-2 shadow-md rounded-lg">
    <div>

            <Text strong><UserOutlined /> Name:</Text> <Text>{salesOrder[0]?.fullName}</Text>
          
            </div>
            <div>
            <Text strong><PhoneOutlined /> Contact Number:</Text> <Text>{salesOrder[0]?.contactNumber}</Text>
            </div>
            <div>
         
            <Text strong><HomeOutlined /> Address:</Text> <Text>{salesOrder[0]?.address}</Text>
            </div>
   
      </Card>

      {/* Delivery Address */}
      <Title level={5} style={{color:"red"}}>Delivery Address</Title>
      {address.recipientName ? (
        <Card bordered={true} className=" mb-4 p-2 shadow-md rounded-lg">
          <Text strong><UserOutlined /> Recipient Name:</Text> <Text>{address.recipientName}</Text><br />
          <Text strong><HomeOutlined /> Recipient Address:</Text> <Text>{address.address}</Text><br />
          <Text strong><PhoneOutlined /> Recipient Contact Number:</Text> <Text>{address.recipientContactNumber}</Text><br />
          <Text strong><EditOutlined /> Order Note:</Text> <Text>{address.orderNote}</Text>
        </Card>
      ) : (
        <Text className="text-gray-500">No delivery address available.</Text>
      )}

      <Divider />

      {/* Order Details */}
      <Title level={5} style={{color:"red"}}>Order Information</Title>
      {salesOrder.map((order, index) => {
        const imagePath = order?.imagePath;
        const imageUrl = imagePath 
          ? `${backendBaseURL}Media/Products_Images/${imagePath.split('\\').pop()}` 
          : null;

        return (
          <Card
            key={index}
            bordered={false}
            className="mb-4 p-6 bg-white shadow-lg rounded-lg"
          >
            <Row gutter={16} >
              <Col span={8}>
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Product"
                    className="w-full max-h-16 object-cover rounded-md"
                    preview={false}
                  />
                ) : (
                  <Text className="text-red-600">Image not available.</Text>
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
                    <Text strong> Price:</Text> <Text>₵{formatPrice(order.price)}.00</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Total:</Text> <Text>₵{formatPrice(order.total)}.00</Text>
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

      <Divider />

      {/* Total Amount */}
      <Row justify="end" className="mt-4">
        <Col>
          <Text strong>Total Amount:</Text>
          <Text className="text-xl text-red-600 ml-2">
            ₵{formatPrice(totalAmount)}.00
          </Text>
        </Col>
      </Row>

      {/* Actions */}
      <div className="mt-4 flex justify-end space-x-4">
        <Button onClick={onClose} className="text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md px-6 py-2">
          Close
        </Button>
        <Button
          onClick={handlePrint}
          className="bg-green-500 text-white hover:bg-green-600 rounded-md px-6 py-2"
        >
          Print Invoice
        </Button>
      </div>

      {/* Hidden Printable Invoice */}
      <div ref={printRef} style={{ display: 'none' }}>
        <PrintableInvoice
          orderId={orderId}
          salesOrder={salesOrder}
          deliveryAddress={deliveryAddress}
        />
      </div>
    </Modal>
  );
};

export default OrderDetailsModal;
