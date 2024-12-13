import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersByThirdParty } from "../../Redux/slice/orderSlice";
import { Card, Col, Row, Statistic, Typography } from "antd";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { RiseOutlined, FallOutlined, ShoppingCartOutlined, CalendarOutlined, FileTextOutlined } from "@ant-design/icons";
import moment from "moment";
import OrderModal from "../../Pages/OrderHistory/OrderModal";

const AgentDashboard = () => {
  const dispatch = useDispatch();
  const ordersData = useSelector((state) => state.orders);

  const orders = useMemo(() => ordersData?.orders || [], [ordersData]);
  
  const [weeklyOrders, setWeeklyOrders] = useState([]);
  const [dailyOrders, setDailyOrders] = useState(0);
  const [monthlyOrders, setMonthlyOrders] = useState([]);
  const [percentageChange, setPercentageChange] = useState(0);

  const customerObject = JSON.parse(localStorage.getItem("customer"));
  const ThirdPartyAccountNumber = customerObject?.customerAccountNumber;

  useEffect(() => {
    if (ThirdPartyAccountNumber) {
      const startDate = "2020-01-01"; // From a fixed start date to the current date
      const endDate = moment().add(1, "days").format("YYYY-MM-DD");
      dispatch(fetchOrdersByThirdParty({ from: startDate, to: endDate, ThirdPartyAccountNumber }));
    }
  }, [ThirdPartyAccountNumber, dispatch]);

  useEffect(() => {
    if (orders.length > 0) {
      const dailyData = calculateDailyOrders(orders);
      const monthlyData = calculateMonthlyOrders(orders);
      setDailyOrders(dailyData[dailyData.length - 1]?.totalOrders || 0);
      setWeeklyOrders(calculateWeeklyOrders(orders));
      setMonthlyOrders(monthlyData);
      updateDailyOrders(dailyData);
    }
  }, [orders]);

  const calculateDailyOrders = (orders) => {
    const endDate = moment().add(1, "day");
    const startDate = moment().subtract(6, "days"); // Last 7 days

    const dailyCounts = [];
    let currentDate = startDate.clone();

    while (currentDate.isBefore(endDate, "day")) {
      const dailyCount = orders.filter((order) =>
        moment(order.orderDate).isSame(currentDate, "day")
      ).length;

      dailyCounts.push({
        name: currentDate.format("MM/DD/YYYY"),
        totalOrders: dailyCount,
      });

      currentDate.add(1, "day");
    }

    return dailyCounts;
  };

  const calculateWeeklyOrders = (orders) => {
    const endDate = moment().add(1, "day");
    const startDate = moment().subtract(6, "days"); // Last 6 days

    const weeklyCounts = [];
    let currentDate = startDate.clone();

    while (currentDate.isBefore(endDate, "day")) {
      const dailyCount = orders.filter((order) =>
        moment(order.orderDate).isSame(currentDate, "day")
      ).length;

      weeklyCounts.push({
        name: currentDate.format("MM/DD"),
        totalOrders: dailyCount,
      });

      currentDate.add(1, "day");
    }

    return weeklyCounts;
  };

  const calculateMonthlyOrders = (orders) => {
    const endDate = moment().add(1, "day");
    const startDate = moment().subtract(5, "months").startOf("month");

    const monthlyCounts = [];
    let currentMonth = startDate.clone();

    while (currentMonth.isSameOrBefore(endDate, "month")) {
      const monthlyOrdersCount = orders.filter((order) =>
        moment(order.orderDate).isBetween(
          currentMonth,
          currentMonth.clone().endOf("month"),
          null,
          "[]"
        )
      ).length;

      monthlyCounts.push({
        name: currentMonth.format("MM/YYYY"),
        totalOrders: monthlyOrdersCount,
      });

      currentMonth.add(1, "month");
    }

    return monthlyCounts;
  };

  const updateDailyOrders = (dailyData) => {
    const todayOrders = dailyData[dailyData.length - 1]?.totalOrders || 0;
    const yesterdayOrders = dailyData[dailyData.length - 2]?.totalOrders || 0;
    const change =
      yesterdayOrders > 0
        ? ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100
        : 0;

    setPercentageChange(change.toFixed(2));
  };



  const getTotalLengthOfCurrentMonthOrders = () => {
    const monthlyData = calculateMonthlyOrders(orders);
    const currentMonthData = monthlyData.find(
      (month) => month.name === moment().format("MM/YYYY")
    );
    return currentMonthData?.totalOrders || 0;
  };

  return (
    <div className="dashboard-container px-6 py-4">
      <Typography.Title level={4} className=" text-red-600">
 Agent Dashboard
      </Typography.Title>

      <Row gutter={[16, 16]} justify="center">
  {/* Daily Orders */}
  <Col xs={24} sm={12} md={8}>
    <Card className="shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white rounded-lg p-3">
      <div className="flex items-center justify-start space-x-4 mb-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <ShoppingCartOutlined className="text-blue-500 text-3xl" />
        </div>
        <div>
          <Statistic
            title="Daily Orders"
            value={dailyOrders}
            valueStyle={{
              color: percentageChange >= 0 ? "#3f8600" : "#cf1322",
              fontSize: "24px",
            }}
            prefix={percentageChange >= 0 ? <RiseOutlined /> : <FallOutlined />}
            suffix={
              <span
                style={{
                  fontSize: "14px",
                  marginLeft:'20px',  
                  color: percentageChange >= 0 ? "#3f8600" : "#cf1322",
                }}
              >
                {`${Math.abs(percentageChange)}%`}
              </span>
            }
          />
        </div>
      </div>
    </Card>
  </Col>

  {/* Total Orders */}
  <Col xs={24} sm={12} md={8}>
    <Card className="shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white rounded-lg p-3">
      <div className="flex items-center justify-start space-x-4 mb-4">
        <div className="bg-green-100 p-3 rounded-full">
          <FileTextOutlined className="text-green-500 text-3xl" />
        </div>
        <div>
          <Statistic
            title="Total Orders"
            value={orders.length}
            valueStyle={{ fontSize: "24px" }}
          />
        </div>
      </div>
    </Card>
  </Col>

  {/* Total Orders This Month */}
  <Col xs={24} sm={12} md={8}>
    <Card className="shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white rounded-lg p-3">
      <div className="flex items-center justify-start space-x-4 mb-4">
        <div className="bg-orange-100 p-3 rounded-full">
          <CalendarOutlined className="text-orange-500 text-3xl" />
        </div>
        <div>
          <Statistic
            title="Total Orders This Month"
            value={getTotalLengthOfCurrentMonthOrders()}
            valueStyle={{ fontSize: "24px" }}
          />
        </div>
      </div>
    </Card>
  </Col>
</Row>


      <Row gutter={[16, 16]} style={{ marginTop: "40px" }}>
        <Col span={12}>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300" title="Orders (Last 6 Days)">
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
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300" title="Monthly Orders (Last 6 Months)">
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

      <OrderModal order={null} isModalVisible={false} onClose={() => {}} />
    </div>
  );
};

export default AgentDashboard;
