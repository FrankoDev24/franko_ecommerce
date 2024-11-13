import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../Redux/slice/productSlice';
import { Empty, message } from 'antd';
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../Redux/slice/cartSlice';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error, hasMore } = useSelector((state) => state.products);
  const [page, setPage] = useState(1);
  const observer = useRef();

  const itemsPerPage = 12;

  useEffect(() => {
    dispatch(fetchProducts({ page, limit: itemsPerPage }));
  }, [dispatch, page]);

  const lastProductElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

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
        message.error(`Failed to add ${product.productName} to cart: ${error.message}`);
      });
  };

  const formatPrice = (price) => price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <div className="container mx-auto p-2 md:p-4">
      <h1 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">Products</h1>

      {error ? (
        <div className="text-center text-red-500 mt-6">Error fetching products</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-4">
          {products.map((product, index) => {
            const productCard = (
              <div
                className="relative group p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-transform duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => navigate(`/product/${product.productID}`)}
              >
                <div className="h-24 md:h-36 flex items-center justify-center mb-2">
                  <img
                    loading="lazy"
                    src={`https://smfteapi.salesmate.app/Media/Products_Images/${product.productImage.split("\\").pop()}`}
                    alt={product.productName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <h2 className="text-xs md:text-sm font-semibold text-gray-800 truncate">
                    {product.productName}
                  </h2>
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <span className="text-xs md:text-sm font-bold text-gray-900">
                      {`₵${formatPrice(product.price)}`}
                    </span>
                    {product.oldPrice > 0 && (
                      <span className="text-xs line-through text-gray-500">
                        {`₵${formatPrice(product.oldPrice)}`}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  <ShoppingCartOutlined className="text-sm md:text-base text-red-500 hover:text-red-600 transition-colors duration-200" />
                </div>
              </div>
            );

            if (products.length === index + 1) {
              return (
                <div ref={lastProductElementRef} key={product.productID}>
                  {productCard}
                </div>
              );
            } else {
              return <div key={product.productID}>{productCard}</div>;
            }
          })}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-4 mt-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse p-2 border rounded-lg shadow-sm bg-gray-50"
            >
              <div className="bg-gray-300 h-24 md:h-36 rounded-lg mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-10">
          <Empty
            description={<span><strong>No Products Found</strong></span>}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            imageStyle={{ height: 150, marginBottom: 6 }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
