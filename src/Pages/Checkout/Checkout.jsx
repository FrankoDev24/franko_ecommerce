import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Input, Form, message } from 'antd';
import { checkOutOrder, updateOrderDelivery } from '../../Redux/slice/orderSlice';

const CheckoutPage = () => {
  const dispatch = useDispatch();

  // Retrieve data from local storage
  const customerDetails = JSON.parse(localStorage.getItem('customerDetails')) || {};
  const cartId = localStorage.getItem('cartId');

  const [form] = Form.useForm();
  const [addressData, setAddressData] = useState({
    customerid: customerDetails.customerAccount || '',
    orderCode: '',
    address: '',
    geoLocation: '',
  });

  // Handle form submission for checkout
  const onCheckout = async () => {
    if (!addressData.customerid || !cartId) {
      return message.error("Missing customer or cart details");
    }

    try {
      // Dispatch the order address update action
      await dispatch(updateOrderDelivery(addressData.orderCode));

      // Dispatch the checkout action with cartId and customerId
      await dispatch(checkOutOrder({ cartId, customerId: addressData.customerid }));

      message.success("Checkout successful!");
    } catch (error) {
      message.error("Checkout failed. Please try again.");
    }
  };

  // Update form fields state
  const handleInputChange = (e) => {
    setAddressData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 bg-gray-100 min-h-screen">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Checkout</h2>

        <div className="border p-4 rounded-md mb-6">
          <h3 className="font-semibold text-lg mb-2">Items in Cart</h3>
          {/* Display items in cart here */}
          <p>Sample item 1 - $20.00</p>
          <p>Sample item 2 - $15.00</p>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={addressData}
          onFinish={onCheckout}
        >
          <Form.Item label="Customer ID">
            <Input
              value={addressData.customerid}
              name="customerid"
              disabled
            />
          </Form.Item>

          <Form.Item
            label="Order Code"
            name="orderCode"
            rules={[{ required: true, message: 'Order code is required' }]}
          >
            <Input
              value={addressData.orderCode}
              name="orderCode"
              onChange={handleInputChange}
            />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please enter your address' }]}
          >
            <Input
              value={addressData.address}
              name="address"
              onChange={handleInputChange}
            />
          </Form.Item>

          <Form.Item
            label="Geo Location"
            name="geoLocation"
            rules={[{ required: true, message: 'Please enter geo location' }]}
          >
            <Input
              value={addressData.geoLocation}
              name="geoLocation"
              onChange={handleInputChange}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            className="mt-4"
          >
            Confirm and Checkout
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CheckoutPage;
