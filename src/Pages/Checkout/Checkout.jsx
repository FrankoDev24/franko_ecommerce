import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { checkOutOrder, orderAddress } from '../../Redux/slice/orderSlice';
import { notification, Card, List, Button, Checkbox } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [geoLocation, setGeoLocation] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(''); // New state for payment method

  const cartId = localStorage.getItem('cartId');
  const customerData = JSON.parse(localStorage.getItem('customer'));
  const customerId = customerData?.customerAccountNumber;
  const orderId = uuidv4();

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCartItems);
  }, []);

  const handleCheckout = async () => {
    if (!paymentMethod) {
      notification.warning({
        message: 'Select Payment Method',
        description: 'Please select a payment method to proceed.',
      });
      return;
    }

    try {
      const orderResponse = await dispatch(checkOutOrder({ cartId, customerId, orderId })).unwrap();

      if (orderResponse) {
        await dispatch(orderAddress({
          customerId,
          orderCode: orderId,
          address,
          geoLocation,
          paymentMethod,
        })).unwrap();

        notification.success({
          message: 'Checkout Successful',
          description: 'Your order has been placed successfully!',
        });

        // Clear the cart and redirect to the home page
        localStorage.removeItem('cart');
        setCartItems([]);
        navigate('/franko');
      }
    } catch (error) {
      notification.error({
        message: 'Checkout Failed',
        description: error.message || 'An error occurred during checkout.',
      });
    }
  };

  const renderImage = (imagePath) => {
    const backendBaseURL = 'https://api.salesmate.app';
    const imageUrl = `${backendBaseURL}/Media/Products_Images/${imagePath.split('\\').pop()}`;
    
    return (
      <img
        src={imageUrl}
        alt="Product"
        className="w-20 h-20 object-cover rounded-lg"
      />
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 bg-gray-100 min-h-screen">
      {/* Cart Summary Section */}
      <div className="flex-1">
        <Card
          title="Cart Summary"
          bordered={false}
          className="shadow-lg bg-white"
        
          headStyle={{ fontSize: '1.5rem', fontWeight: 'bold', background: '#f5f5f5', padding: '0.5rem 1rem' }}
        >
          <List
            dataSource={cartItems}
            renderItem={(item) => (
              <List.Item className="p-4 border-b">
                <div className="flex items-center w-full">
                  <div className="mr-4">{renderImage(item.imagePath)}</div>
                  <div className="flex flex-col w-full">
                    <h3 className="font-semibold text-lg">{item.productName}</h3>
                    <span className="text-gray-500">Quantity: {item.quantity}</span>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-semibold text-base">₵{item.price.toLocaleString()}</span>
                      <span className="font-bold text-xl text-green-600">₵{item.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
            footer={
              <div className="flex justify-between items-center text-lg font-bold px-4 py-2 bg-gray-200 rounded-md mt-4 text-red-500">
                <span>Total:</span>
                <span>₵{cartItems.reduce((total, item) => total + (item.total || 0), 0).toLocaleString()}</span>
              </div>
            }
          />
        </Card>
      </div>

      {/* Checkout Form Section */}
      <div className="flex-1">
        <Card
          title="Checkout"
          bordered={false}
          className="shadow-lg bg-white"
        >
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700">Delivery Address:</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your delivery address"
              required
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="geoLocation" className="block text-gray-700">Geo Location:</label>
            <input
              type="text"
              id="geoLocation"
              value={geoLocation}
              onChange={(e) => setGeoLocation(e.target.value)}
              placeholder="Enter your geo location (latitude, longitude)"
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>

          {/* Payment Method Section */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Payment Method:</label>
            <Checkbox
              checked={paymentMethod === 'Mobile'}
              onChange={() => setPaymentMethod('Mobile')}
              className="mb-2"
            >
              Pay by Mobile
            </Checkbox>
            <Checkbox
              checked={paymentMethod === 'Cash'}
              onChange={() => setPaymentMethod('Cash')}
            >
              Cash on Delivery
            </Checkbox>
          </div>

          <Button
            type="primary"
            onClick={handleCheckout}
            className="w-full mt-4 py-2 text-lg font-semibold"
          >
            Confirm Checkout
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;
