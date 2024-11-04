import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getCartById, deleteCartItem } from "../../Redux/slice/cartSlice";
import { Alert, Button, Divider, InputNumber, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'; 
import UpdateCartModal from "./CartUpdate";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { transactionNumber } = useParams();
  const cartItems = useSelector((state) => state.cart.cart);
  const loading = useSelector((state) => state.cart.loading);
  const error = useSelector((state) => state.cart.error);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [confirmDeleteItem, setConfirmDeleteItem] = useState(null);

  useEffect(() => {
    if (transactionNumber) {
      dispatch(getCartById(transactionNumber));
    }
  }, [dispatch, transactionNumber]);

  const refreshCartItems = () => {
    if (transactionNumber) {
      dispatch(getCartById(transactionNumber));
    }
  };

  const handleDelete = (productId) => {
    setConfirmDeleteItem(productId);
  };

  const confirmDelete = () => {
    if (confirmDeleteItem) {
      dispatch(deleteCartItem({ cartId: transactionNumber, productId: confirmDeleteItem }));
      setConfirmDeleteItem(null);
    }
  };

  const handleProceedToCheckout = () => {
    // If the cart is empty after checkout, clear the cartId from local storage
    if (cartItems.length === 0) {
      localStorage.removeItem('cartId'); // Adjust the key if different
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
        <div className="space-y-4 mb-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="flex flex-col md:flex-row items-start bg-gray-100 p-4 rounded-lg animate-pulse">
              <div className="w-32 md:w-32 bg-gray-200 h-32 rounded"></div>
              <div className="flex flex-col md:flex-row flex-1 md:justify-between mt-4 md:mt-0 md:ml-4 space-y-2 md:space-y-0">
                <div className="flex-1 space-y-2">
                  <div className="bg-gray-200 h-6 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/3"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/4"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-gray-200 h-10 rounded w-24"></div>
                  <div className="bg-gray-200 h-10 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert message="Error" description={error} type="error" showIcon className="m-4" />
    );
  }

  const renderImage = (imagePath) => {
    if (!imagePath) {
      return <img src="path/to/placeholder/image.png" alt="Placeholder" className="w-full h-full object-cover" />;
    }
    
    const backendBaseURL = 'https://api.salesmate.app';
    const imageUrl = `${backendBaseURL}/Media/Products_Images/${imagePath.split('\\').pop()}`;
    
    return <img src={imageUrl} alt="Product" className="w-full h-full object-cover" />;
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-lg">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4 mb-4">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex flex-col md:flex-row items-start bg-white shadow-md p-4 rounded-lg">
                <div className="w-full md:w-32">{renderImage(item.imagePath)}</div>
                <div className="flex flex-col md:flex-row flex-1 md:justify-between mt-4 md:mt-0 md:ml-4 space-y-2 md:space-y-0">
                  <div>
                    <h2 className="text-xl font-bold">{item.productName}</h2>
              
                    <p className="font-semibold mt-2">Price: ${item.price.toFixed(2)}</p>
                    <p className="font-bold mt-2">Total: ${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      onChange={(value) => setSelectedQuantity(value)}
                      className="w-24"
                    />
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => {
                        setSelectedProductId(item.productId);
                        setIsModalVisible(true);
                      }}
                      icon={<EditOutlined />}
                      className="bg-green-800 text-white"
                    >
                      Update
                    </Button>
                    <Button
                      danger
                      size="small"
                      onClick={() => handleDelete(item.productId)}
                      icon={<DeleteOutlined />}
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
            <Button type="primary" size="large" onClick={handleProceedToCheckout}>
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
        onUpdate={refreshCartItems}
      />
      <Modal
        title="Confirm Deletion"
        visible={confirmDeleteItem !== null}
        onOk={confirmDelete}
        onCancel={() => setConfirmDeleteItem(null)}
      >
        <p>Are you sure you want to delete this item from your cart?</p>
      </Modal>
    </div>
  );
};

export default Cart;
