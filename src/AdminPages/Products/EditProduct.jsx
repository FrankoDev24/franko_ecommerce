import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateProduct } from '../../Redux/slice/productSlice';
import { Modal, Form, Input, Select, Button, Upload, message, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const { Option } = Select;

const UpdateProduct = ({ visible, onClose, product, brands, showrooms }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null); // State to manage the image file

  useEffect(() => {
    console.log("Product data:", product); // Log the product to verify its structure
    if (product) {
      form.setFieldsValue({
        Productid: product.productID, // Ensure this is set correctly
        ProductName: product.productName,
        price: product.price,
        oldPrice: product.oldPrice,
        Description: product.description,
        BrandId: product.brandId,
        ShowRoomId: product.showRoomId,
      });
    }
  }, [product, form]);
  
  const onFinish = (values) => {
    console.log("Form values:", values); // Log form values for debugging
    
    // Construct the payload without the image
    const payload = {
      Productid: values.Productid || product.productID, // Ensure Productid is set correctly
      productName: values.ProductName,
      description: values.Description,
      price: values.price,
      oldPrice: values.oldPrice,
      brandId: values.BrandId,
      showRoomId: values.ShowRoomId,
    };
  
    // Log the payload for verification
    console.log("Payload before dispatch:", payload); // Check the payload
  
    // Check for missing required fields
    const missingFields = Object.entries(payload).filter(([, value]) => !value);
    if (missingFields.length > 0) {
      message.error(`Please complete all required fields: ${missingFields.map(([key]) => key).join(', ')}`);
      return;
    }
  
    // Dispatch the action
    dispatch(updateProduct(payload))
  .unwrap()
  .then(() => {
    message.success('Product updated successfully!');
    onClose();
  })
  .catch((err) => {
    console.error('Error updating product:', err);
    message.error('Failed to update product.');
  });

  };
  

  const handleImageChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      setImageFile(info.file.originFileObj); // Store the image file in state
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
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
            <Form.Item
              label="Product Image"
              name="productImage"
            >
              <Upload 
                beforeUpload={() => false} // Prevent automatic upload
                onChange={handleImageChange}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
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
