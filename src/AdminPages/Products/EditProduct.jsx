import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateProduct } from "../../Redux/slice/productSlice";
import { Modal, Form, Input, Select, Button, message, Row, Col } from "antd";
import PropTypes from "prop-types";

const { Option } = Select;

const UpdateProduct = ({ visible, onClose, product, brands, showrooms }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    if (product && Object.keys(product).length > 0) {
      form.setFieldsValue({
        Productid: product.productID,
        ProductName: product.productName,
        price: product.price,
        oldPrice: product.oldPrice,
        Description: product.description,
        BrandId: product.brandId,
        ShowRoomId: product.showRoomId,
      });
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

    if (!payload.Productid) {
      message.error("Product ID is missing!");
      return;
    }

    try {
      await dispatch(updateProduct(payload)).unwrap();
      message.success("Product updated successfully!");
      onClose();
      form.resetFields();
    } catch (err) {
      console.error("Error updating product:", err);
      message.error("Failed to update product.");
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
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ Productid: product.productID }}
      >
        <Form.Item name="Productid" style={{ display: "none" }}>
          <Input type="hidden" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Product Name"
              name="ProductName"
              rules={[{ required: true, message: "Please input the product name!" }]}
            >
              <Input placeholder="Enter product name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please input the price!" }]}
            >
              <Input type="number" placeholder="Enter product price" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Old Price" name="oldPrice">
              <Input type="number" placeholder="Enter old price (optional)" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Brand"
              name="BrandId"
              rules={[{ required: true, message: "Please select a brand!" }]}
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
              rules={[{ required: true, message: "Please input the description!" }]}
            >
              <Input.TextArea placeholder="Enter product description" rows={3} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Showroom"
              name="ShowRoomId"
              rules={[{ required: true, message: "Please select a showroom!" }]}
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
  product: PropTypes.object.isRequired,
  brands: PropTypes.array.isRequired,
  showrooms: PropTypes.array.isRequired,
};

export default UpdateProduct;
