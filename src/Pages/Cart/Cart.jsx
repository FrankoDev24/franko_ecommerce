import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getCartById, deleteCartItem, updateCartItem } from "../../Redux/slice/cartSlice";
import { Card, Spin, Alert, Button, Divider } from "antd";

const { Meta } = Card;

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { transactionNumber } = useParams();
  const cartItems = useSelector((state) => state.cart.cart);
  const loading = useSelector((state) => state.cart.loading);
  const error = useSelector((state) => state.cart.error);

  const cartId = cartItems.length > 0 ? cartItems[0].transactionNumber : null;

  useEffect(() => {
    if (transactionNumber) {
      dispatch(getCartById(transactionNumber));
    }
  }, [dispatch, transactionNumber]);

  const handleDelete = (productId) => {
    if (cartId) {
      dispatch(deleteCartItem({ cartId, productId }));
    }
  };

  const handleUpdateClick = (productId, quantity) => {
    
    if (cartId) {
      // Navigate to the update page with cartId, productId, and quantity as parameters
      navigate(`/cart/update/${cartId}/${productId}/${quantity}`);
    }
  };

  const handleProceedToCheckout = () => {
    const cartId = localStorage.getItem('transactionNumber');
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const customerAccountNumber = user.customerAccountNumber;

    if (!cartId || !customerAccountNumber) {
      alert("Missing Cart ID or Customer Account Number in local storage.");
      return;
    }

    navigate(`/checkout/${cartId}/${customerAccountNumber}`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  
  if (error)
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        className="m-4"
      />
    );

  const renderImage = (imagePath) => {
    if (!imagePath) {
      return (
        <img
          src="/path/to/placeholder/image.jpg"
          alt="Product placeholder"
          className="w-full h-32 object-cover rounded-lg"
        />
      );
    }

    const backendBaseURL = "http://197.251.217.45:5000/";
    const imageUrl = `${backendBaseURL}Media/Products_Images/${imagePath.split("\\").pop()}`;

    return (
      <img
        src={imageUrl}
        alt="Product"
        className="w-full h-32 object-cover rounded-lg"
      />
    );
  };

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-lg">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4 mb-4">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col md:flex-row items-start bg-white shadow-md p-4 rounded-lg"
              >
                <div className="w-32 md:w-32">
                  {renderImage(item.imagePath)}
                </div>
                <div className="flex flex-col md:flex-row flex-1 md:justify-between mt-4 md:mt-0 md:ml-4 space-y-2 md:space-y-0">
                  <div>
                    <h2 className="text-xl font-bold">{item.productName}</h2>
                    <p>{item.productDescription}</p>
                    <p className="font-semibold mt-2">Price: ${item.price.toFixed(2)}</p>
                    <p className="font-bold mt-2">
                      Total: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => handleUpdateClick(item.productId, item.quantity)}
                    >
                      Update Quantity
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      danger
                      size="small"
                      onClick={() => handleDelete(item.productId)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Divider />
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Total Price: ${totalPrice}</h2>
            <Button
              type="primary"
              size="large"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
