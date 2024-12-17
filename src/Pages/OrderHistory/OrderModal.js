import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalesOrderById, fetchOrderDeliveryAddress } from '../../Redux/slice/orderSlice';
import { Modal, Spin, Typography, Image, Divider, Card, Button } from 'antd';
import { UserOutlined, PhoneOutlined, HomeOutlined, EditOutlined, DownloadOutlined } from '@ant-design/icons';
import 'jspdf-autotable';
import html2pdf from 'html2pdf.js';

const { Title, Text } = Typography;



const OrderModal = ({ orderId, isModalVisible, onClose }) => {
  const dispatch = useDispatch();
  const { salesOrder, loading, error, deliveryAddress } = useSelector((state) => state.orders);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchSalesOrderById(orderId));
      dispatch(fetchOrderDeliveryAddress(orderId));
    }
  }, [dispatch, orderId]);

  const isLoading = loading && !salesOrder?.length;
  if (isLoading) return <div className="hidden"><Spin tip="Loading..." /></div>;
  if (error) return <div>Error loading order: {error.message || 'An error occurred'}</div>;
  if (!salesOrder || salesOrder.length === 0) return <div>No order details found.</div>;

  const order = salesOrder[0];
  const address = deliveryAddress?.[0] || {};
  const backendBaseURL = 'https://smfteapi.salesmate.app';
  const totalAmount = salesOrder.reduce((acc, item) => acc + item.total, 0);

  const downloadInvoice = () => {
    // Create a temporary container for the HTML content
    const element = document.createElement('div');
    
    // Add the invoice content to the element
    element.innerHTML = `
      <div style="text-align: center; padding: 20px 0;">
        <!-- Centered logo -->
        <img src='./frankoIcon.png' alt='Franko trading ltd' style="width: 80px; height: 50px; margin-bottom: 10px; text-align: center;">
        
        <!-- Company Details -->
        <div style="font-size: 14px; color: #333; line-height: 1.5;">
          <p><strong>Franko Trading Ltd.</strong></p>
          <p>123 Adabraka Street, Accra, Ghana</p>
          <p>Contact: +233 123 456 789 | Email:<a href="mailto:online@frankotrading.com">online@frankotrading.com </a></p>
        </div>
  
        <!-- Invoice Title -->
        <h2 style="font-size: 24px; margin-top: 10px; color: #4CAF50; font-weight: bold;" >Invoice</h2>
      </div>
      
      <!-- Order Details Section -->
      <div style="font-size: 12px; padding: 20px; color: #333; line-height: 1.5;">
        <p><strong>Order Code:</strong> ${order?.orderCode}</p>
        <p><strong>Order Date:</strong> ${new Date(order?.orderDate).toLocaleDateString()}</p>
        <p><strong>Recipient:</strong> ${address?.recipientName || 'N/A'}</p>
        <p><strong>Contact:</strong> ${address?.recipientContactNumber || 'N/A'}</p>
        <p><strong>Address:</strong> ${address?.address || 'N/A'}</p>
        <p><strong>Note:</strong> ${address?.orderNote || 'N/A'}</p>
      </div>
      
      <!-- Table for Order Details -->
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #4CAF50; color: white; text-align: left;">
            <th style="padding: 8px; border: 1px solid #ddd;">SN</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Product Name</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Unit Price (₵)</th>
          </tr>
        </thead>
        <tbody>
          ${salesOrder.map((item, index) => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${item.productName || 'N/A'}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity || 0}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formatPrice(item.price || 0)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    
   
      <div style="text-align: right; font-size: 16px;font-weight: bold; color: #333; line-height: 2.5;">
        Total Amount: ₵${formatPrice(salesOrder.reduce((total, item) => total + (item.price * item.quantity), 0))}
      </div>
    `;
  
    // Set up the options for html2pdf
    const options = {
      margin: 20,
      filename: `Invoice_${order?.orderCode}.pdf`,
      image: { type: 'png', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
  
    // Use html2pdf to generate the PDF
    html2pdf()
      .from(element)
      .set(options)
      .save();
  };
  
  
  // Utility function to format price correctly
  const formatPrice = (amount) => {
    return amount.toFixed(2); // Ensure 2 decimal places
  };
  

  return (
    <Modal
      title={`Order: ${order?.orderCode || 'Details'}`}
      visible={isModalVisible}
      onCancel={onClose}
      footer={[
        <div className="flex justify-between">
          <div>
        <Text strong className="text-lg">Total Amount: </Text>
        <Text strong className="text-lg text-red-500">₵{formatPrice(totalAmount)}.00</Text>
      </div>

        <Button key="download" icon={<DownloadOutlined />} onClick={downloadInvoice} className='bg-green-600 text-white'>
          Download Invoice
        </Button>
        </div>,
      ]}
      width={500}
      centered
      className="rounded-lg"
    >
      {/* Scrollable content container */}
      <div style={{ maxHeight: '500px', overflowY: 'auto', padding: '16px' }}>
        <div className="mb-4">
          <Text strong>Order Date: </Text>
          <Text>{new Date(order?.orderDate).toLocaleDateString()}</Text>
        </div>

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

       
      </div>
    </Modal>
  );
};

export default OrderModal;
