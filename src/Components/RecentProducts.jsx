import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../Redux/slice/productSlice';
import { Empty, message, Button } from 'antd';
import { ShoppingCartOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../Redux/slice/cartSlice';

const RecentProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (product) => {
    const cartData = {
      productId: product.productID,
      productName: product.productName,
      quantity: 1,
      price: product.price,
      image: product.productImage,
    };

    dispatch(addToCart(cartData))
      .unwrap()
      .then(() => {
        message.success(`${product.productName} added to cart!`);
      })
      .catch((error) => {
        message.error(
          `Failed to add ${product.productName} to cart: ${error.message}`
        );
      });
  };

  // Get the 12 most recent products
  const recentProducts = products.slice(-12);

  // Format price with commas
  const formatPrice = (price) =>
    price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-semibold mb-4 text-red-500">Recently Added</h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse p-2 md:p-3 border rounded-lg shadow-md bg-gray-50"
            >
              <div className="bg-gray-300 h-32 md:h-48 rounded-lg mb-3"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500 mt-6">
          Error fetching products
        </div>
      ) : recentProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-4">
            {recentProducts.map((product) => (
              <div
                key={product.productID}
                className="relative group p-2 md:p-3 bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => navigate(`/product/${product.productID}`)}
              >
                <div className="h-32 md:h-48 lg:h-56 flex items-center justify-center mb-3">
                  <img
                    src={`https://smfteapi.salesmate.app/Media/Products_Images/${product.productImage
                      .split("\\")
                      .pop()}`}
                    alt={product.productName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <h2 className="text-sm md:text-md  text-gray-800 truncate">
                    {product.productName}
                  </h2>
                  <div className="flex md:items-center md:flex-row flex-col md:space-x-2">
                    <span className="text-base md:text-sm font-bold text-red-500">
                      {`₵${formatPrice(product.price)}`}
                    </span>
                    {product.oldPrice > 0 && (
                      <span className="text-xs line-through text-gray-500 md:inline-block block mt-1 md:mt-0">
                        {`₵${formatPrice(product.oldPrice)}`}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  <ShoppingCartOutlined className="text-lg md:text-xl text-red-500 hover:text-red-600 transition-colors duration-200" />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center mt-10">
          <Empty
            description={
              <span>
                <strong>No Products Found</strong>
              </span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            imageStyle={{ height: 150, marginBottom: 6 }}
          />
        </div>
      )}
      <div className="flex justify-center mt-6">
        <Button
          shape="round"
          icon={<ArrowRightOutlined />}
          className="text-xs md:text-sm bg-red-500 text-white px-3 py-2 md:px-4 md:py-3"
          onClick={() => navigate('/products')}
        >
          Shop Now
        </Button>
      </div>
    </div>
  );
};

export default RecentProducts;
