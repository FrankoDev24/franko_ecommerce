import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdersByThirdParty } from '../../Redux/slice/orderSlice'; // Adjust the action import as needed
import { Card, Col, Row, Statistic, Spin, Modal } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table } from 'antd';
import moment from 'moment';
import { EyeOutlined } from '@ant-design/icons';

const AgentDashboard = () => {
  const dispatch = useDispatch();
  const { orders = [] } = useSelector((state) => state.orders || {});
  
  const [salesData, setSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  useEffect(() => {
    dispatch(fetchOrdersByThirdParty()); // Adjust the action as per your need
  }, [dispatch]);

  useEffect(() => {
    if (orders.length > 0) {
      // Calculate sales data for weekly chart
      const weeklySales = calculateWeeklySales(orders);
      setSalesData(weeklySales);

      // Get the 5 most recent orders
      const recentOrdersData = orders.slice(0, 5);
      setRecentOrders(recentOrdersData);
    }
  }, [orders]);

  const calculateWeeklySales = (orders) => {
    const sales = [];
    for (let i = 0; i < 7; i++) {
      const startOfWeek = moment().subtract(i, 'days').startOf('day');
      const endOfWeek = moment().subtract(i, 'days').endOf('day');
      const dailySales = orders
        .filter(order => moment(order.orderDate).isBetween(startOfWeek, endOfWeek, null, '[]'))
        .reduce((acc, order) => acc + (order.totalAmount || 0), 0);

      sales.push({
        name: startOfWeek.format('YYYY-MM-DD'),
        total: dailySales,
      });
    }
    return sales.reverse();
  };

  const handleViewOrder = (orderId) => {
    const selected = orders.find(order => order.orderId === orderId);
    setSelectedOrder(selected);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const columns = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
    { title: 'Customer Name', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Order Status', dataIndex: 'orderStatus', key: 'orderStatus' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <EyeOutlined
          className="text-green-700 text-xl cursor-pointer"
          onClick={() => handleViewOrder(record.orderId)}
        />
      ),
    },
  ];

  const recentOrdersData = recentOrders.map((order, index) => ({
    key: index,
    orderId: order.orderId,
    customerName: order.customerName,
    orderStatus: order.orderStatus,
  }));

  return (
    <div className="dashboard-container">
      <h2 className="text-2xl font-semibold mb-6 text-red-500">Dashboard</h2>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Orders"
              value={orders.length}
              precision={0}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Sales"
              value={orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0)}
              precision={2}
              prefix="GHS"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24}>
          <Card>
            <h3>Weekly Sales Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24}>
          <Card>
            <h3>Top Selling Products (Recent Orders)</h3>
            <Table
              dataSource={recentOrdersData}
              columns={columns}
              pagination={false}
              rowKey="key"
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={`Order: ${selectedOrder?.orderId || 'Details'}`}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        {selectedOrder ? (
          <div>
            <p><strong>Customer Name:</strong> {selectedOrder.customerName}</p>
            <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
            <p><strong>Total Amount:</strong> {selectedOrder.totalAmount}</p>
            <h4>Order Items</h4>
            <ul>
              {selectedOrder.items?.map((item, index) => (
                <li key={index}>
                  {item.productName} - {item.quantity} x {item.price}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <Spin size="large" />
        )}
      </Modal>
    </div>
  );
};

export default AgentDashboard
