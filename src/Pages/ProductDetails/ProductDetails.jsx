// src/components/ProductDetail.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../../Redux/slice/productSlice'; // Adjust the import based on your folder structure
import { useParams } from 'react-router-dom';
import { Button, Tag, Tabs } from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  BarChartOutlined,
  MailOutlined,
  CheckCircleFilled,
  TruckOutlined,
  DollarOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import { addToCart } from '../../Redux/slice/cartSlice'; // Adjust import path for your cartSlice

const ProductDetail = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const currentProduct = useSelector((state) => state.products.currentProduct);
  const loading = useSelector((state) => state.products.loading);
  const error = useSelector((state) => state.products.error);
  const transactionNumber = useSelector((state) => state.cart.transactionNumber); // Access transactionNumber

  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentProduct || !Array.isArray(currentProduct) || currentProduct.length === 0) return <div>No product found</div>;

  const product = currentProduct[0];
  const backendBaseURL = 'http://197.251.217.45:5000/';
  const imageUrl = `${backendBaseURL}/Media/Products_Images/${product.productImage.split('\\').pop()}`;

  const handleAddToCart = () => {
    const cartData = {
      transactionNumber, // Include the transaction number from the Redux store
      productId: product.productID,
      price: product.price,
      quantity: 1,
    };

    dispatch(addToCart(cartData));
  };
  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Product Image */}
        <div className="lg:w-1/2">
          <img
            src={imageUrl}
            alt={product.productName}
            style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '5px' }} // Adjust image display
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* Right Column - Product Info */}
        <div className="lg:w-1/2">
          <div className="bg-gradient-to-r from-blue-50 to-transparent p-4 rounded-lg mb-6">
            <h1 className="text-2xl font-bold mb-4">{product.productName}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Tag color="blue">{product.categoryName}</Tag>
              <Tag color="green">{product.brandName}</Tag>
              <Tag color="red">{product.showRoomName}</Tag>
            </div>
          </div>
          <div className="space-y-4 mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircleFilled className="text-green-500" />
              <span className="font-medium">Availability:</span>
              <span className="text-green-500">In Stock</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">SKU:</span>
              <span>{product.productID.slice(-6)}</span> {/* Display the last six digits of productID */}
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg inline-block mb-8">
            <span className="text-3xl font-bold">₵{product.price.toFixed(2)}</span>
            {product.oldPrice && (
              <span className="line-through text-gray-500 ml-8">₵{product.oldPrice.toFixed(2)}</span>
            )}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <TruckOutlined className="text-2xl text-red-500" />
              <div>
                <div className="font-semibold">Fast Shipping</div>
                <div className="text-sm text-gray-500">On all orders</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <DollarOutlined className="text-2xl text-red-500" />
              <div>
                <div className="font-semibold">Best Price</div>
                <div className="text-sm text-gray-500">Guaranteed</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <CustomerServiceOutlined className="text-2xl text-red-500" />
              <div>
                <div className="font-semibold">Online Support</div>
                <div className="text-sm text-gray-500">available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-8">
        <Tabs
          items={[
            {
              key: '1',
              label: 'Details',
              children: <div className="p-4">{product.description}</div>,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
