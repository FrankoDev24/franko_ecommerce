import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersByDate } from "../../Redux/slice/orderSlice";
import { DatePicker, Button, Table, message, Empty, Spin, Input } from "antd";
import UpdateOrderCycleModal from "./UpdateOrderCycleModal"; // Import the new modal component
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
  const [selectedOrderCycle, setSelectedOrderCycle] = useState(null); // Define the missing state for order cycle
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

  useEffect(() => {
    fetchCurrentMonthOrders();
  }, [fetchCurrentMonthOrders]);

  const openCycleModal = (order) => {
    setSelectedOrderId(order.orderCode);
    setSelectedOrderCycle(order.orderCycle); // Correctly set the orderCycle
    setIsModalOpen(true);
  };

  const openDetailModal = (orderId) => {
    setSelectedOrderId(orderId);
    setIsDetailModalOpen(true);
  };

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  // Group orders by orderCode
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

  const filteredOrders = groupedOrders.filter((order) => {
    if (!order) return false;
    const fullNameMatch =
      order.fullName && order.fullName.toLowerCase().includes(searchText);
    const statusMatch =
      order.orderCycle && order.orderCycle.toLowerCase().includes(searchText);
    return fullNameMatch || statusMatch;
  });

  const columns = [
    {
      title: "Order Code",
      dataIndex: "orderCode",
      key: "orderCode",
      render: (text, record) => (
        <Button type="link" onClick={() => openDetailModal(record.orderCode)}>
          {text}
        </Button>
      ),
    },
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
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
      render: (text, record) => (
        <Button type="link" onClick={() => openCycleModal(record)}>
          {text} {/* The status text should change after the update */}
        </Button>
      ),
    },
  ];

  const closeCycleModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
    setSelectedOrderCycle(null); // Reset the cycle value when modal closes
  };

  return (
    <div>
      <h2>Orders</h2>
      <RangePicker
        format="MM-DD-YYYY"
        onChange={handleDateChange}
        style={{ marginBottom: 16 }}
      />
      <Button
        type="primary"
        onClick={handleFetchOrders}
        disabled={loading}
        style={{ marginRight: 16 }}
      >
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
          rowKey="orderCode"
          expandable={{
            expandedRowRender: (record) => (
              <div>
                {record.orders.map((item, index) => (
                  <div key={index} style={{ marginBottom: 8 }}>
                    <strong>Product:</strong> {item.productName} <br />
                    <strong>Quantity:</strong> {item.quantity} <br />
                    <strong>Price:</strong> ${item.price}
                  </div>
                ))}
              </div>
            ),
          }}
        />
      ) : (
        <Empty description="No orders found" />
      )}

      {/* Update Order Cycle Modal */}
      <UpdateOrderCycleModal
        isVisible={isModalOpen}
        onClose={closeCycleModal}
        orderCode={selectedOrderId}
        orderCycle={selectedOrderCycle}
        fetchOrders={fetchCurrentMonthOrders} // Ensure this fetches orders after cycle update
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
