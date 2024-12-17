import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Input, List, Skeleton, Empty, Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../Redux/slice/productSlice'; // Import fetchProducts action
import { useNavigate } from 'react-router-dom'; // For navigation
import { SearchOutlined } from '@ant-design/icons'; // Search icon
import { debounce } from 'lodash'; // For debouncing the search

const backendBaseURL = 'https://smfteapi.salesmate.app';

const SearchModal = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { products, loading } = useSelector((state) => state.products);

  // Fetch products once when the component mounts
  useEffect(() => {
    if (visible && products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, visible, products.length]);

  // Clear search query when modal is closed
  useEffect(() => {
    if (!visible) {
      setSearchQuery('');
    }
  }, [visible]);

  // Debounced function for updating search query
  const debounceSearch = useCallback(
    debounce((value) => setSearchQuery(value), 300),
    []
  );

  const handleSearchChange = (e) => {
    debounceSearch(e.target.value);
  };

  // Format price
  const formatPrice = (price) => `₵${price.toLocaleString()}`;

  // Filter products based on search query
  const filteredProducts = searchQuery
    ? products.filter((product) =>
        product.productName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Highlight matching text
  const highlightText = (text) => {
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    return text.replace(regex, '<span style="background-color: yellow;">$1</span>');
  };

  // Navigate to product details page and close modal
  const navigateToProduct = (productID) => {
    navigate(`/product/${productID}`); // Adjust route as needed
    onClose();
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
        onChange={handleSearchChange}
        style={{ marginBottom: '20px', borderRadius: '20px' }}
        prefix={<SearchOutlined />}
      />
      {loading ? (
        // Skeleton for loading state
        <List
          dataSource={[1, 2, 3, 4, 5]} // Dummy array to display skeletons
          renderItem={() => (
            <List.Item>
              <Skeleton avatar title={{ width: '60%' }} active />
            </List.Item>
          )}
        />
      ) : searchQuery.trim() === '' ? (
        <Empty description="Start typing to search for products" />
      ) : filteredProducts.length === 0 ? (
        <Empty description="No results found" />
      ) : (
        <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
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
                  transition: 'background-color 0.3s',
                }}
                className="hover:bg-gray-200"
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={`${backendBaseURL}/Media/Products_Images/${item.productImage
                        .split('\\')
                        .pop()}`}
                    />
                  }
                  title={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightText(item.productName || ''),
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
