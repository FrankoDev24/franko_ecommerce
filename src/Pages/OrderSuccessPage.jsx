import React from "react";
import { Button, Typography } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const OrderSuccess = ({ orderDetails }) => {
  const navigate = useNavigate();

  // Navigate to order history or continue shopping
  const handleViewOrders = () => {
    navigate("/order-history");
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center  bg-gray-100 p-4">
      <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 max-w-md">
        <CheckCircleOutlined className="text-green-500 text-6xl mb-4" />
        <Title level={2} className="text-center text-gray-800">
          Order Successful!
        </Title>
        <Text className="text-gray-600 text-center">
          Thank you for your purchase. Here are your order details:
        </Text>

  
        <div className="flex flex-col items-center sm:flex-row gap-8 mt-6 w-full ">
          <Button
            type="primary"
        
            className="w-full sm:w-auto bg-green-500 border-none hover:bg-green-600"
            onClick={handleViewOrders}
          >
            View Orders
          </Button>
          <Button
            type="default"
         
            className="w-full sm:w-auto bg-red-400 border-none hover:bg-red-500 text-white"
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
