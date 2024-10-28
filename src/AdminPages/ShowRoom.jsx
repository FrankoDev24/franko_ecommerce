import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands } from '../Redux/slice/brandSlice'; // Ensure the correct import path
import { fetchShowrooms, addShowroom } from '../Redux/slice/showRoomSlice'; // Ensure the correct import path
import { Button, Select, Typography, message, Spin, Modal, Form, Input } from 'antd';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique ID generation

const { Title } = Typography;

const ShowRoom = () => {
  const dispatch = useDispatch();
  const { brands, loading: loadingBrands } = useSelector((state) => state.brands);
  const { showrooms, loading: loadingShowrooms, error: errorShowrooms } = useSelector((state) => state.showrooms);
  
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch brands and showrooms when the component mounts
  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchShowrooms());
  }, [dispatch]);

  // Handle form submission
  const onFinish = (values) => {
    const newShowroom = { ...values, showRoomID: uuidv4() }; // Generate unique Showroom ID
    dispatch(addShowroom(newShowroom))
      .unwrap()
      .then(() => {
        form.resetFields(); // Reset form fields after successful submission
        setModalVisible(false); // Close modal
        message.success('Showroom added successfully!');
        dispatch(fetchShowrooms()); // Refresh showroom list
      })
      .catch((err) => {
        console.error(err);
        const errorMessage = err?.response?.data?.message || err?.message || 'An unexpected error occurred.';
        message.error(`Error: ${errorMessage}`);
      });
  };

  return (
    <div className=" max-w-3xl">
      <Title level={2} className="text-center mb-4">Showrooms</Title>

      {loadingBrands || loadingShowrooms ? (
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {errorShowrooms && <p className="text-red-500 text-center">{errorShowrooms}</p>}
          
          <Button type="primary" onClick={() => setModalVisible(true)} className="mb-4">
            Add New Showroom
          </Button>

          <Modal
            title="Create Showroom"
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
            width={400}
          >
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Showroom ID"
                name="showRoomID"
                hidden // Hide the field since it's automatically generated
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                label="Showroom Name"
                name="showRoomName"
                rules={[{ required: true, message: 'Please input the showroom name!' }]}
              >
                <Input placeholder="Enter showroom name" />
              </Form.Item>

              <Form.Item
                label="Brand"
                name="brandId"
                rules={[{ required: true, message: 'Please select a brand!' }]}
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
                <Button type="primary" htmlType="submit" className="w-full">
                  Add Showroom
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Title level={3} className="text-center mt-6">Showroom List</Title>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {showrooms.map((showroom) => {


              return (
                <div key={showroom.showRoomID} className="border p-4 rounded shadow">
                  <h3 className="text-lg font-semibold">{showroom.showRoomName}</h3>
                
                 
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ShowRoom;
