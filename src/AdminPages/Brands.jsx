import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBrands, addBrand, updateBrand } from "../Redux/slice/brandSlice";
import { fetchCategories } from "../Redux/slice/categorySlice";
import { Select, Form, Input, Button, Table, Upload, Modal, message, Image, Row, Col } from "antd";
import { PlusOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid"; // Import uuid

const BrandPage = () => {
  const dispatch = useDispatch();
  const { brands, loading } = useSelector((state) => state.brands);
  const { categories, loading: categoryLoading } = useSelector((state) => state.categories);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentBrand, setCurrentBrand] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null); // To preview logo
  const [submitLoading, setSubmitLoading] = useState(false); // Loading state for the button
  const [searchText, setSearchText] = useState(""); // For storing search query

  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchCategories());
  }, [dispatch]);

  const showModal = (brand = null) => {
    setCurrentBrand(brand);
    if (brand) {
      form.setFieldsValue({
        BrandName: brand.brandName,
        CategoryId: brand.categoryId,
      });
      setPreviewLogo(brand.logoUrl);
    } else {
      form.resetFields();
      setPreviewLogo(null);
    }
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    setSubmitLoading(true); // Set loading to true when submitting

    try {
      const formData = new FormData();

      if (currentBrand) {
        formData.append("BrandId", currentBrand.brandId);  // Use current brand ID for updating
      } else {
        formData.append("BrandId", uuidv4());
      }

      formData.append("BrandName", values.BrandName);
      formData.append("CategoryId", values.CategoryId);

      if (values.LogoName && values.LogoName.file) {
        formData.append("LogoName", values.LogoName.file);
      } else {
        message.error("Logo is required.");
        setSubmitLoading(false);
        return;
      }

      if (currentBrand) {
        await dispatch(updateBrand({ Brandid: currentBrand.brandId, formData }));
        message.success("Brand updated successfully!");
      } else {
        await dispatch(addBrand(formData));
        message.success("Brand added successfully!");
      }

      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to save brand.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleFileChange = ({ file }) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewLogo(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewLogo(null);
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const filteredBrands = brands.filter((brand) => {
    const brandNameMatch = brand.brandName.toLowerCase().includes(searchText);
    const categoryMatch = categories.some(
      (category) => category.categoryName.toLowerCase().includes(searchText) && category.categoryId === brand.categoryId
    );
    return brandNameMatch || categoryMatch;
  });

  const columns = [
    { title: "Brand Name", dataIndex: "brandName", key: "brandName" },
    {
      title: "Category",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (categoryId) => {
        const category = categories.find((cat) => cat.categoryId === categoryId);
        return category ? category.categoryName : "Unknown";
      },
    },
    {
      title: "Logo",
      dataIndex: "logoUrl",
      key: "logoUrl",
      render: (logoUrl) => <Image width={50} src={logoUrl} alt="Brand Logo" />,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button icon={<EditOutlined />} onClick={() => showModal(record)}  className="bg-green-600 text-white  transition rounded-full">
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Row justify="space-between" align="middle" className="mb-4">
        <Col>
          <h1 className="text-lg font-semibold text-red-500">Brands Management</h1>
        </Col>
        <Col>
          <Button  icon={<PlusOutlined />} onClick={() => showModal()} className="bg-green-600 text-white  transition rounded-full">
            Add Brand
          </Button>
        </Col>
      </Row>

      <Row justify="space-between" className="mb-4">
        <Col span={24} md={10} className="mb-2 md:mb-0">
          <Input
            placeholder="Search by brand or category"
            value={searchText}
            onChange={handleSearchChange}
            className="w-full rounded-full"
            allowClear
          />
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredBrands}
        rowKey="brandId"
        loading={loading || categoryLoading}
        style={{ marginTop: 20 }}
        pagination={{ pageSize: 7 }}
      />

      <Modal
        title={currentBrand ? "Edit Brand" : "Add Brand"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        bodyStyle={{ padding: 20 }}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="Brand Name"
            name="BrandName"
            rules={[{ required: true, message: "Please enter the brand name" }]}
          >
            <Input placeholder="Enter brand name" />
          </Form.Item>
          <Form.Item
            label="Category"
            name="CategoryId"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select category" loading={categoryLoading}>
              {categories.map((cat) => (
                <Select.Option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Logo" name="LogoName">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              accept="image/*"
              onChange={handleFileChange}
            >
              <Button icon={<UploadOutlined />}>Upload Logo</Button>
            </Upload>
            {previewLogo && (
              <Image
                width={100}
                src={previewLogo}
                alt={currentBrand?.BrandName || "Preview Logo"}
                style={{ marginTop: 10 }}
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={submitLoading}>
              {currentBrand ? "Update" : "Add"} Brand
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BrandPage;
