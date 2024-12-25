import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../Redux/slice/productSlice';
import { Empty, Button, Card } from 'antd';
import { ShoppingCartOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const RecentProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading } = useSelector((state) => state.products);

  // Local state to persist products
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    // Check if recent products are already stored in the local state
    if (!recentProducts.length) {
      const fetchData = async () => {
        const result = await dispatch(fetchProducts());
        if (result.payload && result.payload.length) {
          // Cache the products in local state
          setRecentProducts(result.payload.slice(-12));
        }
      };
      fetchData();
    }
  }, [dispatch, recentProducts.length]);

  const formatPrice = (price) =>
    price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="flex space-x-2 text-sm mb-4 font-medium text-white bg-green-700 py-2 px-2 rounded-md gap-3">
        <ShoppingOutlined /> Featured Products
      </h1>

      {loading && !recentProducts.length ? (
        <div className="container mx-auto p-4 mt-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse border rounded-lg shadow p-3 relative bg-gray-100"
              >
                <div className="h-32 md:h-32 lg:h-32 flex items-center justify-center mb-3 bg-gray-200 rounded-lg"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      ) : recentProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recentProducts.map((product) => {
            const discount =
              product.oldPrice > 0
                ? Math.round(
                    ((product.oldPrice - product.price) / product.oldPrice) * 100
                  )
                : 0;

            return (
              <Card
                key={product.productID}
                hoverable
                className="rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-lg w-full group"
                cover={
                  <div
                    onClick={() => navigate(`/product/${product.productID}`)}
                    className="cursor-pointer relative"
                  >
                    {discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1">
                        {`${discount}% OFF`}
                      </div>
                    )}
                    <div className="h-32 md:h-32 lg:h-48 flex items-center justify-center mb-3">
                      <img
                        src={`https://smfteapi.salesmate.app/Media/Products_Images/${product.productImage
                          .split('\\')
                          .pop()}`}
                        alt={product.productName}
                        className="w-32 md:w-24 lg:w-48 object-cover rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  </div>
                }
              >
                <Card.Meta
                  title={
                    <p className="font-semibold text-xs sm:text-sm truncate">
                      {product.productName}
                    </p>
                  }
                  description={
                    <div className="mt-1">
                      <p className="text-red-500 font-bold text-xs sm:text-sm">
                        {`₵${formatPrice(product.price)}`}
                      </p>
                      {product.oldPrice > 0 && (
                        <p className="text-gray-500 text-xs line-through sm:inline-block md:flex">
                          {`₵${formatPrice(product.oldPrice)}`}
                        </p>
                      )}
                    </div>
                  }
                />
                <Button
                  shape="circle"
                  icon={<ShoppingCartOutlined />}
                  className="absolute bottom-2 right-2 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </Card>
            );
          })}
        </div>
      ) : (
        <Empty description="No products available" />
      )}

      <div className="flex justify-center mt-6">
        <Button
          type="primary"
          onClick={() => navigate('/products')}
          className="bg-red-500 text-white hover:bg-red-600"
          icon={<ShoppingCartOutlined />}
        >
          Visit Shop
        </Button>
      </div>
    </div>
  );
};

export default RecentProducts;
