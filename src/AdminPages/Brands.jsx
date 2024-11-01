import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands, addBrand, updateBrand } from '../Redux/slice/brandSlice';
import { fetchCategories } from '../Redux/slice/categorySlice';
import { Button, Select, Typography, message, Spin, Modal, Form, Input } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { EditOutlined } from '@ant-design/icons'; // Import Edit icon

const { Title } = Typography;

const CreateBrand = () => {
  const dispatch = useDispatch();
  const { brands, loading: loadingBrands, error: errorBrands } = useSelector((state) => state.brands);
  const { categories, loading: loadingCategories, error: errorCategories } = useSelector((state) => state.categories);

  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchCategories());
  }, [dispatch]);

  const onFinish = (values) => {
    const brandData = isEdit
      ? { ...selectedBrand, ...values, Brandid: selectedBrand.brandId } // Use Brandid if required by API
      : { ...values, brandId: uuidv4() };

    const action = isEdit ? updateBrand : addBrand;

    dispatch(action(brandData))
      .unwrap()
      .then(() => {
        form.resetFields();
        setModalVisible(false);
        setIsEdit(false);
        setSelectedBrand(null);
        message.success(`Brand ${isEdit ? 'updated' : 'added'} successfully!`);
        dispatch(fetchBrands()); // Refresh the brands list
      })
      .catch((err) => {
        console.error("Error details:", err); // Log the error object
        const errorMessage = err?.response?.data?.message || err?.message || 'An unexpected error occurred.';
        message.error(`Error: ${errorMessage}`);
      });
  };

  const handleEditBrand = (brand) => {
    setIsEdit(true);
    setSelectedBrand(brand);
    setModalVisible(true);
    form.setFieldsValue({
      brandName: brand.brandName,
      categoryId: brand.categoryId,
    });
  };

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
            title={isEdit ? 'Edit Brand' : 'Create Brand'}
            visible={modalVisible}
            onCancel={() => {
              setModalVisible(false);
              setIsEdit(false);
              setSelectedBrand(null);
            }}
            footer={null}
            width={400}
          >
            <Form form={form} layout="vertical" onFinish={onFinish}>
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
                  {isEdit ? 'Update Brand' : 'Add Brand'}
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {brands.map((brand) => {
              // Find the category name by categoryId
              const category = categories.find(cat => cat.categoryId === brand.categoryId);

              return (
                <div key={brand.brandId} className="border p-4 rounded shadow hover:shadow-lg transition-shadow duration-200">
                  <h3 className="text-lg font-semibold">{brand.brandName}</h3>
                  <p className="text-gray-500">
                    Category: <span className="font-medium">{category ? category.categoryName : 'Unknown'}</span>
                  </p>
                  <Button type="link" icon={<EditOutlined />} onClick={() => handleEditBrand(brand)}>
                    Edit
                  </Button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default CreateBrand;
