import { useDispatch, useSelector } from 'react-redux';
import { addProduct, fetchProducts } from '../../Redux/slice/productSlice';
import { fetchBrands } from '../../Redux/slice/brandSlice';
import { fetchShowrooms } from '../../Redux/slice/showRoomSlice';
import { Modal, Form, Input, Select, Button, message, Upload, Progress, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const { Option } = Select;

const AddProduct = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [productImageFile, setProductImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const brands = useSelector((state) => state.brands.brands);
  const showrooms = useSelector((state) => state.showrooms.showrooms);

  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchShowrooms());
  }, [dispatch]);

  const onFinish = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    const productID = uuidv4();
    const UserId = 'user-uuid'; // Replace with actual user ID retrieval logic
    const dateCreated = new Date().toISOString();

    formData.append('UserId', UserId);
    formData.append('productID', productID);
    formData.append('dateCreated', dateCreated);

    if (productImageFile) {
      formData.append('productImage', productImageFile);
    } else {
      message.error('Please upload a product image');
      return;
    }

    try {
      await dispatch(addProduct(formData)).unwrap();
      message.success('Product added successfully!');
      await dispatch(fetchProducts()).unwrap();

      form.resetFields();
      setProductImageFile(null);
      setUploadProgress(0);
      setImagePreview(null);
      onClose();
    } catch (err) {
      console.error(err);
      message.error('Failed to add product.');
    }
  };

  const handleUploadChange = (info) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
    }
    if (info.file.status === 'done') {
      const { originFileObj } = info.file;
      setProductImageFile(originFileObj);
      setImagePreview(URL.createObjectURL(originFileObj));
      setUploading(false);
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (info.file.status === 'error') {
      setUploading(false);
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      setProductImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      return false;
    },
    onChange: handleUploadChange,
    showUploadList: false,
    progress: {
      onProgress: ({ percent }) => setUploadProgress(percent),
    },
  };

  return (
    <Modal
      title="Add Product"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Product Name"
              name="productName"
              rules={[{ required: true, message: 'Please input the product name!' }]}
            >
              <Input placeholder="Enter product name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: 'Please input the price!' }]}
            >
              <Input type="number" placeholder="Enter product price" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Old Price"
              name="oldPrice"
            >
              <Input type="number" placeholder="Enter old price (optional)" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Quantity"
              name="Quantity"
              rules={[{ required: true, message: 'Please input the quantity!' }]}
            >
              <Input type="number" placeholder="Enter product quantity" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input the description!' }]}
        >
          <Input.TextArea placeholder="Enter product description" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Brand"
              name="brandId"
              rules={[{ required: true, message: 'Please select a brand!' }]}
            >
              <Select placeholder="Select a brand">
                {brands.map((brand) => (
                  <Option key={brand.brandId} value={brand.brandId}>
                    {brand.brandName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Showroom"
              name="showRoomId"
              rules={[{ required: true, message: 'Please select a showroom!' }]}
            >
              <Select placeholder="Select a showroom">
                {showrooms.map((showroom) => (
                  <Option key={showroom.showRoomID} value={showroom.showRoomID}>
                    {showroom.showRoomName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Upload Image" name="productImage">
          <Upload {...uploadProps} accept="image/*">
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
          {uploading && (
            <>
              <Progress percent={uploadProgress} status="active" />
              <span>Uploading...</span>
            </>
          )}
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
            </div>
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

AddProduct.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddProduct;
