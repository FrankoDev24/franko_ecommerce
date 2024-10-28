import { useEffect, useState, useCallback } from 'react'; // Import useCallback
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdersByDate, updateOrderTransition } from '../../Redux/slice/orderSlice';
import { DatePicker, Button, Table, message, Empty, Modal, Select, Spin, Input } from 'antd';
import OrderDetailsModal from './OrderDetailsModal';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const [dateRange, setDateRange] = useState([null, null]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [newCycle, setNewCycle] = useState('');
  const [searchText, setSearchText] = useState('');

  // Use useCallback to memoize the fetchCurrentMonthOrders function
  const fetchCurrentMonthOrders = useCallback(() => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    const from = startOfMonth.toISOString().split('T')[0];
    const to = endOfMonth.toISOString().split('T')[0];
    dispatch(fetchOrdersByDate({ from, to }));
  }, [dispatch]); // Dependency array includes dispatch

  const handleDateChange = (dates) => setDateRange(dates);

  const handleFetchOrders = () => {
    if (dateRange[0] && dateRange[1]) {
      // Format the dates as MM-DD-YYYY
      const from = dateRange[0].format('MM-DD-YYYY');
      const to = dateRange[1].format('MM-DD-YYYY');
      dispatch(fetchOrdersByDate({ from, to }));
    } else {
      message.error('Please select a date range');
    }
  };

  useEffect(() => {
    fetchCurrentMonthOrders();
    if (error) message.error(`Error: ${error}`);
  }, [fetchCurrentMonthOrders, error]); // Add fetchCurrentMonthOrders to the dependency array

  const openCycleModal = (order) => {
    setSelectedOrderId(order.orderCode);
    setIsModalOpen(true);
  };

  const openDetailModal = (orderId) => {
    setSelectedOrderId(orderId);
    setIsDetailModalOpen(true);
  };

  const handleCycleChange = (value) => setNewCycle(value);

  const handleUpdateCycle = async () => {
    if (selectedOrderId && newCycle) {
      await dispatch(updateOrderTransition({ cycleName: newCycle, orderId: selectedOrderId }));
      message.success('Order cycle updated successfully');
      setIsModalOpen(false);
      setNewCycle('');
      fetchCurrentMonthOrders();
    }
  };

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  const filteredOrders = orders.filter(order => {
    const fullNameMatch = order.fullName.toLowerCase().includes(searchText);
    const statusMatch = order.orderCycle.toLowerCase().includes(searchText);
    return fullNameMatch || statusMatch;
  });

  const columns = [
    {
      title: 'Order Code',
      dataIndex: 'orderCode',
      key: 'orderCode',
      render: (text, record) => (
        <Button type="link" onClick={() => openDetailModal(record.orderCode)}>
          {text}
        </Button>
      ),
    },
    { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Contact Number', dataIndex: 'contactNumber', key: 'contactNumber' },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
    },
    {
      title: 'Status',
      dataIndex: 'orderCycle',
      key: 'orderCycle',
      render: (text, record) => (
        <Button type="link" onClick={() => openCycleModal(record)}>
          {text}
        </Button>
      ),
      sorter: (a, b) => a.orderCycle.localeCompare(b.orderCycle),
    },
  ];

  return (
    <div>
      <h2>Orders</h2>
      <RangePicker format="MM-DD-YYYY" onChange={handleDateChange} style={{ marginBottom: 16 }} />
      <Button type="primary" onClick={handleFetchOrders} disabled={loading} style={{ marginRight: 16 }}>
        Fetch Orders
      </Button>
      <Search
        placeholder="Search by name or status"
        onSearch={handleSearch}
        style={{ width: 300, marginBottom: 16 }}
      />
      {loading ? (
        <Spin />
      ) : filteredOrders.length > 0 ? (
        <Table
        dataSource={filteredOrders}
        columns={columns}
        rowKey={(record, index) => `${record.orderCode}-${index}`}
      />
      
      ) : (
        <Empty description="No orders found" />
      )}
      <Modal
        title="Update Order Cycle"
        visible={isModalOpen}
        onOk={handleUpdateCycle}
        onCancel={() => setIsModalOpen(false)}
      >
        <Select value={newCycle} onChange={handleCycleChange} style={{ width: '100%' }}>
          <Option value="Pending">Pending</Option>
          <Option value="Processed">Processed</Option>
          <Option value="Delivered">Delivered</Option>
        </Select>
      </Modal>
      {isDetailModalOpen && (
        <OrderDetailsModal orderId={selectedOrderId} onClose={() => setIsDetailModalOpen(false)} />
      )}
    </div>
  );
};

export default Orders;
