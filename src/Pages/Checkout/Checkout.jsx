import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { checkOutOrder, orderAddress, storeLocalOrder } from "../../Redux/slice/orderSlice";
import { clearCart } from "../../Redux/slice/cartSlice";
import { message, Card, List, Button, Checkbox } from "antd";
import { CreditCardOutlined } from "@ant-design/icons";
import { GrDeliver } from "react-icons/gr";
import mobileMoney from "../../assets/download.png";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);

  const cartId = localStorage.getItem("cartId");
  const customerData = JSON.parse(localStorage.getItem("customer"));
  const customerId = customerData?.customerAccountNumber;
  const orderId = uuidv4();

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCartItems);
  }, []);

  const fetchGeoLocation = async (address) => {
    const API_KEY = "47b3126317b94cb4b1f9f9a9b0a95865"; // Replace with your OpenCage API Key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${API_KEY}`;
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

      const totalAmount = cartItems.reduce((total, item) => total + (item.total || 0), 0) + 5;

      // Dispatch actions for checkout
      await dispatch(
        checkOutOrder({
          cartId,
          customerId,
          orderId,
          address,
          paymentMethod,
        })
      ).unwrap();

      const payload = {
        customerId,
        orderCode: orderId,
        address,
        geoLocation,
      };

      await dispatch(orderAddress(payload));

      // Dispatch to store the order in the Redux reducer
      dispatch(
        storeLocalOrder({
          userId: customerId,
          orderId,
          items: cartItems,
          totalAmount,
          date: new Date().toISOString(),
        })
      );

      message.success("Your order has been placed successfully!");

      // Clear the cart
      dispatch(clearCart());
      localStorage.removeItem("cart");
      localStorage.removeItem("cartId");
      setCartItems([]);
      setLoading(false);
      navigate("/order-history");
    } catch (error) {
      message.error(error.message || "An error occurred during checkout.");
      setLoading(false);
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
    <div className="flex flex-col md:flex-row gap-8 p-4 md:p-8 bg-gray-100 min-h-screen">
      {loading && (
        <div className="flex items-center justify-center absolute inset-0 bg-gray-500 bg-opacity-75">
          <div className="animate-spin h-10 w-10 border-4 border-t-4 border-gray-300 rounded-full"></div>
        </div>
      )}

      {/* Cart Items Section */}
      <div className="flex-1">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-red-400">Cart Details</h2>
        <Card bordered={false} className="shadow-lg bg-white p-4">
          <List
            dataSource={cartItems}
            renderItem={(item) => (
              <List.Item className="p-4 border-b">
                <div className="flex items-center w-full">
                  <div className="mr-4">{renderImage(item.imagePath)}</div>
                  <div className="flex flex-col w-full">
                    <h3 className="text-sm md:text-lg font-semibold">{item.productName}</h3>
                    <span className="font-bold text-gray-500 text-md">Qty: {item.quantity}</span>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-gray-500 text-md">₵{item.price}.00</span>
                      <span className="font-bold text-green-800">₵{item.total}</span>
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
            footer={
              <div className="flex justify-between items-center text-xl font-bold mt-4 text-red-500">
                <span>Total:</span>
                <span>
                  ₵
                  {cartItems
                    .reduce((total, item) => total + (item.total || 0), 0)
                    .toFixed(2)}
                </span>
              </div>
            }
          />
        </Card>
      </div>

      {/* Checkout Section */}
      <div className="w-full md:w-1/3">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-red-400">Checkout</h2>
        <Card bordered={false} className="shadow-xl bg-white p-4">
          <div className="flex justify-between mb-4">
            <span>Subtotal:</span>
            <span>₵{cartItems.reduce((total, item) => total + (item.total || 0), 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Shipping Fee:</span>
            <span>₵5.00</span>
          </div>
          <div className="flex justify-between mb-4 text-lg font-bold">
            <span>Total:</span>
            <span>₵{(cartItems.reduce((total, item) => total + (item.total || 0), 0) + 5).toFixed(2)}</span>
          </div>

          {/* Address and Payment Method */}
          <div className="mt-4">
            <label htmlFor="address" className="block text-gray-700 mb-2">
              Shipping Address:
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your shipping address"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />

            <label className="block text-gray-700 font-semibold mb-2">
              Payment Method:
            </label>
            <div className="flex items-center mb-2">
              <Checkbox
                checked={paymentMethod === "Cash on Delivery"}
                onChange={() => setPaymentMethod("Cash on Delivery")}
              >
                <div className="flex items-center">
                  <GrDeliver style={{ color: "green", marginRight: "8px" }} />
                  <span>Cash on Delivery</span>
                </div>
              </Checkbox>
            </div>

            <div className="flex items-center mb-2">
              <Checkbox
                checked={paymentMethod === "Mobile Money"}
                onChange={() => setPaymentMethod("Mobile Money")}
              >
                <div className="flex items-center">
                  <img src={mobileMoney} alt="mobile money" style={{ width: "24px", height: "24px", marginRight: "4px" }} />
                  <span>Mobile Money</span>
                </div>
              </Checkbox>
            </div>

            <div className="flex items-center">
              <Checkbox
                checked={paymentMethod === "Credit Card"}
                onChange={() => setPaymentMethod("Credit Card")}
              >
                <div className="flex items-center">
                  <CreditCardOutlined style={{ color: "purple", marginRight: "8px" }} />
                  <span>Credit Card</span>
                </div>
              </Checkbox>
            </div>
          </div>

          <Button
            type="primary"
            loading={loading}
            className="w-full mt-4 bg-green-600 text-white hover:bg-green-800"
            onClick={handleCheckout}
          >
            Place Order
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;
