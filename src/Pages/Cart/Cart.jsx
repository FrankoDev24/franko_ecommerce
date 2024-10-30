import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getCartById, deleteCartItem } from "../../Redux/slice/cartSlice";
import { Spin, Alert, Button, Divider, InputNumber } from "antd";
import UpdateCartModal from "./CartUpdate"; // Import the modal
const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { transactionNumber } = useParams();
  const cartItems = useSelector((state) => state.cart.cart);
  const loading = useSelector((state) => state.cart.loading);
  const error = useSelector((state) => state.cart.error);

  // State to hold the modal visibility and selected product details
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    if (transactionNumber) {
      dispatch(getCartById(transactionNumber));
    }
  }, [dispatch, transactionNumber]);

  // Function to refresh the cart items after an update
  const refreshCartItems = () => {
    if (transactionNumber) {
      dispatch(getCartById(transactionNumber));
    }
  };
  // Handle delete action
  const handleDelete = (productId) => {
    // Retrieve cartId from local storage
    const cartId = localStorage.getItem('transactionNumber');

    if (cartId) {
      // Dispatch the delete action with the retrieved cartId and productId
      dispatch(deleteCartItem({ cartId, productId }));
    } else {
      console.error("No cartId found in local storage.");
      // Optionally, handle the case where cartId is not available (e.g., show an alert)
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        className="m-4"
      />
    );
  }

  const renderImage = (imagePath) => {
    // Check if imagePath is valid
    if (!imagePath) {
      // Return a placeholder or nothing if imagePath is not available
      return <img src="path/to/placeholder/image.png" alt="Placeholder" className="w-full h-full object-cover" />;
    }

    const backendBaseURL = 'https://api.salesmate.app';
    const imageUrl = `${backendBaseURL}/Media/Products_Images/${imagePath.split('\\').pop()}`;

    return <img src={imageUrl} alt="Product" className="w-full h-full object-cover" />;
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
                      <InputNumber
                        min={1}
                        value={item.quantity}
                        onChange={(value) => setSelectedQuantity(value)} // Update the state for modal
                        className="w-24"
                      />
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                          setSelectedProductId(item.productId);
                          setIsModalVisible(true); // Show modal on button click
                        }}
                      >
                        Update
                      </Button>
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
        <UpdateCartModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          productId={selectedProductId}
          currentQuantity={selectedQuantity}
          onUpdate={refreshCartItems} // Pass the refresh function
        />
      </div>
    );
  };
  
  export default Cart;