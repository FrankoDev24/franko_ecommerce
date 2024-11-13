import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, fetchProductsByBrand } from "../../Redux/slice/productSlice"; // Add the fetchProductsByBrand action
import { useParams } from "react-router-dom";
import { Button, Tabs, Modal } from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  BarChartOutlined,
  MailOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { addToCart } from "../../Redux/slice/cartSlice";

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const ProductDetail = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const currentProduct = useSelector((state) => state.products.currentProduct);
  const relatedProducts = useSelector((state) => state.products.relatedProducts); // Selector for related products
  const loading = useSelector((state) => state.products.loading);
  const error = useSelector((state) => state.products.error);
  const cartId = useSelector((state) => state.cart.cartId);

  const [isImageModalVisible, setImageModalVisible] = useState(false);

  useEffect(() => {
    // Fetch product details and related products when productId changes
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]); // Only depend on productId

  useEffect(() => {
    if (currentProduct && currentProduct.length > 0) {
      const brand = currentProduct[0].brand;
      dispatch(fetchProductsByBrand(brand)); // Fetch products by brand
    }
  }, [currentProduct, dispatch]);
  
  // Log the relatedProducts to check the data
  useEffect(() => {
    console.log("Related Products:", relatedProducts);
  }, [relatedProducts]);
  

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="skeleton h-80 bg-gray-300 rounded-md" />
          <div className="space-y-4">
            <div className="skeleton h-8 bg-gray-300 rounded-md" />
            <div className="skeleton h-6 bg-gray-300 rounded-md" />
            <div className="skeleton h-12 bg-gray-300 rounded-md" />
            <div className="skeleton h-10 bg-gray-300 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;
  if (
    !currentProduct ||
    !Array.isArray(currentProduct) ||
    currentProduct.length === 0
  )
    return <div>No product found</div>;

  const product = currentProduct[0];
  const backendBaseURL = "https://smfteapi.salesmate.app";
  const imageUrl = `${backendBaseURL}/Media/Products_Images/${product.productImage
    .split("\\")
    .pop()}`;

  const handleAddToCart = () => {
    const cartData = {
      cartId,
      productId: product.productID,
      price: product.price,
      quantity: 1,
    };

    dispatch(addToCart(cartData));
  };

  // Split description into paragraphs
  const productDescription = product.description
    .split("\n")
    .map((text, index) => (
      <p key={index} className="mb-4">
        {text}
      </p>
    ));

  // Render related products
  const renderRelatedProducts = () => {
    if (!relatedProducts || relatedProducts.length === 0) return null;
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Other products from {product.brand}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {relatedProducts.map((relatedProduct) => (
            <div key={relatedProduct.productID} className="bg-white p-4 rounded-lg shadow-sm">
              <img
                src={`${backendBaseURL}/Media/Products_Images/${relatedProduct.productImage.split("\\").pop()}`}
                alt={relatedProduct.productName}
                className="w-full h-48 object-cover mb-4 rounded-md"
              />
              <h3 className="font-semibold">{relatedProduct.productName}</h3>
              <p className="text-gray-500">{formatPrice(relatedProduct.price)}</p>
              <Button
                icon={<ShoppingCartOutlined />}
                size="small"
                className="bg-red-400 hover:bg-green-600 text-white mt-2"
                onClick={() => handleAddToCart(relatedProduct)}
              >
                Add to Cart
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Product Image */}
        <div className="lg:w-1/2">
          <img
            src={imageUrl}
            alt={product.productName}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
              borderRadius: "5px",
            }} // Set fixed height
            className="rounded-lg shadow-lg cursor-pointer"
            onClick={() => setImageModalVisible(true)} // Show modal on click
          />
        </div>

        {/* Right Column - Product Info */}
        <div className="lg:w-1/2">
          <div className="bg-gradient-to-r from-green-500 to-transparent p-4 rounded-lg mb-2">
            <h1 className="text-xl font-bold mb-4">{product.productName}</h1>
          </div>
          <div className="bg-red-100 p-4 rounded-lg inline-block mb-2">
            <span className="text-2xl font-bold">
              ₵{formatPrice(product.price)}.00
            </span>
            {product.oldPrice > 0 && (
              <span className="line-through text-gray-500 ml-8">
                ₵{formatPrice(product.oldPrice)}.00
              </span>
            )}
          </div>
          <div className="space-y-4 mb-2 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircleFilled className="text-green-500" />
              <span className="font-medium">Availability:</span>
              <span className="text-green-500">In Stock</span>
            </div>
          </div>

          <div className="mt-1">
            <Tabs
              items={[
                {
                  key: "1",
                  label: <span style={{ color: "red" }}>Product Details</span>, // Set the label to red
                  children: (
                    <div
                      className="p-4"
                      style={{ maxHeight: "250px", overflowY: "auto" }}
                    >
                      {productDescription}
                    </div>
                  ),
                },
              ]}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Button
              icon={<ShoppingCartOutlined />}
              size="large"
              className="bg-red-400 hover:bg-green-600 text-white"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button
              icon={<HeartOutlined />}
              size="large"
              className="hover:text-red-500 hover:border-red-500"
            />
            <Button
              icon={<BarChartOutlined />}
              size="large"
              className="hover:text-blue-500 hover:border-blue-500"
            />
            <Button
              icon={<MailOutlined />}
              size="large"
              className="hover:text-purple-500 hover:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Modal
        title={product.productName}
        visible={isImageModalVisible}
        onCancel={() => setImageModalVisible(false)}
        footer={null}
      >
        <img
          src={imageUrl}
          alt={product.productName}
          style={{ width: "100%", height: "100%", objectFit: "contain" }} // Large view
        />
      </Modal>

      {/* Render related products */}
      {renderRelatedProducts()}
    </div>
  );
};

export default ProductDetail;
