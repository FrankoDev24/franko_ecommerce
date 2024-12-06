import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersByThirdParty } from "../../Redux/slice/orderSlice";
import {
  Card,
  Col,
  Row,
  Statistic,
  Spin,
  DatePicker,
  Table,
  Typography,
  Tag
} from "antd";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { EyeOutlined, RiseOutlined, FallOutlined } from "@ant-design/icons";
import moment from "moment";
import OrderModal from "../../Pages/OrderHistory/OrderModal";

const { RangePicker } = DatePicker;

const AgentDashboard = () => {
  const dispatch = useDispatch();
  const ordersData = useSelector((state) => state.orders);


  const orders = useMemo(() => ordersData?.orders || [], [ordersData]);
  const loading = useMemo(() => ordersData?.loading || {}, [ordersData]);
  const error = useMemo(() => ordersData?.error || {}, [ordersData]);

  const today = moment();
  const defaultFromDate = today.subtract(7, "days");
  const defaultToDate = today.add(1, "days");
  const tomorrow = moment().add(1, "days"); // A day after today

  const [dateRange, setDateRange] = useState([defaultFromDate, defaultToDate]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [dailyOrders, setDailyOrders] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);

  const customerObject = JSON.parse(localStorage.getItem("customer"));
  const ThirdPartyAccountNumber = customerObject?.customerAccountNumber;

  useEffect(() => {
    if (ThirdPartyAccountNumber) {
      const [from, to] = dateRange.map((date) => date.format("MM/DD/YYYY"));
      dispatch(fetchOrdersByThirdParty({ from, to, ThirdPartyAccountNumber }));
    }
  }, [dateRange, ThirdPartyAccountNumber, dispatch]);

  useEffect(() => {
    if (orders.length > 0) {
      const dailyData = calculateDailyOrders(orders);
      setChartData(dailyData);
      updateDailyOrders(dailyData);
    }
  }, [orders]);

  const calculateDailyOrders = (orders) => {
    const dailyCounts = [];
    for (let i = 0; i < 7; i++) {
      const startOfDay = moment().subtract(i, "days").startOf("day");
      const endOfDay = moment().subtract(i, "days").endOf("day");
      const dailyOrdersCount = orders.filter((order) =>
        moment(order.orderDate).isBetween(startOfDay, endOfDay, null, "[]")
      ).length;

      dailyCounts.push({
        name: startOfDay.format("YYYY-MM-DD"),
        totalOrders: dailyOrdersCount,
      });
    }
    return dailyCounts.reverse();
  };

  const updateDailyOrders = (dailyData) => {
    const todayOrders = dailyData[dailyData.length - 1]?.totalOrders || 0;
    const yesterdayOrders = dailyData[dailyData.length - 2]?.totalOrders || 0;
    const change =
      yesterdayOrders > 0
        ? ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100
        : 0;

    setDailyOrders(todayOrders);
    setPercentageChange(change.toFixed(2));
  };

 
  const handleDateChange = (dates) => {
    if (dates) {
      // Ensure the range includes one day after the selected end date
      setDateRange([dates[0], dates[1].add(1, "day")]);
    }
  };



  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (orderId) => orderId.slice(-6),
    },
    { title: "Order Date", dataIndex: "orderDate", key: "orderDate" },
    {
      title: "Order Cycle",
      dataIndex: "orderCycle",
      key: "orderCycle",
      render: (cycle) => getOrderCycleTag(cycle),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <EyeOutlined
          className="text-green-700 text-xl cursor-pointer"
          onClick={() => handleViewOrder(record)}
        />
      ),
    },
  ];const getRecentOrders = (orders) => {
    return [...orders]
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)) // Sort by date (newest first)
      .slice(0, 5); // Get the first 5 orders
  };

  // Transform orders and get only the top 5 recent orders
  const transformedOrders = getRecentOrders(orders).map((order, index) => ({
    key: index,
    orderId: order.orderCode || "N/A",
    orderDate: moment(order.orderDate).format("MM/DD/YYYY") || "N/A",
    orderCycle: order.orderCycle || "N/A",
  }));
  
 // Calculate total sales from localStorage
 const getTotalSalesFromLocalStorage = () => {
  const storedOrders = JSON.parse(localStorage.getItem("userOrders")) || [];
  return storedOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
};
   // Update local storage total sales when new orders are added
   useEffect(() => {
    const totalSales = getTotalSalesFromLocalStorage();
    localStorage.setItem('totalSales', totalSales.toString());
  }, [orders]);
  const getOrderCycleTag = (cycle) => {
    const cycleMap = {
      "Order Placement": "orange",
      Processing: "blue",
      Confirmed: "green",
      Pending: "orange",
      Unreachable: "red",
      "Wrong Number": "magenta",
      Cancelled: "gray",
      "Not Answered": "default",
      Delivery: "purple",
      Completed: "success",
    };
  
    return <Tag color={cycleMap[cycle] || "default"}>{cycle}</Tag>;
  };
  


  return (
    <div className="dashboard-container">
      <Typography.Title level={4} style={{color: "red"}}>
        Customer Management System
      </Typography.Title>

      <Row gutter={16}>
      <Col xs={24} sm={12} md={8}>
  <Card>
    <Statistic
      title="Daily Orders"
      value={dailyOrders}
      valueStyle={{ color: percentageChange >= 0 ? "#3f8600" : "#cf1322" }}
      prefix={percentageChange >= 0 ? <RiseOutlined /> : <FallOutlined />}
      suffix={
        <span style={{ fontSize: "14px", color: percentageChange >= 0 ? "#3f8600" : "#cf1322" , marginLeft: "20px" }}>
          {`${Math.abs(percentageChange)}%`}
        </span>
      }
    />
  </Card>
</Col>

        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Total Orders" value={orders.length} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Sales"
              value={parseFloat(localStorage.getItem('totalSales') || 0).toFixed(2)} // Fetch total sales from localStorage
              precision={2}
              prefix="GHS"
            />
          </Card>
        </Col>
      </Row>

      <div className="mb-4 mt-6">
        <Typography.Text>Select Date Range:</Typography.Text>
        <RangePicker
          value={dateRange}
          onChange={handleDateChange}
          format="MM/DD/YYYY"
          className="mt-2"
          // Ensure the display matches the extended range
          disabledDate={(current) => current && current > tomorrow}
        />
      </div>


      <Row gutter={16} className="mt-4">
        <Col xs={24}>
          <Card>
            <h3>Daily Orders Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="totalOrders" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="mt-4">
  <Col xs={24}>
    <Card>
      <h3>Recent Orders</h3>
      {loading.orders ? (
        <Spin size="large" />
      ) : error.orders ? (
        <p className="text-red-500">Error: {error.orders}</p>
      ) : (
        <Table
          dataSource={transformedOrders}
          columns={columns}
          rowKey="key"
          pagination={false} // Disable pagination since we're showing the top 5 orders
        />
      )}
    </Card>
  </Col>
</Row>


      <OrderModal
        order={selectedOrder}
        isModalVisible={isModalVisible}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default AgentDashboard;
