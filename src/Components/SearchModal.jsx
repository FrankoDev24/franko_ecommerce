import React, { useState } from 'react';
import { Modal, Input, List } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { searchProducts } from "../Redux/slice/productSlice";

const SearchModal = ({ isVisible, onClose }) => {
  const dispatch = useDispatch();
  const filteredProducts = useSelector((state) => state.products.filteredProducts); // Filtered products from Redux
  const [searchQuery, setSearchQuery] = useState('');

  // Handle search input change
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    dispatch(searchProducts({ query, brand: '', category: '' })); // Dispatch search action
  };

  return (
    <Modal
      title="Search Products"
      visible={isVisible}
      onCancel={onClose}
      footer={null} // Remove footer for simplicity
      width={600}   // Set modal width
    >
      <Input
        placeholder="Type product name..."
        value={searchQuery}
        onChange={handleSearch}
        style={{ marginBottom: '20px' }}
      />
      
      {filteredProducts.length > 0 ? (
        <List
          bordered
          dataSource={filteredProducts}
          renderItem={(product) => (
            <List.Item>
              <div>
                <h4>{product.name}</h4>
                <p>Brand: {product.brand}</p>
                <p>Category: {product.category}</p>
                <p>Price: ${product.price}</p>
              </div>
            </List.Item>
          )}
        />
      ) : (
        <p>No products found.</p>
      )}
    </Modal>
  );
};

export default SearchModal;
