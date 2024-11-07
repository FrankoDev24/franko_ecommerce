import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { checkOutOrder, orderAddress } from "../../Redux/slice/orderSlice";
import { clearCart } from "../../Redux/slice/cartSlice";
import { notification, Card, List, Button, Checkbox, Modal } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const cartId = localStorage.getItem("cartId");
  const customerData = JSON.parse(localStorage.getItem("customer"));
  const customerId = customerData?.customerAccountNumber;
  const orderId = uuidv4();

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCartItems);
  }, []);

  const handleCheckout = async () => {
    if (!paymentMethod) {
      notification.warning({
        message: "Select Payment Method",
        description: "Please select a payment method to proceed.",
      });
      return;
    }

    if (!address) {
      notification.warning({
        message: "Address Required",
        description: "Please enter your delivery address to proceed.",
      });
      return;
    }

    setLoading(true); // Start loading

    try {
      await dispatch(
        checkOutOrder({
          cartId,
          customerId,
          orderId,
          address,
          paymentMethod,
        })
      ).unwrap();
      dispatch(
        orderAddress({
          address,
          customerId,
          OrderCode: orderId,
        })
      );

      notification.success({
        message: "Checkout Successful",
        description: "Your order has been placed successfully!",
      });

      dispatch(clearCart());
      localStorage.removeItem("cart");
      localStorage.removeItem("cartId");

      setCartItems([]);
      setSuccessModalVisible(true); // Show success modal
    } catch (error) {
      notification.error({
        message: "Checkout Failed",
        description: error.message || "An error occurred during checkout.",
      });
    } finally {
      setLoading(false); // Stop loading
      navigate("/franko");
    }
  };

  const renderImage = (imagePath) => {
    const backendBaseURL = "https://api.salesmate.app";
    const imageUrl = `${backendBaseURL}/Media/Products_Images/${imagePath.split("\\").pop()}`;

    return (
      <img
        src={imageUrl}
        alt="Product"
        className="w-20 h-20 object-cover rounded-lg"
      />
    );
  };

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false);
    navigate("/franko");
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 bg-gray-100 min-h-screen">
      {loading && (
        <div className="flex items-center justify-center absolute inset-0 bg-gray-500 bg-opacity-75">
          <div className="animate-spin h-10 w-10 border-4 border-t-4 border-gray-300 rounded-full"></div>
        </div>
      )}
      {/* Cart Summary Section */}
      <div className="flex-1">
        <Card
          title="Cart Summary"
          bordered={false}
          className="shadow-lg bg-white"
          headStyle={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            background: "#006838",
            color: "#fff",
            padding: "0.5rem 1rem",
          }}
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
                      <span className="font-semibold text-base">
                        ₵{item.price.toLocaleString()}
                      </span>
                      <span className="font-bold text-xl text-green-600">
                        ₵{item.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
            footer={
              <div className="flex justify-between items-center text-lg font-bold px-4 py-2 bg-gray-200 rounded-md mt-4 text-red-500">
                <span>Total:</span>
                <span>
                  ₵
                  {cartItems
                    .reduce((total, item) => total + (item.total || 0), 0)
                    .toLocaleString()}
                </span>
              </div>
            }
          />
        </Card>
      </div>

      {/* Checkout Form Section */}
      <div className="flex-1">
        <Card title="Checkout" bordered={false} className="shadow-lg bg-white">
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700">
              Delivery Address:
            </label>
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

          {/* Payment Method Section */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Payment Method:
            </label>
            <Checkbox
              checked={paymentMethod === "Mobile"}
              onChange={() => setPaymentMethod("Mobile")}
              className="mb-2"
            >
              Pay by Mobile
            </Checkbox>
            <Checkbox
              checked={paymentMethod === "Cash"}
              onChange={() => setPaymentMethod("Cash")}
            >
              Cash on Delivery
            </Checkbox>
          </div>

          <Button
       
            onClick={handleCheckout}
            
            className="w-full mt-4 py-2 text-lg font-semibold bg-green-800 text-white hover:bg-green-700"
          >
            Confirm Checkout
          </Button>
        </Card>
      </div>

      {/* Success Modal */}
      <Modal
        title="Order Successful"
        visible={successModalVisible}
        onOk={handleSuccessModalClose}
        onCancel={handleSuccessModalClose}
        okText="Go to Home"
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <p>Your order has been placed successfully!</p>
      </Modal>
    </div>
  );
};

export default CheckoutPage;
