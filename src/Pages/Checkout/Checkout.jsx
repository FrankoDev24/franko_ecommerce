import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { checkOutOrder, updateOrderDelivery} from "../../Redux/slice/orderSlice";
import { clearCart } from "../../Redux/slice/cartSlice";
import { message, Card, List, Button, Checkbox , Input} from "antd";
import { CreditCardOutlined } from "@ant-design/icons";
import ShippingComponent from "../../Components/Shipping";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { GrDeliver } from "react-icons/gr";
import mobileMoney from "../../assets/download.png";
import "./Checkout.css";
import { GiTakeMyMoney } from "react-icons/gi";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false); // 
  const [loading, setLoading] = useState(false);
  const cartId = localStorage.getItem("cartId");
  const customerData = JSON.parse(localStorage.getItem("customer"));
  const customerId = customerData?.customerAccountNumber;
  const customerAccountType = customerData?.accountType;
  const [customerName, setCustomerName] = useState(customerData?.firstName + " " + customerData?.lastName || "");
  const [customerNumber, setCustomerNumber] = useState(customerData?.contactNumber || customerData?.ContactNumber || "");
  
  const [shippingFee, setShippingFee] = useState(0);

  // Load cart items from local storage
  useEffect(() => {
    setCartItems(JSON.parse(localStorage.getItem("cart")) || []);
    const storedShippingDetails = JSON.parse(localStorage.getItem("shippingDetails"));
    if (storedShippingDetails) {
      setAddress(storedShippingDetails.location);
      setShippingFee(storedShippingDetails.locationCharge);
    }
  }, []);

  const calculateTotalAmount = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.total || 0), 0);
    return subtotal + shippingFee;
  };

  const storeCheckoutDetailsInLocalStorage = (checkoutDetails, addressDetails) => {
    localStorage.setItem("checkoutDetails", JSON.stringify(checkoutDetails));
    localStorage.setItem("orderAddressDetails", JSON.stringify(addressDetails));
  };
  
  const handleCheckout = async () => {
    if (!paymentMethod) return message.warning("Please select a payment method to proceed.");
    if (!address) return message.warning("Please enter your delivery address to proceed.");
    if (paymentMethod === "Cash on Delivery" && shippingFee === 0) {
      return message.warning("Please select another payment method.");
    }
  
    setLoading(true);
    const orderId = uuidv4();
    const orderDate = new Date().toISOString();
  
    const checkoutDetails = {
      customerId,
      orderCode: orderId,
      PaymentMode: paymentMethod,
      PaymentAccountNumber: customerNumber,
      customerAccountType,
      paymentService: "Mtn",
      totalAmount: calculateTotalAmount(),
      RecipientName: customerName,
      RecipientContactNumber: customerNumber,
      orderNote: orderNote || "N/A",
      orderDate,
    };
  
    const addressDetails = {
      orderCode: orderId,
      address,
      customerid: customerId,
      recipientName: customerName,
      recipientContactNumber: customerNumber,
      orderNote: orderNote || "N/A",
      geoLocation: "N/A",
    };
  
    try {
      if (["Credit Card", "Mobile Money"].includes(paymentMethod)) {
        storeCheckoutDetailsInLocalStorage(checkoutDetails, addressDetails);
  
        const paymentUrl = await initiatePayment(calculateTotalAmount(), cartItems, orderId);
        if (paymentUrl) window.location.href = paymentUrl;
      } else {
        await dispatchOrderCheckout(orderId, checkoutDetails);
        await dispatchOrderAddress(orderId);
        message.success("Your order has been placed successfully!");
        navigate("/order-received");
      }
    } catch (error) {
      message.error(error.message || "An error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };
  
  const dispatchOrderCheckout = async (orderId, checkoutDetails) => {
    try {
      const checkoutPayload = {
        Cartid: localStorage.getItem("cartId"),
        ...checkoutDetails,
      };
  
      await dispatch(checkOutOrder(checkoutPayload)).unwrap();
    } catch (error) {
      throw new Error("An error occurred during order checkout.");
    }
  };
  
  const dispatchOrderAddress = async (orderId) => {
    try {
      const updateAddressPayload = {
        orderCode: orderId,
        address,
        customerid: customerId,
        recipientName: customerName,
        recipientContactNumber: customerNumber,
        orderNote: orderNote || "N/A",
        geoLocation: "N/A",
      };
  
      await dispatch(updateOrderDelivery(updateAddressPayload)).unwrap();
      dispatch(clearCart());
      localStorage.removeItem("cart");
      localStorage.removeItem("cartId");
    } catch (error) {
      throw new Error("An error occurred while updating the order address.");
    }
  };
  
  const initiatePayment = async (totalAmount, cartItems, orderId) => {
    const username = "RMWBWl0";
    const password = "3c42a596cd044fed81b492e74da4ae30";
    const encodedCredentials = btoa(`${username}:${password}`);
  
    const payload = {
      totalAmount,
      description: `Payment for ${cartItems.map((item) => item.productName).join(", ")}`,
      callbackUrl: "https://www.frankotrading.com/order-history",
      returnUrl: `https://www.frankotrading.com/order-success/${orderId}`,
      merchantAccountNumber: "2020892",
      cancellationUrl: "https://www.frankotrading.com/order-cancelled",
      clientReference: orderId,
    };
  
    try {
      const response = await fetch("https://payproxyapi.hubtel.com/items/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedCredentials}`,
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
      if (result.status === "Success") return result.data.checkoutUrl;
  
      throw new Error(`Payment initiation failed: ${result.message || "Unknown error"}`);
    } catch (error) {
      throw new Error("Payment initiation failed. Please try again.");
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
  <h2 className="text-xl font-bold mb-6 text-gray-800">Billing Information</h2>
  <Card bordered={false} className="shadow-lg bg-white rounded-lg p-6">
    {/* Recipient Name */}
    <div className="mb-6">
      <label htmlFor="customerName" className="block text-gray-700 font-medium mb-2">
        Recipient Name
      </label>
      <input
        type="text"
        id="customerName"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        placeholder="Enter your name"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
      />
    </div>

    {/* Contact Number */}
    <div className="mb-6">
      <label htmlFor="customerNumber" className="block text-gray-700 font-medium mb-2">
        Contact Number
      </label>
      <input
        type="text"
        id="customerNumber"
        value={customerNumber}
        onChange={(e) => setCustomerNumber(e.target.value)}
        placeholder="Enter your contact number"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
      />
    </div>

    {/* Shipping Address */}
    <div className="mb-6">
      <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
        Delivery Address
      </label>
      <div className="flex items-center gap-4">
        <input
          type="text"
          id="address"
          value={address}
          readOnly
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
        />
        <Button
          type="primary"
          onClick={handleOpenModal}
          style={{
            backgroundColor: "#3F6634",
            borderColor: "#3F6634",
            color: "white",
           
          }}
          className="py-2 px-4 rounded-lg"
        >
          {address ? "Change Delivery Address" : "Add Delivery Address"}
        </Button>
      </div>
    </div>

    {/* Additional Fields for Agents */}
    {customerAccountType === "agent" && (
      <>
        <div className="mb-6">
          <Input
            placeholder="Customer Delivery Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-6">
          <Input
            type="number"
            placeholder="Shipping Fee"
            value={shippingFee}
            onChange={(e) => setShippingFee(parseFloat(e.target.value) || 0.0)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </>
    )}

    {/* Order Note */}
    <div className="mb-6">
      <label htmlFor="orderNote" className="block text-gray-700 font-medium mb-2">
        Order Note
      </label>
      <textarea
        id="orderNote"
        value={orderNote}
        onChange={(e) => setOrderNote(e.target.value)}
        placeholder="Add any notes for the order..."
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
        rows="4"
      />
    </div>
  </Card>
</div>


      {/* Cart and Checkout Section */}
      <div className="flex-1">
        <h2 className="text-md md:text-lg font-bold mb-4 text-gray-800"> Checkout</h2>
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
          {shippingFee !== 0 && (
  <Checkbox
    checked={paymentMethod === "Cash on Delivery"}
    onChange={() => setPaymentMethod("Cash on Delivery")}
  >
    <div className="flex items-center">
      <GrDeliver style={{ color: "green", marginRight: "8px" }} />
      <span>Cash on Delivery</span>
    </div>
  </Checkbox>
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
          {customerAccountType === "agent" && (
  <div className="flex items-center mb-2">
    <Checkbox
      checked={paymentMethod === "Paid Already"}
      onChange={() => setPaymentMethod("Paid Already")}
    >
      <div className="flex items-center">
        < GiTakeMyMoney style={{ color: "green", marginRight: "8px" }}  size={20}/>
        <span>Paid Already</span>
      </div>
    </Checkbox>
  </div>
)}

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
