import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderLifeCycle } from '../../Redux/slice/orderSlice'; // Adjust path as necessary
import { Table, Spin, message } from 'antd';

const OrderCycle = () => {
  const dispatch = useDispatch();
  const { lifeCycle, status, error } = useSelector((state) => state.order);

  useEffect(() => {
    // Fetch order life cycle options on mount
    const fetchData = async () => {
      try {
        await dispatch(fetchOrderLifeCycle()).unwrap();
      } catch (err) {
        message.error('Failed to fetch lifecycle states: ' + err);
      }
    };

    fetchData();
  }, [dispatch, error]); // Added error to the dependency array

  // Define columns for Ant Design Table
  const columns = [
    {
      title: 'Order Cycle',
      dataIndex: 'orderCycle',
      key: 'orderCycle',
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt', // Assuming there's an updatedAt field
      key: 'updatedAt',
      render: (text) => new Date(text).toLocaleString(), // Format date
    },
  ];

  return (
    <div>
      <h1>Order Lifecycle States</h1>
      {status === 'loading' ? (
        <Spin />
      ) : (
        <Table
          dataSource={lifeCycle}
          columns={columns}
          rowKey="orderCycle" // or use another unique identifier
          pagination={{ pageSize: 10 }} // Adjust page size as needed
        />
      )}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default OrderCycle;
