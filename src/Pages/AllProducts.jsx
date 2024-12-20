import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../Redux/slice/productSlice';
import { Empty, message, Input, Button, Select } from 'antd';
import { ShoppingCartOutlined, FilterOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../Redux/slice/cartSlice';
import { Helmet } from 'react-helmet';

const { Option } = Select;

const ProductsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error, hasMore } = useSelector((state) => state.products);
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('newest');
  const observer = useRef();
  const itemsPerPage = 12;

  // Scroll to top when the page loads or user navigates
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch products on page load or when the page number changes
  useEffect(() => {
    dispatch(fetchProducts({ page, limit: itemsPerPage }));
  }, [dispatch, page]);

  // Filter and sort products when products, price filters, or sort option changes
  useEffect(() => {
    let sortedProducts = [...products];

    if (sortOption === 'newest') {
      sortedProducts.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
    } else if (sortOption === 'oldest') {
      sortedProducts.sort((a, b) => new Date(a.dateCreated) - new Date(b.dateCreated));
    } else if (sortOption === 'highestPrice') {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'lowestPrice') {
      sortedProducts.sort((a, b) => a.price - b.price);
    }

    const filtered = sortedProducts.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );

    setFilteredProducts(filtered);
  }, [products, minPrice, maxPrice, sortOption]);

  // Infinite scrolling logic
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

  const handleProductClick = (product) => {
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    navigate(`/product/${product.productID}`);
  };

  const formatPrice = (price) => price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Products - Franko Trading Ent.</title>
        <meta name="description" content="Browse and shop the best products at Franko Trading Ltd. Discover amazing deals and new arrivals with a variety of options to choose from." />
        <meta name="keywords" content="Franko Trading, gadgets, phones, laptops, electronics, accessories, Ghana, quality gadgets, affordable electronics" />
        <meta property="og:title" content="Products - Franko Trading ltd.  " />
        <meta property="og:description" content="Browse and shop the best products at Franko Trading Ent. Discover amazing deals and new arrivals with a variety of options to choose from." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.frankotrading.com/products" />
        <meta property="og:image" content="https://www.frankotrading.com/assets/logo.png" />
      </Helmet>

      <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-center md:text-left">All Products</h1>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Filter and Sort</h3>
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2">
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
          <Select
            value={sortOption}
            onChange={setSortOption}
            style={{ width: 200 }}
            placeholder="Sort By"
          >
            <Option value="newest">Newest</Option>
            <Option value="oldest">Oldest</Option>
            <Option value="highestPrice">Highest Price</Option>
            <Option value="lowestPrice">Lowest Price</Option>
          </Select>
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
                onClick={() => handleProductClick(product)}
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
                    loading="lazy"
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
