import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../Redux/slice/productSlice';
import { Empty, Input, Button, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import ProductDetailModal from './ProductDetails/ProductDetailsModal';

const { Option } = Select;

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, loading, hasMore } = useSelector((state) => state.products);
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [sortOption, setSortOption] = useState('newest');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const observer = useRef();
  const itemsPerPage = 12;

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchProducts({ page, limit: itemsPerPage }));
  }, [dispatch, page]);

  const handleSortAndFilter = useCallback(() => {
    let sortedProducts = [...products];

    // Sorting Logic
    sortedProducts.sort((a, b) => {
      if (sortOption === 'newest') return new Date(b.dateCreated) - new Date(a.dateCreated);
      if (sortOption === 'oldest') return new Date(a.dateCreated) - new Date(b.dateCreated);
      if (sortOption === 'highestPrice') return b.price - a.price;
      return a.price - b.price;
    });

    // Filtering by Price
    return sortedProducts.filter((product) => product.price >= minPrice && product.price <= maxPrice);
  }, [products, sortOption, minPrice, maxPrice]);

  const filteredProducts = handleSortAndFilter();

  const lastProductElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedProductId(null);
    setIsModalVisible(false);
  };

  const formatPrice = (price) => price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Helmet>
        <title>Products - Franko Trading Ent.</title>
        <meta name="description" content="Browse and shop the best products at Franko Trading Ltd." />
      </Helmet>

      <h1 className="text-md md:text-lg font-semibold mb-4 text-center md:text-left text-red-600">All Products</h1>

      {/* Filter and Sort Section */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-green-600">Filter and Sort</h3>
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
              className="bg-red-500 hover:bg-green-600 text-white rounded-full"
              icon={<FilterOutlined />}
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

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse border rounded-lg shadow p-3 bg-gray-100 relative"
            >
              <div
                className="absolute inset-0 bg-center bg-no-repeat opacity-10"
                style={{
                  backgroundImage: "url('./frankoIcon.png')",
                  backgroundSize: "90px",
                  backgroundPosition: "center center",
                }}
              ></div>
              <div className="h-36 bg-gray-200 rounded-lg"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mt-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              ref={index === filteredProducts.length - 1 ? lastProductElementRef : null}
              key={product.productID || index}
              className="p-4 bg-white border rounded-lg shadow hover:shadow-xl transform hover:scale-105 transition-transform cursor-pointer"
              onClick={() => handleProductClick(product.productID)}
            >
              <div className="h-32 md:h-32 lg:h-48 flex items-center justify-center mb-3">
                <img
                  src={`https://smfteapi.salesmate.app/Media/Products_Images/${product.productImage.split('\\').pop()}`}
                  alt={product.productName}
                  className="w-fit h-full p-1 object-cover rounded-lg opacity-0 transition-opacity duration-500"
                  onLoad={(e) => (e.target.style.opacity = 1)}
                  loading="lazy"
                />
              </div>
              <h2 className="text-sm md:text-md font-semibold truncate">{product.productName}</h2>
              <span className="text-sm md:text-md text-red-500">{`₵${formatPrice(product.price)}`}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center mt-10">
          <Empty description={<strong>No Products Found</strong>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      )}

      {selectedProductId && (
        <ProductDetailModal
          productId={selectedProductId}
          isModalVisible={isModalVisible}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default ProductsPage;
