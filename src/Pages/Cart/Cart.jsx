import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getCartById, deleteCartItem } from "../../Redux/slice/cartSlice";
import { Alert, Button, Divider, InputNumber, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import UpdateCartModal from "./CartUpdate";
import pic from "../../assets/supermarket-shopping-cart-concept-illustration_114360-22408.png";
import { fetchProducts } from "../../Redux/slice/productSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { transactionNumber } = useParams();
  const cartItems = useSelector((state) => state.cart.cart);
  const products = useSelector((state) => state.products.products);
  const loading = useSelector((state) => state.cart.loading);
  const error = useSelector((state) => state.cart.error);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [confirmDeleteItem, setConfirmDeleteItem] = useState(null);

  useEffect(() => {
    if (transactionNumber) {
      dispatch(getCartById(transactionNumber));
    }
    dispatch(fetchProducts());
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
    setCheckoutLoading(true);
    setTimeout(() => {
      const cartId = localStorage.getItem("cart");
      const customerData = JSON.parse(localStorage.getItem("customer"));
      const customerId = customerData ? customerData.customerAccountNumber : null;

      if (cartItems.length === 0) {
        localStorage.removeItem("cart");
      }

      if (!cartId || !customerId) {
        navigate("/sign-up");
      } else {
        navigate("/checkout");
      }
      setCheckoutLoading(false);
    }, 1000);
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const renderImage = (imagePath) => {
    if (!imagePath) {
      return <img src="path/to/placeholder/image.png" alt="Placeholder" className="w-full h-full object-cover" />;
    }
    const backendBaseURL = "https://smfteapi.salesmate.app";
    const imageUrl = `${backendBaseURL}/Media/Products_Images/${imagePath.split("\\").pop()}`;
    return <img src={imageUrl} alt="Product" className="w-full h-full object-cover" />;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);


  const sortedProducts = [...products]
  .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
  .slice(0, 3); // Only take the first 4 products

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cart Items</h1>

      {loading ? (
        <div className="space-y-4">
          <div className="skeleton p-4 bg-gray-200 rounded-lg shadow animate-pulse">
            <div className="w-16 h-16 bg-gray-300 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-8">
          <p className="text-xl md:text-2xl font-bold mb-4 text-red-500">Your cart is empty.</p>
          <img src={pic} alt="Empty Cart" className="w-60 h-60 lg:w-full lg:h-96 object-contain mb-4" />
          <Button type="primary" onClick={() => navigate("/products")} className="bg-green-800 text-white hover:bg-green-600 rounded-md mt-6">
            Shop Now
          </Button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row">
          <div className="cart-items flex-1">
            {cartItems.map((item) => (
              <div key={item.productId} className="cart-item p-4 rounded-lg shadow-lg mb-4 bg-white flex items-center">
                <div className="w-16 h-16">{renderImage(item.imagePath)}</div>
                <div className="ml-4 flex-1">
                  <h2 className="text-sm lg:text-lg">{item.productName}</h2>
                  <p className="text-sm text-green-800">Price: {formatPrice(item.price)}</p>
                </div>
                <InputNumber
                  min={1}
                  defaultValue={item.quantity}
                  onChange={(value) => setSelectedQuantity(value)}
                  className="w-16"
                />
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setSelectedProductId(item.productId);
                    setIsModalVisible(true);
                  }}
                  className="text-green-800"
                />
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(item.productId)}
                  className="text-red-600"
                />
              </div>
            ))}
            <Divider style={{ borderColor: 'red' }} />

            <div className="flex justify-between items-center mt-4">
              <h2 className="text-sm lg:text-lg font-semibold text-green-800">Total Price: {formatPrice(totalPrice)}</h2>
              <Button size="large" onClick={handleProceedToCheckout} className="bg-red-400 text-white hover:bg-green-600" loading={checkoutLoading}>
                Proceed to Checkout
              </Button>
            </div>
          </div>

          {/* Recommended Products */}
          <div className="recommended-items hidden lg:block w-80 p-4 ml-4 bg-gray-50">
            <h3 className="text-lg font-bold mb-2 text-red-500">Recommended For You</h3>
            {loading ? (
              <div className="space-y-4">
                <div className="skeleton p-2 bg-gray-200 rounded-lg shadow animate-pulse">
                  <div className="w-24 h-24 bg-gray-300 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ) : (    <div className="space-y-4">
          
                {sortedProducts.map((product) => (
                  <div key={product.productID} className="recommended-item mb-4 p-2 bg-white rounded-lg shadow-lg">
                    <div className="w-48 md:w-24 lg:w-32 object-cover rounded-lg mb-2">
                      {renderImage(product.productImage)}
                    </div>
                    <p className="font-semibold text-sm lg:text-base line-clamp-1">{product.productName}</p>
                    <p className="text-red-500 text-sm">{formatPrice(product.price)}</p>
                    <Button type="link" onClick={() => handleViewProduct(product.productID)}>View</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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
        <p>Are you sure you want to remove this item from your cart?</p>
      </Modal>
    </div>
  );
};

export default Cart;
