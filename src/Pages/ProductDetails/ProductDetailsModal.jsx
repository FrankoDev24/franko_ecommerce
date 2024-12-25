import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, fetchProducts } from "../../Redux/slice/productSlice";
import { Button, Modal, message } from "antd";
import { ShoppingCartOutlined, FacebookOutlined, WhatsAppOutlined, ShareAltOutlined } from "@ant-design/icons";
import { addToCart } from "../../Redux/slice/cartSlice";
import { Helmet } from "react-helmet";
import "./ProductDetails.css";

const formatPrice = (price) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const ProductDetailModal = ({ productId, isModalVisible, onClose }) => {
  const dispatch = useDispatch();
  const currentProduct = useSelector((state) => state.products.currentProduct);
  const cartItems = useSelector((state) => state.cart.cart);
  const cartId = useSelector((state) => state.cart.cartId);

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (isModalVisible) {
      dispatch(fetchProducts());
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId, isModalVisible]);

  const handleAddToCart = () => {
    if (!currentProduct.length) return;

    const isProductInCart = cartItems.some(
      (item) => item.productId === currentProduct[0].productID
    );

    if (isProductInCart) {
      message.warning("Product is already in the cart.");
      return;
    }

    setIsAddingToCart(true);
    const cartData = {
      cartId,
      productId: currentProduct[0].productID,
      price: currentProduct[0].price,
      quantity: 1,
    };

    dispatch(addToCart(cartData))
      .then(() => message.success("Product added to cart successfully!"))
      .catch((error) => message.error(`Failed to add product: ${error.message}`))
      .finally(() => setIsAddingToCart(false));
  };

  if (!currentProduct || !currentProduct.length) return <div>No product found</div>;

  const product = currentProduct[0];
  const backendBaseURL = "https://smfteapi.salesmate.app";
  const imageUrl = `${backendBaseURL}/Media/Products_Images/${product.productImage.split("\\").pop()}`;

  return (
    <Modal
      visible={isModalVisible}
      onCancel={onClose}
      footer={null}
      width="90%"
      centered
      bodyStyle={{
        maxHeight: "80vh",
        overflow: "auto", // Enables scrolling if necessary
        display: "flex",
        flexDirection: "column",
      }}
      className="p-4"
    >
      <Helmet>
        <meta
          name="description"
          content={`Buy ${product.productName} for ₵${formatPrice(product.price)}. Check out this amazing product for the best price!`}
        />
        <title>{product.productName} - Best Price Online</title>
      </Helmet>

      <div className="flex flex-col md:flex-row gap-6 overflow-y-auto max-h-[80vh]">
        {/* Image Section */}
        <div className="flex-1 sticky top-0">
          <img
            src={imageUrl}
            alt={product.productName}
            className="rounded-lg shadow-lg w-full h-auto object-contain max-h-[500px]"
          />
        </div>

        {/* Details Section */}
        <div className="flex-1">
          <h1 className="text-lg md:text-xl font-bold mb-4 text-gray-800">{product.productName}</h1>
          <p className="text-xl md:text-2xl font-semibold text-red-500 mb-4">
            ₵{formatPrice(product.price)}.00
          </p>
          <div className="overflow-y-auto max-h-[300px] md:max-h-[400px] p-4 text-gray-700 mb-4 custom-scrollbar">
            {product.description.split("\n").map((line, idx) => (
              <p key={idx} className="text-base md:text-md mb-2">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex justify-between items-center mt-6 sticky bottom-0 bg-white p-4 shadow-lg">
        <Button
          type="primary"
          loading={isAddingToCart}
          onClick={handleAddToCart}
          className="flex-1 mr-2 py-3 text-md flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-500 transition duration-300"
          icon={<ShoppingCartOutlined />}
        >
          Add to Cart
        </Button>
     
        <div className="flex items-center space-x-4 bg-white p-2 rounded-lg shadow-lg max-w-fit">
  {/* Share Button */}
  <div className="flex items-center space-x-2 font-medium text-lg text-gray-800">
    <ShareAltOutlined className="text-xl" />
    <span>Share</span>
  </div>

  {/* Social Media Share Buttons */}
  <div className="flex space-x-4">
    <Button
      icon={<FacebookOutlined />}
      shape="circle"
      size="large"
      className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
      onClick={() =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
          "_blank"
        )
      }
    />
    <Button
      icon={<WhatsAppOutlined />}
      shape="circle"
      size="large"
      className="bg-green-600 text-white hover:bg-green-700 transition-all duration-300"
      onClick={() =>
        window.open(
          `https://api.whatsapp.com/send?text=${window.location.href}`,
          "_blank"
        )
      }
    />
  </div>
</div>


        
      </div>
    </Modal>
  );
};

export default ProductDetailModal;
