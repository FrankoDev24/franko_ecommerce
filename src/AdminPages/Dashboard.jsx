import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Row, Col, Statistic, Spin, Typography } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { fetchOrdersByDate } from '../Redux/slice/orderSlice';
import { fetchProducts } from '../Redux/slice/productSlice';
import { fetchBrands } from '../Redux/slice/brandSlice';
import { fetchCustomers } from '../Redux/slice/customerSlice';
import moment from 'moment';
import { ShoppingCartOutlined, ProductOutlined, AppstoreAddOutlined, UserOutlined } from '@ant-design/icons';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { brands } = useSelector((state) => state.brands);
  const { orders = [] } = useSelector((state) => state.orders);
  const { customerList } = useSelector((state) => state.customer);

  const loading = !(products && brands && orders && customerList);
  const error = !loading && (!products || !brands || !orders || !customerList);

  const [dailyOrders, setDailyOrders] = useState([]);
  const [monthlyOrders, setMonthlyOrders] = useState([]);

  useEffect(() => {
    const startDate = '2020-01-01';
    const endDate = moment().add(1, 'day').format('YYYY-MM-DD'); // Fetch orders up to a day after the current date
    dispatch(fetchOrdersByDate({ from: startDate, to: endDate }));
    dispatch(fetchProducts());
    dispatch(fetchBrands());
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (orders && orders.length > 0) {
      const dailyData = calculateDailyOrders(orders);
      const monthlyData = calculateMonthlyOrders(orders);
      setDailyOrders(dailyData);
      setMonthlyOrders(monthlyData);
    }
  }, [orders]);

  // Calculate daily orders for the last 7 days
  const calculateDailyOrders = (orders) => {
    const endDate = moment().add(1, 'day');
    const startDate = moment().subtract(6, 'days'); // 7-day range includes today

    const dailyCounts = [];
    let currentDate = startDate.clone();

    while (currentDate.isBefore(endDate, 'day')) {
      const dailyOrdersCount = orders.filter((order) =>
        moment(order.orderDate).isSame(currentDate, 'day')
      ).length;

      dailyCounts.push({
        name: currentDate.format('MM/DD/YYYY'),
        totalOrders: dailyOrdersCount,
      });

      currentDate.add(1, 'day');
    }

    return dailyCounts;
  };

  // Calculate monthly orders for the last 6 months
  const calculateMonthlyOrders = (orders) => {
    const endDate = moment().add(1, 'day');
    const startDate = moment().subtract(5, 'months').startOf('month'); // 6-month range

    const monthlyCounts = [];
    let currentMonth = startDate.clone();

    while (currentMonth.isSameOrBefore(endDate, 'month')) {
      const monthlyOrdersCount = orders.filter((order) =>
        moment(order.orderDate).isBetween(
          currentMonth,
          currentMonth.clone().endOf('month'),
          null,
          '[]'
        )
      ).length;

      monthlyCounts.push({
        name: currentMonth.format('MM/YYYY'),
        totalOrders: monthlyOrdersCount,
      });

      currentMonth.add(1, 'month');
    }

    return monthlyCounts;
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  return (
    <div>
      <Typography.Title level={4} style={{color: 'red'}}>Admin Dashboard</Typography.Title>

      <Row gutter={[16, 16]} style={{ marginTop: '20px', marginBottom: '40px' }}>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Card
            style={{ backgroundColor: '#f5f7fa' }}
            bordered={false}
            extra={<ProductOutlined  style={{ fontSize: '24px', color: '#1890ff' }} />}
          >
            <Statistic title="Total Products" value={products.length} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Card
            style={{ backgroundColor: '#f5f7fa' }}
            bordered={false}
            extra={<ShoppingCartOutlined style={{ fontSize: '24px', color: '#52c41a' }} />}
          >
            <Statistic title="Total Orders" value={orders.length} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Card
            style={{ backgroundColor: '#f5f7fa' }}
            bordered={false}
            extra={<AppstoreAddOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />}
          >
            <Statistic title="Total Brands" value={brands.length} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Card
            style={{ backgroundColor: '#f5f7fa' }}
            bordered={false}
            extra={<UserOutlined style={{ fontSize: '24px', color: '#13c2c2' }} />}
          >
            <Statistic title="Total Customers" value={customerList.length} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Daily Orders (Last 7 Days)">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="totalOrders" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Monthly Orders (Last 6 Months)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalOrders" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
