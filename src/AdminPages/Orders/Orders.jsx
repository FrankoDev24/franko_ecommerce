import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersByDate } from "../../Redux/slice/orderSlice";
import {
  DatePicker,
  Button,
  Table,
  message,
  Empty,
  Input,
  Row,
  Col,
  Tag,
  Tooltip,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import UpdateOrderCycleModal from "./UpdateOrderCycleModal";
import OrderDetailsModal from "./OrderDetailsModal";

const { RangePicker } = DatePicker;
const { Search } = Input;

const Orders = () => {
  const dispatch = useDispatch();
  const { orders = [], loading } = useSelector((state) => state.orders);
  const [dateRange, setDateRange] = useState([null, null]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrderCycle, setSelectedOrderCycle] = useState(null);
  const [searchText, setSearchText] = useState("");

  const fetchCurrentMonthOrders = useCallback(() => {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const endOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    );
    const from = startOfMonth.toISOString().split("T")[0];
    const to = endOfMonth.toISOString().split("T")[0];
    dispatch(fetchOrdersByDate({ from, to }));
  }, [dispatch]);

  const handleDateChange = (dates) => setDateRange(dates);

  const handleFetchOrders = () => {
    if (dateRange[0] && dateRange[1]) {
      const from = dateRange[0].format("YYYY-MM-DD");
      const to = dateRange[1].format("YYYY-MM-DD");
      dispatch(fetchOrdersByDate({ from, to }));
    } else {
      message.error("Please select a date range");
    }
  };

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  const handleRefresh = () => {
    setSearchText(""); // Clear search text
    setDateRange([null, null]); // Clear date range
    fetchCurrentMonthOrders(); // Fetch all orders
  };

  useEffect(() => {
    fetchCurrentMonthOrders();
  }, [fetchCurrentMonthOrders]);

  const openCycleModal = (order) => {
    setSelectedOrderId(order.orderCode);
    setSelectedOrderCycle(order.orderCycle);
    setIsModalOpen(true);
  };

  const openDetailModal = (orderId) => {
    setSelectedOrderId(orderId);
    setIsDetailModalOpen(true);
  };

  const groupedOrders = Object.values(
    orders.reduce((acc, order) => {
      if (!acc[order.orderCode]) {
        acc[order.orderCode] = { ...order, orders: [order] };
      } else {
        acc[order.orderCode].orders.push(order);
      }
      return acc;
    }, {})
  );

  const filteredOrders = groupedOrders
    .filter((order) => {
      if (!order) return false;
      const fullNameMatch =
        order.fullName && order.fullName.toLowerCase().includes(searchText);
      const statusMatch =
        order.orderCycle && order.orderCycle.toLowerCase().includes(searchText);
      return fullNameMatch || statusMatch;
    })
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)); // Newest orders first

  const columns = [
    { title: "Order Code", dataIndex: "orderCode", key: "orderCode" },
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Contact Number", dataIndex: "contactNumber", key: "contactNumber" },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date) =>
        date === "0001-01-01" ? "N/A" : new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
    },
    {
      title: "Status",
      dataIndex: "orderCycle",
      key: "orderCycle",
      render: (orderCycle, record) => {
        let color;
        switch (orderCycle) {
          case "Order Placement":
            color = "orange";
            break;
          case "Processing":
            color = "blue";
            break;
          case "Confirmed":
            color = "green";
            break;
          case "Pending":
            color = "orange";
            break;
          case "Unreachable":
            color = "red";
            break;
          case "Wrong Number":
            color = "purple";
            break;
          case "Cancelled":
            color = "gray";
            break;
          case "Not Answered":
            color = "cyan";
            break;
          case "Delivery":
            color = "gold";
            break;
          case "Completed":
            color = "lime";
            break;
          default:
            color = "default";
            break;
        }
        return (
          <Tag
            color={color}
            onClick={() => openCycleModal(record)}
            style={{ cursor: "pointer" }}
          >
            {orderCycle}
          </Tag>
        );
      },
    },
    
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Tooltip title="View Order">
          <Button
            icon={<EyeOutlined style={{ color: "red"}}/> }
            onClick={() => openDetailModal(record.orderCode)}
            shape="circle"
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <div className="text-2xl font-bold mb-4 text-center text-green-600">
        Orders
      </div>

      <div className="flex justify-between items-center space-x-4 mb-4">
        <div className="flex space-x-4 items-center w-full">
          <RangePicker
            format="MM-DD-YYYY"
            onChange={handleDateChange}
            className="w-full"
          />
        </div>
        <div className="flex space-x-4">
          <Button
            onClick={handleFetchOrders}
            disabled={loading}
            className="w-auto bg-green-600 text-white"
          >
            Fetch Orders
          </Button>
          <Button onClick={handleRefresh} className="w-auto">
            Refresh
          </Button>
        </div>
      </div>

      <Search
        placeholder="Search by name or status"
        onSearch={handleSearch}
        className="w-full mb-4"
      />
      <Row>
        <Col span={24}>
          <div style={{ marginBottom: "20px" }}>
            Total Orders: {filteredOrders.length}
          </div>
        </Col>
      </Row>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>Loading...</div>
      ) : filteredOrders.length > 0 ? (
        <Table
          dataSource={filteredOrders}
          columns={columns}
          rowKey="orderCode"
        />
      ) : (
        <Empty description="No orders found" />
      )}

      <UpdateOrderCycleModal
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderCode={selectedOrderId}
        orderCycle={selectedOrderCycle}
        fetchOrders={fetchCurrentMonthOrders}
      />

      {isDetailModalOpen && (
        <OrderDetailsModal
          orderId={selectedOrderId}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Orders;
