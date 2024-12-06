import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBrands } from "../Redux/slice/brandSlice";
import {
  fetchShowrooms,
  addShowroom,
  updateShowroom,
} from "../Redux/slice/showRoomSlice";
import {
  Button,
  Select,
  Typography,
  message,
  Spin,
  Modal,
  Form,
  Input,
  Pagination,
  Table,
} from "antd";
import { v4 as uuidv4 } from "uuid";
import { EditOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ShowRoom = () => {
  const dispatch = useDispatch();
  const { brands, loading: loadingBrands } = useSelector(
    (state) => state.brands
  );
  const {
    showrooms,
    loading: loadingShowrooms,
    error: errorShowrooms,
  } = useSelector((state) => state.showrooms);

  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentShowroom, setCurrentShowroom] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const showroomsPerPage = 8; // Showrooms per page

  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchShowrooms());
  }, [dispatch]);

  const onFinish = (values) => {
    const showroomID = currentShowroom ? currentShowroom.showRoomID : uuidv4();
    const showroomData = {
      ...values,
      Showroomid: showroomID,
    };

    if (isEditing) {
      dispatch(updateShowroom(showroomData))
        .unwrap()
        .then(() => {
          message.success("Showroom updated successfully!");
          resetForm();
        })
        .catch(handleError);
    } else {
      dispatch(addShowroom(showroomData))
        .unwrap()
        .then(() => {
          message.success("Showroom added successfully!");
          resetForm();
        })
        .catch(handleError);
    }
  };

  const handleError = (err) => {
    console.error(err);
    const errorMessage =
      err?.response?.data?.message ||
      err?.message ||
      "An unexpected error occurred.";
    message.error(`Error: ${errorMessage}`);
  };

  const handleEditShowroom = (showroom) => {
    setCurrentShowroom(showroom);
    form.setFieldsValue({
      showRoomID: showroom.showRoomID,
      showRoomName: showroom.showRoomName,
      brandId: showroom.brandId,
    });
    setIsEditing(true);
    setModalVisible(true);
  };

  const resetForm = () => {
    form.resetFields();
    setModalVisible(false);
    setIsEditing(false);
    setCurrentShowroom(null);
    dispatch(fetchShowrooms()); // Refresh showrooms after adding/updating
  };

  const showroomsWithBrandNames = showrooms.map((showroom) => {
    const brand = brands.find((b) => b.brandId === showroom.brandId);
    return {
      ...showroom,
      brandName: brand ? brand.brandName : "Unknown",
    };
  });

  // Pagination logic
  const indexOfLastShowroom = currentPage * showroomsPerPage;
  const indexOfFirstShowroom = indexOfLastShowroom - showroomsPerPage;
  const currentShowrooms = showroomsWithBrandNames.slice(
    indexOfFirstShowroom,
    indexOfLastShowroom
  );

  // Table Columns
  const columns = [
    {
      title: "Showroom Name",
      dataIndex: "showRoomName",
      key: "showRoomName",
    },
    {
      title: "Brand",
      dataIndex: "brandName",
      key: "brandName",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, showroom) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => handleEditShowroom(showroom)}
          className="bg-green-600 text-white transition rounded-full"
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="mx-auto p-6">
      <Title level={3} className="text-center mb-6">
        Showrooms
      </Title>

      {loadingBrands || loadingShowrooms ? (
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {errorShowrooms && (
            <p className="text-red-500 text-center mb-4">{errorShowrooms}</p>
          )}

          <Button
          icon={<PlusOutlined />}
            onClick={() => {
              setModalVisible(true);
              setIsEditing(false);
            }}
            className="mb-6 bg-green-600 text-white transition rounded-full"
          >
            Add New Showroom
          </Button>

          <Modal
            title={isEditing ? "Update Showroom" : "Create Showroom"}
            visible={modalVisible}
            onCancel={resetForm}
            footer={null}
            width={400}
          >
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Showroom ID"
                name="showRoomID"
                hidden
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                label="Showroom Name"
                name="showRoomName"
                rules={[
                  {
                    required: true,
                    message: "Please input the showroom name!",
                  },
                ]}
              >
                <Input placeholder="Enter showroom name" />
              </Form.Item>

              <Form.Item
                label="Brand"
                name="brandId"
                rules={[{ required: true, message: "Please select a brand!" }]}
              >
                <Select placeholder="Select a brand">
                  {brands.map((brand) => (
                    <Select.Option key={brand.brandId} value={brand.brandId}>
                      {brand.brandName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full bg-green-800 hover:bg-green-700 transition">
                  {isEditing ? "Update Showroom" : "Add Showroom"}
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Table
            columns={columns}
            dataSource={currentShowrooms}
            rowKey="showRoomID"
            pagination={false}
            className="mb-6"
          />

          <Pagination
            current={currentPage}
            onChange={(page) => setCurrentPage(page)}
            pageSize={showroomsPerPage}
            total={showroomsWithBrandNames.length}
            className="text-center"
            showSizeChanger={false}
            showTotal={(total) => `Total ${total} showrooms`}
          />
        </>
      )}
    </div>
  );
};

export default ShowRoom;
