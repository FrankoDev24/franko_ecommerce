import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../Redux/slice/productSlice';
import { Empty, message, Input, Button } from 'antd';
import { ShoppingCartOutlined, FilterOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../Redux/slice/cartSlice';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error, hasMore } = useSelector((state) => state.products);
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const observer = useRef();
  const itemsPerPage = 12;

  useEffect(() => {
    dispatch(fetchProducts({ page, limit: itemsPerPage }));
  }, [dispatch, page]);

  useEffect(() => {
    // Sort products by `dateCreated` in descending order before filtering
    const sortedProducts = [...products].sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

    // Filter products within the price range
    const filtered = sortedProducts.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );

    setFilteredProducts(filtered);
  }, [products, minPrice, maxPrice]);

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
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-center md:text-left">All Products</h1>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Filter by Price</h3>
        <div className="flex items-center space-x-2 md:space-x-4">
          <Input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            placeholder="Min Price"
            style={{ width: 100 }}
          />
          <span className="text-gray-500">-</span>
          <Input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            placeholder="Max Price"
            style={{ width: 100 }}
          />
          <Button
            className='bg-red-500 hover:bg-green-600 text-white rounded-full'
            icon={<FilterOutlined />}
            onClick={() => {
              const filtered = products.filter(
                (product) => product.price >= minPrice && product.price <= maxPrice
              );
              setFilteredProducts(filtered);
            }}
          >
            Filter
          </Button>
        </div>
      </div>

      {error ? (
        <div className="text-center text-red-500 mt-6">Error fetching products</div>
      ) : loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="animate-pulse border rounded-lg shadow p-3 relative bg-gray-100">
              <div className="h-36 md:h-44 lg:h-52 flex items-center justify-center mb-3 bg-gray-200 rounded-lg">
                <span className="text-gray-500 text-2xl font-bold">Franko</span>
              </div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => {
            const discount = product.oldPrice > 0 ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
            return (
              <div
                ref={index === filteredProducts.length - 1 ? lastProductElementRef : null}
                key={product.productID || index}
                className="relative group p-4 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => navigate(`/product/${product.productID}`)}
              >
                {discount > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {`${discount}% OFF`}
                  </div>
                )}
                <div className="h-32 md:h-32 lg:h-48 flex items-center justify-center mb-3">
                    <img
                      src={`https://smfteapi.salesmate.app/Media/Products_Images/${product.productImage
                        .split("\\")
                        .pop()}`}
                      alt={product.productName}
                      className="w-32 md:w-24 lg:w-48 object-cover rounded-lg"
                    />
                  </div>
                <div className="flex flex-col space-y-1">
                  <h2 className="text-sm md:text-md font-semibold text-gray-800 truncate">
                    {product.productName}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm md:text-md text-red-500">
                      {`₵${formatPrice(product.price)}`}
                    </span>
                    {product.oldPrice > 0 && (
                      <span className="text-sm line-through text-gray-500">
                        {`₵${formatPrice(product.oldPrice)}`}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  shape="circle"
                  icon={<ShoppingCartOutlined />}
                  className="absolute bottom-2 right-2 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-10">
          <Empty
            description={<span><strong>No Products Found</strong></span>}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            imageStyle={{ height: 200, marginBottom: 6 }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
