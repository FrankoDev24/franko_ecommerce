import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands, addBrand } from '../Redux/slice/brandSlice';
import { fetchCategories } from '../Redux/slice/categorySlice';
import {  Button, Select, Typography, message, Spin, Modal, Form, Input } from 'antd';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique ID generation

const { Title } = Typography;

const CreateBrand = () => {
  const dispatch = useDispatch();
  const { brands, loading: loadingBrands, error: errorBrands } = useSelector((state) => state.brands);
  const { categories, loading: loadingCategories, error: errorCategories } = useSelector((state) => state.categories);
  
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch brands and categories when the component mounts
  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchCategories());
  }, [dispatch]);
  
  // Handle form submission
  const onFinish = (values) => {
    const newBrand = { ...values, brandId: uuidv4() }; // Generate unique ID using UUID
    dispatch(addBrand(newBrand))
      .unwrap()
      .then(() => {
        form.resetFields(); // Reset the form fields after successful submission
        setModalVisible(false); // Close the modal
        message.success('Brand added successfully!');
        dispatch(fetchBrands()); // Refresh brand list after adding
      })
      .catch((err) => {
        console.error(err);
        const errorMessage = err?.response?.data?.message || err?.message || 'An unexpected error occurred.';
        message.error(`Error: ${errorMessage}`);
      });
  };

  // Prepare data for displaying categories
  const brandsWithCategoryNames = brands.map(brand => {
    const category = categories.find(cat => cat.categoryId === brand.categoryId);
    return {
      ...brand,
      categoryName: category ? category.categoryName : 'Unknown', // Fallback if category not found
    };
  });

  return (
    <div className="mx-auto">
      <Title level={2} className="text-center mb-4">Brands</Title>

      {loadingBrands || loadingCategories ? (
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {(errorBrands || errorCategories) && (
            <p className="text-red-500 text-center">{errorBrands || errorCategories}</p>
          )}

          <Button type="primary" onClick={() => setModalVisible(true)} className="mb-4">
            Add New Brand
          </Button>

          <Modal
            title="Create Brand"
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
            width={400}
          >
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Brand ID"
                name="brandId"
                hidden
              >
                <Input placeholder="Enter brand ID" disabled />
              </Form.Item>

              <Form.Item
                label="Brand Name"
                name="brandName"
                rules={[{ required: true, message: 'Please input the brand name!' }]}
              >
                <Input placeholder="Enter brand name" />
              </Form.Item>

              <Form.Item
                label="Category"
                name="categoryId"
                rules={[{ required: true, message: 'Please select a category!' }]}
              >
                <Select placeholder="Select a category">
                  {categories.map((category) => (
                    <Select.Option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
                  Add Brand
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Title level={3} className="text-center mt-6">Brand List</Title>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {brandsWithCategoryNames.map((brand) => (
              <div key={brand.brandId} className="border p-4 rounded shadow">
                <h3 className="text-lg font-semibold">{brand.brandName}</h3>
                <p className="text-gray-500">Category: {brand.categoryName}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CreateBrand;
