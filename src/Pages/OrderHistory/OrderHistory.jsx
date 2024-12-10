import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersByCustomer } from "../../Redux/slice/orderSlice";
import { DatePicker, Table, Spin, Tooltip, Button } from "antd";
import { EyeOutlined, ShoppingOutlined } from "@ant-design/icons";
import moment from "moment";
import OrderModal from "./OrderModal"; // Import the new OrderModal component
import noOrders from "../../assets/noorders.avif";

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const ordersData = useSelector((state) => state.orders);

  const orders = ordersData?.orders || [];
  const loading = ordersData?.loading || {};
  const error = ordersData?.error || {};

  const today = moment();
  const defaultFromDate = moment("01/01/2000", "MM/DD/YYYY");
  const defaultToDate = today.clone().add(1, "days");

  const [dateRange, setDateRange] = useState([defaultFromDate, defaultToDate]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const customerObject = JSON.parse(localStorage.getItem("customer"));
  const customerId = customerObject?.customerAccountNumber;

  useEffect(() => {
    if (customerId) {
      const [from, to] = dateRange.map((date) => date.format("MM/DD/YYYY"));
      dispatch(fetchOrdersByCustomer({ from, to, customerId }));
    }
  }, [dateRange, customerId, dispatch]);

  const handleDateChange = (dates) => {
    if (dates) {
      setDateRange(dates);
    }
  };

  const handleViewOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (orderId) => orderId.slice(-6),
    },
    { title: "Order Date", dataIndex: "orderDate", key: "orderDate" },
    { title: "Order Status", dataIndex: "orderCycle", key: "orderCycle" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Tooltip title="View Order">
          <EyeOutlined
            className="text-green-700 text-xl cursor-pointer"
            onClick={() => handleViewOrder(record.orderId)}
          />
        </Tooltip>
      ),
    },
  ];

  const transformedOrders = (orders || [])
    .map((order, index) => ({
      key: index,
      orderId: order?.orderCode || "N/A",
      orderDate: moment(order?.orderDate).format("MM/DD/YYYY") || "N/A",
      customerName: order?.fullName || "N/A",
      orderCycle: order?.orderCycle || "N/A",
    }))
    .sort((a, b) =>
      moment(b.orderDate).isBefore(moment(a.orderDate)) ? 1 : -1
    );

  return (
    <div className="order-history-page container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-6 text-red-500">Order History</h2>

      {orders?.length > 0 && (
        <div className="mb-4">
          <label className="text-md">Select Date Range: </label>
          <DatePicker.RangePicker
            value={dateRange}
            onChange={handleDateChange}
            format="MM/DD/YYYY"
            className="mt-2"
          />
        </div>
      )}

      {loading.orders ? (
        <Spin size="large" />
      ) : error.orders ? (
        <p className="text-red-500">Error: {error.orders}</p>
      ) : orders?.length > 0 ? (
        <Table
          dataSource={transformedOrders}
          columns={columns}
          rowKey="key"
          pagination={{ pageSize: 10 }}
        />
      ) : (
        <div className="flex flex-col items-center mt-10">
          <img src={noOrders} alt="No Orders" className="w-64 h-64 mb-4" />
          <p className="text-gray-600 text-lg mb-4">You have no orders yet.</p>
          <Button
            icon={<ShoppingOutlined />}
            size="large"
            onClick={() => (window.location.href = "/franko")} // Redirect to the shopping page
            className="bg-red-500 text-white"
          >
            Start Shopping
          </Button>
        </div>
      )}

      <OrderModal
        orderId={selectedOrderId}
        isModalVisible={isModalVisible}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default OrderHistoryPage;
