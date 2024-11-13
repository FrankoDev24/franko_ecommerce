import React, { useState, useEffect } from 'react';
import { Modal, Input, List, Spin, Empty, Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../Redux/slice/productSlice';  // Import fetchProducts from the slice
import { useNavigate } from 'react-router-dom';  // Import useNavigate to navigate
import { SearchOutlined } from '@ant-design/icons';  // Import icons for better UX

const backendBaseURL = 'https://smfteapi.salesmate.app';

const SearchModal = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook to handle navigation
  const [searchQuery, setSearchQuery] = useState('');
  const { products, loading } = useSelector((state) => state.products);

  // Clear the search query when modal is closed
  useEffect(() => {
    if (!visible) {
      setSearchQuery('');
    }
  }, [visible]);

  // Only fetch products once the modal is visible and the search query is not empty
  useEffect(() => {
    if (visible && searchQuery.trim() !== '') {
      dispatch(fetchProducts());
    }
  }, [dispatch, visible, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Format price to include commas and Cedi currency
  const formatPrice = (price) => {
    return `₵${price.toLocaleString()}`;
  };

  // Filter the products based on the search query
  const filteredProducts = products.filter((product) => {
    const productName = product.productName ? product.productName.toLowerCase() : '';
    const searchTerm = searchQuery.toLowerCase();

    return productName.includes(searchTerm);
  });

  // Highlight the matching search text within product names
  const highlightText = (text) => {
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    return text.replace(regex, '<span style="background-color: yellow;">$1</span>');
  };

  // Navigate to product details page and close modal
  const navigateToProduct = (productID) => {
    navigate(`/product/${productID}`);  // Adjust route as needed
    onClose();  // Close the modal when a product is clicked
  };

  // Handle Infinite Scroll
  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && filteredProducts.length < products.length) {
      dispatch(fetchProducts()); // Fetch more products when reaching the bottom
    }
  };

  return (
    <Modal
      title="Search for Products"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Input
        placeholder="Search for a product"
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ marginBottom: '20px', borderRadius: '20px' }}
        prefix={<SearchOutlined />} // Search icon
      />
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin tip="Loading..." />
        </div>
      ) : searchQuery.trim() === '' ? (
        // Do not show any products if search query is empty
        <Empty description="Start typing to search for products" />
      ) : filteredProducts.length === 0 ? (
        <Empty description="No results found" />
      ) : (
        <div
          style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}
          onScroll={handleScroll}
        >
          <List
            dataSource={filteredProducts}
            renderItem={(item) => (
              <List.Item
                key={item.productID}
                onClick={() => navigateToProduct(item.productID)}
                style={{
                  borderBottom: '1px solid #e8e8e8',
                  padding: '10px 0',
                  backgroundColor: '#ffffff',
                  borderRadius: '5px',
                  marginBottom: '10px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s', // Smooth hover effect
                }}
                className="hover:bg-gray-200" // Hover effect
              >
                <List.Item.Meta
                  avatar={<Avatar src={`${backendBaseURL}/Media/Products_Images/${item.productImage.split('\\').pop()}`} />}
                  title={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightText(item.productName),
                      }}
                      style={{ color: '#006838', fontWeight: 'bold' }}
                    />
                  }
                  description={
                    <span style={{ color: '#D72638' }}>
                      Price: {formatPrice(item.price)}.00
                    </span>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      )}
    </Modal>
  );
};

export default SearchModal;
