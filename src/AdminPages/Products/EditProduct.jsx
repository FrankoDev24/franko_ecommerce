import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateProduct } from '../../Redux/slice/productSlice';
import { Modal, Form, Input, Select, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const { Option } = Select;

const UpdateProduct = ({ visible, onClose, product, brands, showrooms }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        ...product,
        productImage: product.productImage ? [{
          uid: '-1',
          name: product.productImage.name || 'Product Image',
          status: 'done',
          url: product.productImage.url || product.productImage,
        }] : [],
        brandId: product.brandId,
        showRoomId: product.showRoomId,
      });
    }
  }, [product, form]);

  const onFinish = (values) => {
    const formData = new FormData();
    Object.keys(values).forEach(key => {
      if (key === 'productImage' && values.productImage) {
        formData.append(key, values.productImage[0].originFileObj);
      } else {
        formData.append(key, values[key]);
      }
    });

    dispatch(updateProduct(formData))
      .unwrap()
      .then(() => {
        message.success('Product updated successfully!');
        onClose();
      })
      .catch((err) => {
        console.error(err);
        message.error('Failed to update product.');
      });
  };

  // Function to generate the image URL
  const getImageUrl = (imagePath) => {
    const backendBaseURL = 'http://197.251.217.45:5000/'; // Replace with your actual backend URL
    return `${backendBaseURL}/Media/Products_Images/${imagePath.split('\\').pop()}`;
  };

  return (
    <Modal
      title="Update Product"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Product Name"
          name="productName"
          rules={[{ required: true, message: 'Please input the product name!' }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input the description!' }]}
        >
          <Input.TextArea placeholder="Enter product description" />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: 'Please input the price!' }]}
        >
          <Input type="number" placeholder="Enter product price" />
        </Form.Item>

        <Form.Item
          label="Old Price"
          name="oldPrice"
        >
          <Input type="number" placeholder="Enter old price (optional)" />
        </Form.Item>

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

        <Form.Item
          label="Showroom"
          name="showRoomId"
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

        <Form.Item
          label="Product Image"
          name="productImage"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList;
          }}
        >
          <Upload beforeUpload={() => false} accept="image/*">
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
          {product?.productImage && (
            <img
              src={getImageUrl(product.productImage.url || product.productImage)}
              alt={product.productName}
              style={{ width: '20%', height: '20%', marginTop: '10px', borderRadius: '5px' }} // Adjust image display
            />
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Update Product
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// PropTypes validation
UpdateProduct.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.object,
  brands: PropTypes.arrayOf(PropTypes.object).isRequired,
  showrooms: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default UpdateProduct;
