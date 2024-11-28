import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { checkOutOrder, orderAddress } from "../../Redux/slice/orderSlice";
import { clearCart } from "../../Redux/slice/cartSlice";
import { message, Card, List, Button, Checkbox } from "antd";
import { CreditCardOutlined } from "@ant-design/icons";
import ShippingComponent from "../../Components/Shipping";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import {GrDeliver} from "react-icons/gr";
import mobileMoney from "../../assets/download.png";
import "./Checkout.css";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const cartId = localStorage.getItem("cartId");
  const customerData = JSON.parse(localStorage.getItem("customer"));
  const customerId = customerData?.customerAccountNumber;

  const customerAccountType = customerData?.accountType;
  const [customerName, setCustomerName] = useState(customerData?.firstName+" "+customerData?.lastName|| "");
  const [customerNumber, setCustomerNumber] = useState(customerData?.ContactNumber || "");
  const orderId = uuidv4();
  const [shippingFee, setShippingFee] = useState(0); // Shipping fee state

  // Load cart items from local storage
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCartItems);

    // Get shipping details from localStorage
    const storedShippingDetails = JSON.parse(localStorage.getItem("shippingDetails"));
    if (storedShippingDetails) {
      setAddress(storedShippingDetails.location); // Set address from shipping details
      setShippingFee(storedShippingDetails.locationCharge); // Set shipping fee from shipping details
    }
  }, []);

  // Calculate total amount including the shipping fee
  const calculateTotalAmount = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.total || 0), 0);
    return subtotal + shippingFee; // Use dynamic shipping fee from local storage
  };
  const fetchGeoLocation = async (address) => {
    const API_KEY = "47b3126317b94cb4b1f9f9a9b0a95865"; // Replace with your API Key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      address
    )}&key=${API_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        return `${lat},${lng}`;
      } else {
        throw new Error("Unable to fetch geolocation. Please check your address.");
      }
    } catch (error) {
      console.error("Geolocation Error:", error);
      message.error("Failed to fetch geolocation. Please check the address.");
      return null;
    }
  };


  const handleCheckout = async () => {
    if (!paymentMethod) {
      message.warning("Please select a payment method to proceed.");
      return;
    }

    if (!address) {
      message.warning("Please enter your delivery address to proceed.");
      return;
    }

    setLoading(true);

    try {
      const geoLocation = await fetchGeoLocation(address);
      if (!geoLocation) {
        setLoading(false);
        return;
      }

      const totalAmount = calculateTotalAmount();

      await dispatch(
        checkOutOrder({
          Cartid: cartId,
          customerId,
          orderCode: orderId,
          address,
          paymentMode: paymentMethod,
          PaymentAccountNumber: customerNumber,
          customerAccountType: customerAccountType,
          paymentService: "Mtn",
          totalAmount,
        })
      ).unwrap();

      const payload = {
        customerId,
        orderCode: orderId,
        address,
        RecipientName: customerName,
        RecipientContactNumber: customerNumber,
        orderNote,
       geoLocation
      };

      await dispatch(orderAddress(payload));

      message.success("Your order has been placed successfully!");
      dispatch(clearCart());
      localStorage.removeItem("cart");
      localStorage.removeItem("cartId");
      setCartItems([]);
      setLoading(false);

      navigate(`/order-success/${orderId}`);

    } catch (error) {
      message.error(error.message || "An error occurred during checkout.");
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);

    // Refresh shipping details after modal is closed
    const storedShippingDetails = JSON.parse(localStorage.getItem("shippingDetails"));
    if (storedShippingDetails) {
      setAddress(storedShippingDetails.location);
      setShippingFee(storedShippingDetails.locationCharge);
    }
  };


  const renderImage = (imagePath) => {
    const backendBaseURL = "https://smfteapi.salesmate.app";
    const imageUrl = `${backendBaseURL}/Media/Products_Images/${imagePath.split("\\").pop()}`;

    return (
      <img
        src={imageUrl}
        alt="Product"
        className="w-16 h-16 object-cover rounded-lg"
      />
    );
  };

  return (
    <div className="flex flex-wrap md:flex-nowrap gap-8 p-4 md:p-8 bg-gray-100 min-h-screen">
      {loading && (
        <div className="flex items-center justify-center absolute inset-0 bg-gray-500 bg-opacity-75">
          <div className="animate-spin h-10 w-10 border-4 border-t-4 border-gray-300 rounded-full"></div>
        </div>
      )}

      {/* Billing Information Section */}
      <div className="w-full md:w-1/3">
        <h2 className="text-lg font-bold mb-4 text-red-400">Billing Information</h2>
        <Card bordered={false} className="shadow-xl bg-white p-4">
          <div className="mt-4">
            <label htmlFor="customerName" className="block text-gray-700 mb-2">
              Recipient Name:
            </label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="customerNumber" className="block text-gray-700 mb-2">
              Contact Number:
            </label>
            <input
              type="text"
              id="customerNumber"
              value={customerNumber}
              onChange={(e) => setCustomerNumber(e.target.value)}
              placeholder="Enter your contact number"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="address" className="block text-gray-700 mb-2">
              Shipping Address:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="address"
                value={address}
                readOnly
                className="w-full p-2 border border-gray-300 rounded"
              />
              <Button
                type="primary"
                onClick={handleOpenModal}
                style={{ backgroundColor: "#3F6634", borderColor: "#3F6634" }}
              >
                {address ? "Change Address" : "Add Address"}
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="orderNote" className="block text-gray-700 mb-2">
              Order Note:
            </label>
            <textarea
              id="orderNote"
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="Add any notes for the order..."
              className="w-full p-2 border border-gray-300 rounded"
              rows="4"
            />
          </div>
        </Card>
      </div>

      {/* Cart and Checkout Section */}
      <div className="flex-1">
        <h2 className="text-md md:text-lg font-bold mb-4 text-red-400"> Checkout</h2>
        <Card bordered={false} className="shadow-lg bg-white p-4">
          <List
            dataSource={cartItems}
            renderItem={(item) => (
              <List.Item className="p-4 border-b">
                <div className="flex items-center w-full">
                  <div className="mr-4">{renderImage(item.imagePath)}</div>
                  <div className="flex flex-col w-full">
                    <h3 className="text-sm  font-semibold">{item.productName}</h3>
                    <span className=" text-gray-500 text-md">Qty: {item.quantity}</span>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-gray-500 text-md">₵{item.price}.00</span>
                      <span className="font-bold text-green-800">₵{item.total}</span>
                    </div>
                  </div>
                </div>
              </List.Item>
              
            )}
            
            footer={
              <div className="mt-4">
                {/* Shipping fee */}
                <div className="flex justify-between items-center text-md mb-2">
                  <span>Shipping fee:</span>
                  <span>₵{shippingFee.toFixed(2)}</span>
                </div>
            
                {/* Total */}
                <div className="flex justify-between items-center text-lg font-bold text-red-600">
                  <span>Total:</span>
                  <span>₵{calculateTotalAmount().toFixed(2)}</span>
                </div>
              </div>
            } 
          
          />

          <label className="block text-gray-700 font-semibold mb-2">
            Payment Method:
          </label>
          <div className="flex items-center mb-2">
  <Checkbox
    checked={paymentMethod === "Cash on Delivery"}
    onChange={() => setPaymentMethod("Cash on Delivery")}
    disabled={shippingFee === 0} // Disable checkbox if shipping fee is zero
  >
    <div className="flex items-center">
      <GrDeliver style={{ color: "green", marginRight: "8px" }} />
      <span>Cash on Delivery</span>
    </div>
  </Checkbox>
  {shippingFee === 0 && (
    <span className="text-red-500 ml-2">Select another payment method</span>
  )}
</div>

          <div className="flex items-center mb-2">
            <Checkbox
              checked={paymentMethod === "Mobile Money"}
              onChange={() => setPaymentMethod("Mobile Money")}
            >
              <div className="flex items-center">
                <img
                  src={mobileMoney}
                  alt="mobile money"
                  style={{ width: "24px", height: "24px", marginRight: "4px" }}
                />
                <span>Mobile Money</span>
              </div>
            </Checkbox>
          </div>
          <div className="flex items-center mb-4">
            <Checkbox
              checked={paymentMethod === "Credit Card"}
              onChange={() => setPaymentMethod("Credit Card")}
            >
              <div className="flex items-center">
                <CreditCardOutlined
                  style={{ fontSize: "20px", marginRight: "8px", color: "#34D399" }}
                />
                <span>Credit Card</span>
              </div>
            </Checkbox>
          </div>

          {/* Checkout Button */}
          <Button
         
            block
            size="large"
            onClick={handleCheckout}
            disabled={loading}
            loading={loading}
            className="bg-red-400 text-white hover:bg-red-400 rounded-full"
          >
            {loading ? "Processing..." : "Place Order"}
          </Button>
        </Card>
      </div>
      <ShippingComponent isVisible={isModalVisible} onClose={handleCloseModal} />
    </div>
  );
};

export default CheckoutPage;
