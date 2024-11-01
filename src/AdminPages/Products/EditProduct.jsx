import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateProduct, updateProductImage } from '../../Redux/slice/productSlice';
import { Modal, Form, Input, Select, Button, message, Row, Col, Upload } from 'antd';
import PropTypes from 'prop-types';
import { UploadOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const UpdateProduct = ({ visible, onClose, product, brands, showrooms }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // State to manage the image file
  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        Productid: product.productID,
        ProductName: product.productName,
        price: product.price,
        oldPrice: product.oldPrice,
        Description: product.description,
        BrandId: product.brandId,
        ShowRoomId: product.showRoomId,
      });

      // Construct the URL for the existing product image
      const imagePath = product.productImage; // Assuming this is the field for image path
      const imageUrl = `https://api.salesmate.app//Media/Products_Images/${imagePath.split("\\").pop()}`;
      setExistingImageUrl(imageUrl); // Set the existing image URL

      setImageFile(null); // Reset image file when product changes
    }
  }, [product, form]);

  const onFinish = async (values) => {
    const payload = {
      Productid: values.Productid || product.productID,
      productName: values.ProductName,
      description: values.Description,
      price: values.price,
      oldPrice: values.oldPrice,
      brandId: values.BrandId,
      showRoomId: values.ShowRoomId,
    };
  
    // Ensure the payload has the necessary productID
    if (!payload.Productid) {
      message.error('Product ID is missing!');
      return;
    }
  
    try {
      // Dispatch update product action
      await dispatch(updateProduct(payload)).unwrap();
      message.success('Product updated successfully!');
  
      // Handle image update if an image file was selected
      if (imageFile) {
        const imagePayload = {
          Productid: payload.Productid,
          ImageName: imageFile, // Assuming the API expects the file object here
        };
  
        await dispatch(updateProductImage(imagePayload)).unwrap();
        message.success('Product image updated successfully!');
      }
  
      // Clear form and image state after update
      onClose();
      form.resetFields();
      setImageFile(null);
      setExistingImageUrl(''); // Clear the existing image display
    } catch (err) {
      console.error('Error updating product:', err);
      message.error('Failed to update product.');
    }
  };
  
  const handleImageChange = (info) => {
    if (info.file.status === 'done') {
      setImageFile(info.file.originFileObj); // Store the file object
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null); // Clear the uploaded image file
    setExistingImageUrl(''); // Clear the existing image URL
  };

  return (
    <Modal
      title="Update Product"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Hidden Product ID */}
        <Form.Item name="Productid" style={{ display: 'none' }}>
          <Input type="hidden" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Product Name"
              name="ProductName"
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
              label="Brand"
              name="BrandId"
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
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Description"
              name="Description"
              rules={[{ required: true, message: 'Please input the description!' }]}
            >
              <Input.TextArea placeholder="Enter product description" rows={3} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Showroom"
              name="ShowRoomId"
              rules={[{ required: true, message: 'Please select a showroom!' }]}
            >
              <Select placeholder="Select a showroom">
                {showrooms.map(showroom => (
                  <Option key={showroom.showRoomID} value={showroom.showRoomID}>
                    {showroom.showRoomName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Product Image">
              <Upload
                accept="image/*"
                showUploadList={false}
                onChange={handleImageChange}
              >
                <Button icon={<UploadOutlined />}>Click to upload image</Button>
              </Upload>
              {/* Display the existing image */}
              {existingImageUrl && (
                <div style={{ position: 'relative', marginTop: 10 }}>
                  <img
                    src={existingImageUrl}
                    alt="Existing Product"
                    style={{ width: '100%', height: 'auto', maxHeight: 150, objectFit: 'cover' }}
                  />
                  <CloseCircleOutlined
                    onClick={handleRemoveImage}
                    style={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                      color: 'red',
                      cursor: 'pointer',
                      zIndex: 1,
                    }}
                  />
                </div>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Update Product
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

UpdateProduct.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.object,
  brands: PropTypes.arrayOf(PropTypes.object).isRequired,
  showrooms: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default UpdateProduct;
