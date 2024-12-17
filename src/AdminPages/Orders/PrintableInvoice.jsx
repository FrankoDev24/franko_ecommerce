import React from 'react';
import { Typography, Row, Col, Image, Divider } from 'antd';
import logo from '../../assets/frankoIcon.png';

const { Title, Text } = Typography;

const formatPrice = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const PrintableInvoice = React.forwardRef(({ orderId, salesOrder, deliveryAddress }, ref) => {
  const backendBaseURL = 'https://smfteapi.salesmate.app/';
  const customer = salesOrder[0];
  const totalAmount = salesOrder.reduce((acc, order) => acc + order.total, 0);
  const subAmount = totalAmount;
  const discount = "0";
  const address = deliveryAddress?.[0] || {};

  const invoiceDate = new Date();
  const orderDate = new Date(customer?.orderDate || Date.now());

  return (
    <div
      ref={ref}
      style={{
        width: '800px',
        margin: '0 auto',
        backgroundColor: '#fff',
        padding: '20px',
        fontSize: '16px',
        lineHeight: '1.6',
      }}
    >
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Image
          src={logo}
          alt="Franko Trading Limited"
          style={{ width: '150px', marginBottom: '10px' }}
          preview={false}
        />
        <Title level={2} style={{ color: '#333', fontWeight: 'bold', margin: 0 }}>Franko Trading Limited</Title>
        <Text>123 Business Street, Accra, Ghana | Contact: +233 246 422 338</Text>
        <br />
        <Text>Email: online@frankotrading.com | Website: www.frankotrading.com</Text>
        <Divider />
      </div>
      <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Invoice</div>     

      {/* Invoice Details */}
      <Row gutter={24} style={{ marginBottom: '20px' }}>
        <Col span={12}>
          <div style={{ backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '5px' }}>
            <Text strong style={{ fontSize: '16px' }}>Invoice Details</Text>
            <br />
            <Text>Invoice Number: #{orderId.slice(-7)}</Text>
            <br />
            <Text>Order Date: {orderDate.toLocaleDateString()}</Text>
            <br />
            <Text>Invoice Date: {invoiceDate.toLocaleDateString()}</Text>
          </div>
        </Col>
      </Row>

      {/* Customer & Delivery Info */}
      <Row gutter={[16, 8]} style={{ marginBottom: '20px' }}>

  {/* Shipping Address on the Right */}
  <Col span={12} style={{ textAlign: 'left' }}>
    <div style={{ backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '5px' }}>
      <Text strong style={{ fontSize: '18px' }}>Shipping Address</Text>
      <br />
      <Text style={{ fontSize: '16px' }}>Recipient: {address.recipientName}</Text>
      <br />
      <Text style={{ fontSize: '16px' }}>Contact: {address.recipientContactNumber}</Text>
      <br />
      <Text style={{ fontSize: '16px' }}>Address: {address.address}</Text>
    </div>
  </Col>
</Row>


      <Divider />

      {/* Order Items */}
      <Title level={4} style={{ marginBottom: '10px' }}>Order Items</Title>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '16px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0', textAlign: 'left' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>SN</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Product Image</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Product Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Quantity</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Unit Price</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {salesOrder.map((order, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{index + 1}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <Image
                  src={`${backendBaseURL}/Media/Products_Images/${order?.imagePath?.split('\\').pop()}`}
                  alt="Product"
                  style={{ width: '50px', verticalAlign: 'middle' }}
                  preview={false}
                />
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order.productName}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order.quantity}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>₵{formatPrice(order.price)}.00</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>₵{formatPrice(order.total)}.00</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Divider />

      {/* Total Section */}
      <Row justify="end">
        <Col span={8}>
          <div style={{ textAlign: 'right', fontSize: '16px' }}>
            <Text>Subtotal: ₵{formatPrice(subAmount)}.00</Text>
            <br />
            <Text>Discount: ₵{formatPrice(discount)}.00</Text>
            <br />
            <Text strong style={{ fontSize: '18px' }}>Total Amount: ₵{formatPrice(totalAmount)}.00</Text>
          </div>
        </Col>
      </Row>
    </div>
  );
});

export default PrintableInvoice;
