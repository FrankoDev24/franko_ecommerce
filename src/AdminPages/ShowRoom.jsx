import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands } from '../Redux/slice/brandSlice';
import { fetchShowrooms, addShowroom } from '../Redux/slice/showRoomSlice';
import { Button, Select, Typography, message, Spin, Modal, Form, Input } from 'antd';
import { v4 as uuidv4 } from 'uuid';

const { Title } = Typography;

const ShowRoom = () => {
  const dispatch = useDispatch();
  const { brands, loading: loadingBrands } = useSelector((state) => state.brands);
  const { showrooms, loading: loadingShowrooms, error: errorShowrooms } = useSelector((state) => state.showrooms);

  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchShowrooms());
  }, [dispatch]);

  const onFinish = (values) => {
    const newShowroom = { ...values, showRoomID: uuidv4() };
    dispatch(addShowroom(newShowroom))
      .unwrap()
      .then(() => {
        form.resetFields();
        setModalVisible(false);
        message.success('Showroom added successfully!');
        dispatch(fetchShowrooms());
      })
      .catch((err) => {
        console.error(err);
        const errorMessage = err?.response?.data?.message || err?.message || 'An unexpected error occurred.';
        message.error(`Error: ${errorMessage}`);
      });
  };

  const showroomsWithBrandNames = showrooms.map(showroom => {
    const brand = brands.find(b => b.brandId === showroom.brandId);
    return {
      ...showroom,
      brandName: brand ? brand.brandName : 'Unknown',
    };
  });

  return (
    <div className=" mx-auto">
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
                hidden
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


          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {showroomsWithBrandNames.map((showroom) => (
              <div key={showroom.showRoomID} className="border p-4 rounded shadow">
                <h3 className="text-lg font-semibold">{showroom.showRoomName}</h3>
                <p className="text-gray-500">Brand: {showroom.brandName}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ShowRoom;
