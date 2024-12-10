import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Row, Col, Statistic, Spin, Typography } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import moment from 'moment';
import { ShoppingOutlined } from '@ant-design/icons';
import { fetchOrdersByDate } from '../../Redux/slice/orderSlice';

const FulfillmentsDashboard = () => {
  const dispatch = useDispatch();
  const { orders = [] } = useSelector((state) => state.orders);

  const [dailyOrders, setDailyOrders] = useState([]);
  const [weeklyOrders, setWeeklyOrders] = useState([]);
  const [monthlyOrders, setMonthlyOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const startDate = '2020-01-01';
    const endDate = moment().add(1, 'day').format('YYYY-MM-DD'); // Fetch orders up to today
    dispatch(fetchOrdersByDate({ from: startDate, to: endDate }));
  }, [dispatch]);

  useEffect(() => {
    if (orders.length > 0) {
      setDailyOrders(calculateDailyOrders(orders));
      setWeeklyOrders(calculateWeeklyOrders(orders));
      setMonthlyOrders(calculateMonthlyOrders(orders));
      setTotalOrders(orders.length);
    }
  }, [orders]);

  const calculateDailyOrders = (orders) => {
    const endDate = moment().add(1, 'day');
    const startDate = moment().subtract(6, 'days'); // Last 7 days

    const dailyCounts = [];
    let currentDate = startDate.clone();

    while (currentDate.isBefore(endDate, 'day')) {
      const dailyCount = orders.filter((order) =>
        moment(order.orderDate).isSame(currentDate, 'day')
      ).length;

      dailyCounts.push({
        name: currentDate.format('MM/DD/YYYY'),
        totalOrders: dailyCount,
      });

      currentDate.add(1, 'day');
    }

    return dailyCounts;
  };

  const calculateWeeklyOrders = (orders) => {
    const endDate = moment().add(1, 'day');
    const startDate = moment().subtract(6, 'days'); // Last 6 days

    const weeklyCounts = [];
    let currentDate = startDate.clone();

    while (currentDate.isBefore(endDate, 'day')) {
      const dailyCount = orders.filter((order) =>
        moment(order.orderDate).isSame(currentDate, 'day')
      ).length;

      weeklyCounts.push({
        name: currentDate.format('MM/DD'),
        totalOrders: dailyCount,
      });

      currentDate.add(1, 'day');
    }

    return weeklyCounts;
  };

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

  if (!orders) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <Typography.Title level={4} style={{ color: 'red' }}>
        Fulfillment Manager Dashboard
      </Typography.Title>

      <Row gutter={[16, 16]} style={{ marginBottom: '40px' }}>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card
            style={{ backgroundColor: '#f5f7fa' }}
            bordered={false}
            extra={<ShoppingOutlined  style={{ fontSize: '24px', color: '#1890ff' }} />}
          >
            <Statistic title="Orders Today" value={dailyOrders.at(-1)?.totalOrders || 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card
            style={{ backgroundColor: '#f5f7fa' }}
            bordered={false}
            extra={<ShoppingOutlined style={{ fontSize: '24px', color: '#52c41a' }} />}
          >
            <Statistic
              title="Orders This Week"
              value={weeklyOrders.reduce((sum, week) => sum + week.totalOrders, 0)}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card
            style={{ backgroundColor: '#f5f7fa' }}
            bordered={false}
            extra={<ShoppingOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />}
          >
            <Statistic title="Total Orders" value={totalOrders} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Orders (Last 6 Days)">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyOrders}>
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

export default FulfillmentsDashboard;
