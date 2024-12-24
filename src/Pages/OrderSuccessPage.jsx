import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { checkOutOrder, updateOrderDelivery } from "../Redux/slice/orderSlice";
import { clearCart } from "../Redux/slice/cartSlice";
import { message } from "antd";

import { CheckCircleOutlined } from '@ant-design/icons'; // Check icon from Ant Design

const OrderSuccessPage = () => {
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOrderCompletion = async () => {
      try {
        // Retrieve checkout and address details from localStorage
        const checkoutDetails = JSON.parse(localStorage.getItem("checkoutDetails"));
        const addressDetails = JSON.parse(localStorage.getItem("orderAddressDetails"));
  
        if (!checkoutDetails || !addressDetails) {
          message.warning("Order details are missing.");
          return;
        }
  
        if (checkoutDetails.orderCode !== orderId) {
          message.warning("Order details do not match.");
          return;
        }
  
       
  
        const checkoutPayload = {
          Cartid: localStorage.getItem("cartId"),
          customerId: checkoutDetails.customerId,
          orderCode: checkoutDetails.orderCode,
          address: checkoutDetails.address,
          PaymentMode: checkoutDetails.PaymentMode,
          PaymentAccountNumber: checkoutDetails.PaymentAccountNumber,
          customerAccountType: "Customer",
          paymentService: "Mtn",
          totalAmount: checkoutDetails.totalAmount,
        };
  
        const addressPayload = {
          customerid: addressDetails.customerid,  // Adjusted field name
          orderCode: addressDetails.orderCode,  // Adjusted field name
          address: addressDetails.address,
          recipientName: addressDetails.recipientName,  // Adjusted field name
          recipientContactNumber: addressDetails.recipientContactNumber,  // Adjusted field name
          orderNote: addressDetails.orderNote || "N/A",
          geoLocation: addressDetails.geoLocation
        };
  
        // Log payload for debugging
        console.log("Address Payload:", addressPayload);
  
        // Dispatch actions
        await dispatch(checkOutOrder(checkoutPayload)).unwrap();
        await dispatch(updateOrderDelivery(addressPayload)).unwrap();
  
        // Clear cart and checkout details
        dispatch(clearCart());
        localStorage.removeItem("checkoutDetails");
        localStorage.removeItem("orderAddressDetails");
  
        message.success("Your order has been confirmed!");
      } catch (error) {
        console.error("Error during order processing:", error);
        message.error("Failed to process your order. Please try again.");
      }
    };
  
    handleOrderCompletion();
  }, [dispatch, orderId]);
  

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-100 p-6 flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full sm:w-3/4 md:w-2/3 lg:w-1/2 text-center">
        <CheckCircleOutlined className="text-green-500 text-6xl mb-6 mx-auto" />
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Thank You for Your Order!</h2>
        <p className="text-lg text-gray-600 mb-6">Your order has been successfully received and is being processed.</p>
    
        <div className="text-left mb-6">
          <p className="text-gray-700 font-medium">Order ID: <span className="font-semibold">{orderId}</span></p>
         
        </div>

        <div className="space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => navigate('/orders')}
            className="w-full sm:w-auto py-3 px-8 bg-green-500 text-white font-semibold rounded-lg shadow-lg transform transition duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            View Orders
          </button>
          <button
            onClick={() => navigate('/shop')}
            className="w-full sm:w-auto py-3 px-8 bg-white text-green-500 font-semibold rounded-lg shadow-lg border-2 border-green-500 transform transition duration-300 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Back to Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
